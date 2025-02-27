"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboardingone');
    }, 5000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-500">Welcome to Hey Solana</h1>
        <p className="text-lg text-gray-500 mt-4">Your most intuitive wallet is here</p>
      </div>
    </div>
  );
};

export default Page;
