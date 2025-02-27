'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Quote from '@/public/img/quote.png';
import Button from '@/app/ui/Button';

const VoiceRegistration = () => {
    const router = useRouter();

    const handleNext = () => {
        router.push('/voiceregistrationconfirm');
    };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-6 bg-white">
      {/* Quote and Text */}
      <div className="flex flex-col items-start w-full max-w-md">
        <Image src={Quote} alt="Quote" width={40} height={40} />
        <h1 className="text-4xl font-bold text-gray-300 leading-tight">
          Hey Solana, <br /> send 5 SOL <br /> to Alex
        </h1>
      </div>

      {/* Instruction Text */}
      <p className="mt-40 text-gray-600 text-lg text-left w-full max-w-md">
        Let’s Register Your Voice! <br />
        Say The Big Text You See On Your Screen, LFG
      </p>

      {/* Button */}
      <div className="fixed bottom-0 mb-12 left-0 right-0 flex flex-col items-center px-6">
        <Button text="Next" bgColor="#971BB2" onClick={handleNext} />
      </div>
    </div>
  );
};

export default VoiceRegistration;
