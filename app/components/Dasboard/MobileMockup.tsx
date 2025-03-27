
import React from 'react';
import { cn } from '@/app/lib/utils';

interface MobileMockupProps {
  children: React.ReactNode;
  className?: string;
}

const MobileMockup: React.FC<MobileMockupProps> = ({ children, className }) => {
  return (
    <div className={cn("mx-auto", className)}>
      <div className="relative max-w-md mx-auto">
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 py-2 bg-gray-100 rounded-t-3xl">
          <div className="text-black font-semibold">9:41</div>
          <div className="w-32 h-6 bg-black rounded-full"></div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
            <div className="w-4 h-4 bg-black rounded-sm"></div>
            <div className="w-6 h-3 border border-black rounded-sm relative">
              <div className="absolute right-0.5 top-0.5 w-1 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-gray-100 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileMockup;
