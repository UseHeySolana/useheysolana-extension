"use client";


import React from 'react';
import { useRouter } from 'next/navigation'; 
import TopSwitch from '@/app/components/TopSwitch';
import Image from 'next/image';
import Voice from '@/public/img/voice.png';
import Button from '@/app/components/ui/Button';

const OnboardingOne = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboardingtwo');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-white">
      {/* Top Section */}
      <TopSwitch currentScreen={0} />

      {/* Middle Section */}
      <div className="relative flex flex-col items-center">
        <Image src={Voice} alt="Voice" />
      </div>


      {/* Bottom Section - Text & Button */}
      <div className="px-4 text-center flex flex-col items-center mb-12">
        <h1 className="text-2xl font-bold text-gray-800">
          Control Your Wallet <br /> with Just Your Voice
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Say &quot;Hey Solana&quot; to send, trade, and manage crypto <br />
          hands-free. Your most intuitive wallet is here.
        </p>

        <div className='mt-4'>
          <Button text="Next" bgColor="#971BB2" className='mt-10' onClick={handleNext} />
        </div>


      </div>

    </div>
  );
};

export default OnboardingOne;
