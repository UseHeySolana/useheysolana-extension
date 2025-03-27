"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import BackButton from "@/app/components/ui/BackButton";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";
import * as web3 from "@solana/web3.js";

export default function SendToken() {
  const { name, symbol, balance, address, setAddress, image } = useStore();
  const [inputAddress, setInputAddress] = useState(address);
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Checking address");

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inputAddress) {
      setIsValidAddress(null);
      setLoadingMessage("Checking address");
      interval = setInterval(() => {
        setLoadingMessage((prev) => {
          if (prev.endsWith("....")) {
            return "Checking address";
          }
          return prev + ".";
        });
      }, 500);

      setTimeout(() => {
        try {
          const pubkey = new web3.PublicKey(inputAddress);
          setIsValidAddress(web3.PublicKey.isOnCurve(pubkey));
        } catch {
          setIsValidAddress(false);
        } finally {
          clearInterval(interval);
        }
      }, 5000);
    } else {
      setIsValidAddress(null);
    }

    return () => clearInterval(interval);
  }, [inputAddress]);

  const handleNext = () => {
    if (isValidAddress) {
      setAddress(inputAddress);
      router.push("/amount");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex gap-2 items-center">
          <BackButton />
          <h1 className="text-lg text-black">Send {name}</h1>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
        <div>
          <Image src={image} alt={name} width={40} height={40} />
        </div>
        <div>
          <h2 className="text-black font-semibold">{name}</h2>
          <p className="text-gray-500">{balance} {symbol}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mt-4">
        <input
          type="text"
          placeholder="Enter recipient address or username"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="w-full py-4 px-4 rounded-md text-black focus:outline-none"
        />
        <div className="w-full h-[3px] bg-[#D9D9D9]"></div>
        <p className={`p-4 ${isValidAddress === null ? "text-gray-500" : isValidAddress ? "text-green-500" : "text-red-500"}`}>
          {isValidAddress === null ? loadingMessage : isValidAddress ? "Solana address detected" : "This is not an SPL address"}
        </p>
      </div>

      <div className="flex align-center justify-center mt-4">
        <Button text="Next" onClick={handleNext} className="bottom-0 absolute mb-5" />
      </div>
    </div>
  );
}
