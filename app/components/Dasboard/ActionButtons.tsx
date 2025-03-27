
import React from 'react';
import { ArrowUpRight, CreditCard, RefreshCw } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';

interface ActionButtonsProps {
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => {

  return (
    <div className={cn("w-full flex items-center gap-4 mt-4", className)}>
      <Link href="/selecttoken">
        <button className="flex-1 bg-[#971BB2] hover:bg-purple text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
          <ArrowUpRight className="w-5 h-5" />
          <span className="font-medium">Send</span>
        </button>
      </Link>
      
      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
        <CreditCard className="w-5 h-5" />
        <span className="font-medium">Buy</span>
      </button>
      
      <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
        <RefreshCw className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default ActionButtons;
