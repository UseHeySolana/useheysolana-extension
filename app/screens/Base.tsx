// components/Base.tsx
import React from 'react';
import Image from 'next/image';
import {
  WalletIcon,
  PaintBrushIcon,
  ArrowPathIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

// Define the interface for props
interface BaseNavProps {
  isSessionActive: boolean;
  startSession: () => void;
  stopSession: () => void;
  isAiActive?: boolean;
}

const Base: React.FC<BaseNavProps> = ({ isSessionActive, startSession, stopSession, isAiActive }) => {
  return (
    <div className="fixed bottom-5 w-screen flex flex-row justify-center items-center px-2">
      <div className="w-fit gap-x-4 bg-[#E1E1E1] p-2 h-[75px] rounded-full flex flex-row justify-between items-center">
        {/* Wallet Icon */}
        <div className="h-14 w-14 border border-[#971BB2] flex items-center justify-center rounded-full">
          <WalletIcon className="h-6 w-6 text-[#971BB2]" />
        </div>

        {/* Palette Icon */}
        <div className="h-14 w-14 border border-[#971BB2] flex items-center justify-center rounded-full">
          <PaintBrushIcon className="h-6 w-6 text-[#971BB2]" />
        </div>

        {/* Central AI Button */}
        <button
          onClick={() => (isSessionActive ? stopSession() : startSession())}
          className="h-[100px] w-[100px] rounded-full overflow-hidden"
        >
          <Image
            src="/images/ai.png" // Adjust path based on your public folder structure
            alt="AI Button"
            width={100}
            height={100}
            className="object-cover"
          />
        </button>

        {/* Refresh Icon */}
        <div className="h-14 w-14 flex items-center justify-center rounded-full">
          <ArrowPathIcon className="h-4 w-4 text-black" />
        </div>

        {/* Globe Icon */}
        <div className="h-14 w-14 flex items-center justify-center rounded-full">
          <GlobeAltIcon className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default Base;