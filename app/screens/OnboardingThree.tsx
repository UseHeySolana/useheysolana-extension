"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Voice from '@/public/img/onboarding3.png';
import TopSwitch from '@/app/components/TopSwitch';
import Button from '@/app/components/ui/Button';


const OnboardingThree = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/voiceselect');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-white">
      {/* Top Section */}
      <TopSwitch currentScreen={2} />
      
      {/* Middle Section */}
      <div className="relative flex flex-col items-center">
        <Image src={Voice} alt="Voice" width={300} height={300} />
      </div>

      {/* Bottom Section - Text & Button */}
      <div className="px-4 text-center flex flex-col items-center gap-4 mb-12">
        <h1 className="text-2xl font-bold text-gray-800">
            Secure & Fast - Your <br/> Security, Our Priority
        </h1>
        <p className="text-sm text-gray-500 mt-2">
            Experience top-notch security, with full control <br/> over permissions and privacy.
        </p>

        <div className='mt-4'>
          <Button text="Next" bgColor="#971BB2" onClick={handleNext} />
        </div>
      </div>


    </div>
  );
};

export default OnboardingThree;