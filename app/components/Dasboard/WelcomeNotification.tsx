"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface WelcomeNotificationProps {
  className?: string;
}

const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const dismissNotification = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "w-full bg-white rounded-3xl p-4 shadow-sm animate-slide-up neo-morphism relative",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl">👋</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black mb-1">Welcome to Hey Solana!</h3>
          <p className="text-gray-600 text-sm">Hands-free crypto control starts here.</p>
        </div>
        <button 
          onClick={dismissNotification}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeNotification;
