"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/ui/BackButton";
import { useStore } from "@/store/useStore"; // Import Zustand store
import SolanaImg from "@/public/img/solana.png";
import EthereumImg from "@/public/img/ethereum.png";
import PolygonImg from "@/public/img/polygon.png";
import QrCode from "@/public/img/qr-code.png";
import CopyImg from "@/public/img/copy1.png";
import { LuQrCode } from "react-icons/lu";
import { IoCopyOutline } from "react-icons/io5";



type Token = {
  name: string;
  symbol: string;
  balance: number;
  icon: StaticImageData;
};

const tokens: Token[] = [
  { name: "Solana", symbol: "SOL", balance: 7.9468, icon: SolanaImg },
  { name: "Ethereum", symbol: "ETH", balance: 0.4986, icon: EthereumImg },
  { name: "Polygon", symbol: "POL", balance: 0, icon: PolygonImg },
];

export default function Recieve() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const setToken = useStore((state) => state.setToken);

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectToken = (token: Token) => {
    setToken(token.name, token.symbol, token.balance, token.icon.src);
    router.push("/sendtoken");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="text-lg text-black">Select Token to Recieve</h1>
      </div>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-black p-4 bg-white border-none border-gray-300 rounded-xl mb-4 focus:outline-none"
      />

      <div className="bg-white rounded-xl shadow-md">
        {filteredTokens.map((token) => (
          <div
            key={token.symbol}
            onClick={() => handleSelectToken(token)}
            className="flex items-center p-4 border-b last:border-none cursor-pointer"
          >
            <Image src={token.icon} alt={token.name} width={40} height={40} className="mr-3" />
            <div className="flex justify-between w-full">
              <div>
                <h2 className="font-semibold text-black">{token.name}</h2>
                <p className="text-gray-500 text-sm">
                  {token.balance} {token.symbol}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center bg-gray-200 p-[12px] rounded-full">
                    <IoCopyOutline color="black" className="w-[20px] h-[20px]"/>
                </div>
                <div className="flex items-center bg-gray-200 p-[12px] rounded-full">
                    <LuQrCode color="black" className="w-[20px] h-[20px]"/>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
