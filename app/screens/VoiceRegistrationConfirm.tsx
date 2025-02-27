"use client";

import React, { useState } from "react";
import Image from "next/image";
import WalletModal from "@/app/modals/WalletModal";
import Quote from "@/public/img/quote.png";
import Button from "@/app/ui/Button";

const VoiceRegistrationConfirm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center h-screen px-6 relative">
      {/* Blur Background when Modal is Open */}
      {isModalOpen && <div className="absolute inset-0 bg-black opacity-50 z-10"></div>}

      {/* Main Content */}
      <div className="relative flex flex-col items-center w-full max-w-md text-center z-20">
        <Image src={Quote} alt="Quote" width={40} height={40} className="absolute top-0 left-0" />

        <h1 className="text-4xl font-bold text-black leading-tight mt-10">
          Hey Solana, <br /> send 5 SOL <br /> to Alex
        </h1>

        <Image src={Quote} alt="Quote" width={40} height={40} className="absolute bottom-0 right-0 rotate-180" />
      </div>

      {/* Instructions */}
      <p className="mt-16 text-gray-600 text-lg text-center w-full max-w-md z-20">
        Let’s Register Your Voice! <br />
        Say The Big Text You See On Your Screen, LFG
      </p>

      {/* Next Button */}
      <div className="fixed bottom-0 mb-12 left-0 right-0 flex flex-col items-center px-6 z-20">
        <Button text="Next" bgColor="#971BB2" onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default VoiceRegistrationConfirm;
