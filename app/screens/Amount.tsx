"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import BackButton from "@/app/components/ui/BackButton";
import CopyImg from "@/public/img/copy.png";
import Button from "../components/ui/Button";
import UpDownArrow from "@/public/img/updownarrow.png";
// import WalletModal from "@/app/modals/WalletModal";
import ConfirmTransactionModal from "@/app/modals/ConfirmTransactionModal";



const formatAddress = (address: string) => {
  if (address.length > 8) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  return address;
};

export default function Amount() {
  const { address, balance, image, setAmountInStore } = useStore();
  const [amount, setAmount] = useState("");
  const [usdValue, setUsdValue] = useState(0);
  const [inputMode, setInputMode] = useState<"SOL" | "USD">("SOL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const conversionRate = 20; // 1 SOL = 20 USD

  useEffect(() => {
    const value = parseFloat(amount);
    if (!isNaN(value)) {
      if (inputMode === "SOL") {
        setUsdValue(value * conversionRate);
      } else {
        setUsdValue(value);
        setAmount((value / conversionRate).toFixed(2));
      }
    } else {
      setUsdValue(0);
    }
  }, [amount, inputMode]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSwap = () => {
    if (inputMode === "SOL") {
      setInputMode("USD");
      setAmount(usdValue.toFixed(2));
    } else {
      setInputMode("SOL");
      setAmount((usdValue / conversionRate).toFixed(2));
    }
  };

  const handleMaxClick = () => {
    if (inputMode === "SOL") {
      setAmount(balance.toString());
    } else {
      setAmount((balance * conversionRate).toFixed(2));
    }
  };

  const handleConfirmClick = () => {
    setAmountInStore(amount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex gap-2 items-center">
          <BackButton />
          <h1 className="text-lg text-black">Enter Amount:</h1>
        </div>
        <div>
          <Image src={CopyImg} alt="Copy" width={40} height={40} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
        <div>
          <Image src={image} alt="Token Image" width={40} height={40} />
        </div>
        <div>
          <h2 className="text-black font-semibold">{address ? formatAddress(address) : "No address provided"}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mt-4 h-40">
        <div className="bg-white p-6 rounded-xl">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="text-black text-4xl font-semibold w-full focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <p className="text-gray-500 flex items-center">
              ${inputMode === "SOL" ? usdValue.toFixed(2) : amount}
            </p>
            <Image
              src={UpDownArrow}
              alt="UpDownArrow"
              width={20}
              height={20}
              onClick={handleSwap}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-gray-200 h-1"></div>

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md">
          <div>
            <p className="text-black text-lg font-semibold">{balance} SOL</p>
            <p className="text-gray-500 text-sm">Available balance</p>
          </div>
          <button className="bg-gray-200 text-black text-sm px-8 py-2 rounded-full font-medium" onClick={handleMaxClick}>max</button>
        </div>
      </div>

      <div className="flex item-center justify-center">
        <Button text="Confirm" onClick={handleConfirmClick} className="bottom-0 absolute mb-5" />
      </div>

      {/* Conditionally render the WalletModal */}
      <ConfirmTransactionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

