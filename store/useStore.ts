"use client";

import { create } from "zustand";

type StoreState = {
  pin: string | null;
  name: string;
  symbol: string;
  balance: number;
  address: string;
  image: string;
  amount: string;
  setPin: (pin: string) => void;
  setAmountInStore: (amount: string) => void;
  setAddress: (address: string) => void;
  setToken: (name: string, symbol: string, balance: number, image: string) => void;
};

export const useStore = create<StoreState>((set) => ({
  pin: null,
  name: "",
  symbol: "",
  balance: 0,
  address: "",
  image: "",
  amount: "",
  setPin: (pin) => set({ pin }),
  setAmountInStore: (amount) => set({ amount }),
  setAddress: (address) => set({ address }),
  setToken: (name, symbol, balance, image) => set({ name, symbol, balance, image }),
}));

