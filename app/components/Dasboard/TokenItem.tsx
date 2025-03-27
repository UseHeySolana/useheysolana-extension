
import React from 'react';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import Token from '@/public/img/token.png';

interface TokenItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  dollarValue: string;
  percentChange: string;
  logoSrc: string;
}

const TokenItem: React.FC<TokenItemProps> = ({
  className,
  name,
  symbol,
  balance,
  dollarValue,
  percentChange,
}) => {
  return (
    <div className={cn("w-full py-4 flex items-center", className)}>
      <div className="mr-4">
        <Image src={Token} alt={name} width={50} height={50} className="w-10 h-10 rounded-full object-contain" />

      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-black text-lg">{name}</h3>
        <p className="text-gray-500">{balance} {symbol}</p>
      </div>
      
      <div className="text-right">
        <h4 className="font-semibold text-black text-lg">{dollarValue}</h4>
        <p className="text-gray-500">{percentChange}</p>
      </div>
    </div>
  );
};

export default TokenItem;
