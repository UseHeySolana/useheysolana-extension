"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSettings from './lib/store/settingsstore';

const Page = () => {
  const router = useRouter();
  const { alreadyOpened, markOpened } = AppSettings()

  useEffect(() => {
    if (alreadyOpened) {
      router.push('/onboardingone');
    } else {
      setTimeout(() => {
        markOpened()
        router.push('/onboardingone')
      }, 3000)
    }

  }, [alreadyOpened, router, markOpened]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <img src='/gif/heysol.gif' alt='gif' />
      </div>
    </div>
  );
};

export default Page;
