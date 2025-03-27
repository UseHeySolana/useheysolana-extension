"use client"

import React, { useState } from "react";
import { Eye, EyeOff, Copy, QrCode } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface BalanceCardProps {
  className?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ className }) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  return (
    <div className={cn("w-full p-6 ", className)}>
      {/* Balance and Buttons on the Same Line */}
      <div className="flex justify-between items-center">
        {/* Balance Display */}
        <h1 className="text-5xl text-black font-semibold transition-all duration-300">
          {isBalanceHidden ? "••••••" : "$0.00"}
        </h1>

        {/* Copy & QR Code Buttons */}
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all hover:bg-gray-200">
            <Copy className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all hover:bg-gray-200">
            <QrCode className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Show/Hide Balance Button */}
      <button 
        onClick={toggleBalanceVisibility}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mt-2"
      >
        {isBalanceHidden ? (
          <>
            <span>Show balance</span>
            <Eye className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>Hide balance</span>
            <EyeOff className="w-4 h-4" />
          </>
        )}
      </button>

    </div>
  );
};

export default BalanceCard;
