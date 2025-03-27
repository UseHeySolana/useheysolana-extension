"use client";

import React from "react";
import Image from "next/image";
import { Home, Palette, RefreshCcw, Globe } from "lucide-react";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center justify-between bg-gray-100 px-6 py-3 rounded-t-3xl shadow-md">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <button className="flex flex-col items-center text-purple-600">
          <Home size={24} />
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Palette size={24} />
        </button>
      </div>

      {/* Center Button */}
      <div className="relative flex items-center justify-center -mt-10">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Image
            src="/img/centerIcon.png"
            alt="Center Icon"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="flex flex-col items-center text-gray-500">
          <RefreshCcw size={24} />
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Globe size={24} />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
