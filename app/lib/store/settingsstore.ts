import { create } from 'zustand';
import { createJSONStorage, persist, } from 'zustand/middleware';

interface Settings {
    theme: string;
    notifications: boolean;
    aiVoice: string;
    network: "mainnet" | "devnet";
    alreadyOpened: boolean;
    updateTheme: (newTheme: string) => void;
    markOpened: () => void;
    markedSkipped: () => void;
    skippedAiSettings: boolean,
    createdWallet: boolean,
    updateNotifications: (newNotifications: boolean) => void;
    updateAiVoice: (newAiVoice: string) => void;
    setDefault: () => void;
}

const AppSettings = create(
    persist<Settings>(
        (set) => ({
            theme: "light",
            notifications: true,
            aiVoice: "nova",
            network: "devnet",
            alreadyOpened: false,
            skippedAiSettings: false,
            createdWallet: false,
            updateTheme: (newTheme: string) => set({ theme: newTheme }),
            markOpened: () => set({ alreadyOpened: true }),
            markedSkipped: () => set({ skippedAiSettings: true }),
            updateNotifications: (newNotifications: boolean) => set({ notifications: newNotifications }),
            updateAiVoice: (newAiVoice: string) => set({ aiVoice: newAiVoice }),
            setDefault: () => set({ theme: "light", notifications: true, aiVoice: "nova", network: "mainnet" })
        }),
        {
            name: 'settings', // Storage key
            storage: createJSONStorage(() => localStorage), // Use AsyncStorage for React Native
            onRehydrateStorage: () => (state) => {
                console.log("Rehydrating:", state);
            }
        }
    )
);

export default AppSettings;
