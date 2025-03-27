"use client"


import React, { useState } from 'react';
import { cn } from '@/app/lib/utils';

interface TokenNavigationProps {
  className?: string;
}

const TokenNavigation: React.FC<TokenNavigationProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'history'>('tokens');
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex relative">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex-1 text-center py-4 font-medium text-lg transition-colors ${
            activeTab === 'tokens' ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          Tokens
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 text-center py-4 font-medium text-lg transition-colors ${
            activeTab === 'history' ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          History
        </button>
        <div 
          className={`tab-indicator ${activeTab === 'history' ? 'history' : ''}`}
        />
      </div>
    </div>
  );
};

export default TokenNavigation;
