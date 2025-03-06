import { create } from 'zustand';
import { createJSONStorage, persist, } from 'zustand/middleware';
import { storage } from '../helpers/storage';
import { Connection, PublicKey } from '@solana/web3.js';
import { fetchUser } from '../helpers/db';
import { fetchConversionRate, fetchTokenAccounts, getBalance } from '../helpers/wallet';

export interface UserDetails {
  balance: number,
  userName: string,
  solBalance: number,
  tokenAccounts: any[],
  totalUsdBalance: number,
}
interface UserSettings {
  userDetails: UserDetails | null;
  networkSettings: string,
  api_key: string;
  setNetworkSettings: (network: string) => void;
  updateUserDetails: () => void;
  connection: Connection | null;
  publicKey: null,
}

const UserDetails = create(
  persist<UserSettings>(
    (set, get) => ({
      userDetails: null,
      api_key: process.env.NEXT_PUBLIC_HELIUS_API || "",
      networkSettings: storage.get("network"),
      connection: null,
      publicKey: null,


      // Initialize connection on store creation
      init: () => {
        const { api_key, publicKey, connection } = get();
        let network = storage.get("network");
        if (typeof (network) == "undefined") {
          network = "https://devnet.helius-rpc.com/?api-key="
        };
        let user: any

        if (!publicKey) return
        (async () => {
          const userId = storage.get("user_id")
          if (userId) {
            const userData = await fetchUser(userId);
            const Solbalance = await getBalance(publicKey, connection);
            const rate = await fetchConversionRate("So11111111111111111111111111111111111111112");
            const balance = Number(Solbalance) * rate;
            let usdBalance = balance;

            const tokens = await fetchTokenAccounts(publicKey, network)
            const fungible = tokens.result.items.filter((item: any) => item.interface === "FungibleToken").map((token: any) => {
              const tokenInfo = token?.token_info;
              const content = token?.content?.metadata;
              usdBalance +=
                tokenInfo?.price_info?.total_price == undefined
                  ? 0
                  : tokenInfo?.price_info?.total_price;
              return {
                name: content?.name,
                image: token?.content?.links?.image,
                symbol: content?.symbol,
                balance:
                  tokenInfo?.balance * Math.pow(10, -tokenInfo?.decimals),
                decimals: tokenInfo?.decimals,
                usdc_price: tokenInfo?.price_info?.total_price,
                mint: token?.id,
              };
            })
              ;

            user = {
              balance: Number(balance.toFixed(2)),
              solBalance: Number(Solbalance?.toFixed(4)),
              userName: userData ? userData.username : "",
              tokenAccounts: tokens ? fungible : [],
              totalUsdBalance: usdBalance,
            };
          }
        })()

        set({
          userDetails: user,
          networkSettings: network,
          connection: new Connection(network + api_key),
        });
      },

      updateUserDetails: () => { },
      setNetworkSettings: (network: string) => set({ networkSettings: network }),
    }),
    {
      name: 'useritem', // Storage key
      storage: createJSONStorage(() => localStorage), // Use AsyncStorage for React Native
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating:", state);
      }
    }
  )
);

export default UserDetails;
