
import React from 'react';
import { CreditCard, Palette, RefreshCw, Globe } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className }) => {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white py-3 px-4 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50",
      className
    )}>
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-purple">
          <CreditCard className="w-6 h-6" />
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-gray-500">
          <Palette className="w-6 h-6" />
        </button>
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-solana-gradient1 to-solana-gradient2 flex items-center justify-center shadow-lg relative -mt-8">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center animate-pulse-light">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-solana-gradient1 to-solana-gradient2 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full absolute"></div>
            </div>
          </div>
        </div>
        
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-gray-500">
          <RefreshCw className="w-6 h-6" />
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-gray-500">
          <Globe className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
