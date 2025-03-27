
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TokenSearchProps {
  className?: string;
}

const TokenSearch: React.FC<TokenSearchProps> = ({ className }) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 text-black rounded-full pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple/20 transition-all"
        />
      </div>
    </div>
  );
};

export default TokenSearch;
