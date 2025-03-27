import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { fetchUser } from '../helpers/db';
import { fetchConversionRate, fetchTokenAccounts, generateMnemonic, getBalance, getKeypairFromMnemonic } from '../helpers/wallet';

// Add TypeScript types for the Credential Management API
declare global {
    interface Window {
        PasswordCredential: {
            new(data: { id: string; password: string; name?: string }): PasswordCredential;
        };
    }

    interface PasswordCredential extends Credential {
        password: string;
    }

    interface CredentialRequestOptions {
        password?: boolean;
        mediation?: CredentialMediationRequirement;
    }
}

// Create a secure storage adapter specifically for web
const webSecureStorage = {
    // The getItem function retrieves an item from secure storage
    getItem: async (name) => {
        try {
            // Check if the Credential Management API is available
            if (typeof window === 'undefined' || !window.navigator.credentials) {
                console.warn('Credential Management API not available in this browser');
                return null;
            }

            // Use the Credential Management API to get the stored credential
            const credential = await window.navigator.credentials.get({
                mediation: 'silent', // Don't show UI
                // Use the password credential type properly
                password: true
            } as CredentialRequestOptions) as PasswordCredential | null;

            // Parse the stored data - we store all values under one credential
            if (credential && credential.id === 'wallet-storage') {
                const storedData = JSON.parse(credential.password);
                return storedData[name] || null;
            }

            return null;
        } catch (error) {
            console.error('Error reading from secure storage:', error);
            return null;
        }
    },

    // The setItem function stores an item in secure storage
    setItem: async (name, value) => {
        try {
            // Check if the Credential Management API is available
            if (typeof window === 'undefined' || !window.navigator.credentials) {
                console.warn('Credential Management API not available in this browser');
                return;
            }

            // First, retrieve existing data (if any)
            let storedData = {};
            const existingCredential = await window.navigator.credentials.get({
                mediation: 'silent',
                password: true
            } as CredentialRequestOptions) as PasswordCredential | null;

            if (existingCredential && existingCredential.id === 'wallet-storage') {
                storedData = JSON.parse(existingCredential.password);
            }

            // Update with the new value
            storedData[name] = value;

            // Store all values under one credential - using proper typing
            // First, create credential data object that conforms to PasswordCredentialData
            const credentialData = {
                id: 'wallet-storage',
                password: JSON.stringify(storedData),
                name: 'Wallet Storage'
            };

            // Then create the credential
            await window.navigator.credentials.store(
                new window.PasswordCredential(credentialData)
            );
        } catch (error) {
            console.error('Error writing to secure storage:', error);
        }
    },

    // The removeItem function removes an item from secure storage
    removeItem: async (name) => {
        try {
            // Check if the Credential Management API is available
            if (typeof window === 'undefined' || !window.navigator.credentials) {
                console.warn('Credential Management API not available in this browser');
                return;
            }

            // First, retrieve existing data (if any)
            const existingCredential = await window.navigator.credentials.get({
                mediation: 'silent',
                password: true
            } as CredentialRequestOptions) as PasswordCredential | null;

            if (existingCredential && existingCredential.id === 'wallet-storage') {
                const storedData = JSON.parse(existingCredential.password);

                // Remove the specific item
                delete storedData[name];

                // Store the updated data - using proper typing
                const credentialData = {
                    id: 'wallet-storage',
                    password: JSON.stringify(storedData),
                    name: 'Wallet Storage'
                };

                await window.navigator.credentials.store(
                    new window.PasswordCredential(credentialData)
                );
            }
        } catch (error) {
            console.error('Error removing from secure storage:', error);
        }
    }
};

// Create a middleware that handles the async nature of web secure storage
const createWebSecureStorage = () => {
    // Check if the browser supports the Credential Management API
    const isSupported =
        typeof window !== 'undefined' &&
        !!window.navigator.credentials &&
        !!window.PasswordCredential;

    // If not supported, provide a warning and fallback
    if (!isSupported) {
        console.warn(
            'Your browser does not support the Credential Management API for secure storage. ' +
            'Your wallet data will not be persisted securely. ' +
            'Consider using a modern browser like Chrome, Edge, or Firefox.'
        );

        // Fallback to sessionStorage (more secure than localStorage, but still not ideal)
        return {
            getItem: async (name) => {
                try {
                    return sessionStorage.getItem(name);
                } catch (e) {
                    console.error('Error accessing sessionStorage:', e);
                    return null;
                }
            },
            setItem: async (name, value) => {
                try {
                    sessionStorage.setItem(name, value);
                } catch (e) {
                    console.error('Error writing to sessionStorage:', e);
                }
            },
            removeItem: async (name) => {
                try {
                    sessionStorage.removeItem(name);
                } catch (e) {
                    console.error('Error removing from sessionStorage:', e);
                }
            },
        };
    }

    // Return the secure storage implementation
    return {
        getItem: async (name) => {
            return await webSecureStorage.getItem(name);
        },
        setItem: async (name, value) => {
            await webSecureStorage.setItem(name, value);
        },
        removeItem: async (name) => {
            await webSecureStorage.removeItem(name);
        },
    };
};

// Interface for our wallet state
interface WalletState {
    mnemonic: string | null;
    keyPair: Keypair | null;
    keyPairData?: number[] | null; // Temporary property for serialization
    init: () => void;
    isHydrated: boolean;
}

// Create the store with persistence using web secure storage
const useWalletStore = create<WalletState>()(
    persist(
        (set, get) => ({
            keyPair: null,
            mnemonic: null,
            isHydrated: false,

            // Initialize wallet
            init: () => {
                const newMnemonic = generateMnemonic();
                const newKeyPair = getKeypairFromMnemonic(newMnemonic);

                set({
                    mnemonic: newMnemonic,
                    keyPair: newKeyPair,
                });
            },
        }),
        {
            name: 'wallet', // Storage key
            storage: createWebSecureStorage(),

            // Use the partialize option instead for TypeScript compatibility
            partialize: (state) => {
                // Only persist mnemonic, convert keyPair to a format that can be serialized
                return {
                    mnemonic: state.mnemonic,
                    keyPairData: state.keyPair ?
                        Array.from(state.keyPair.secretKey) :
                        null,
                };
            },
            // Use onRehydrateStorage to handle the keypair reconstruction
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert the stored keyPairData back to a Keypair if it exists
                    if (state.keyPairData) {
                        state.keyPair = Keypair.fromSecretKey(
                            Uint8Array.from(state.keyPairData)
                        );
                        // Remove the temporary data property
                        delete state.keyPairData;
                    }

                    // Set isHydrated flag
                    state.isHydrated = true;
                }
                console.log("Rehydrated wallet from secure storage");
            },
        }
    )
);

export default useWalletStore;