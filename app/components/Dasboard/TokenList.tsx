
import React from 'react';
import TokenItem from './TokenItem';
import { cn } from '@/app/lib/utils';

interface TokenListProps {
  className?: string;
}

const TokenList: React.FC<TokenListProps> = ({ className }) => {
  // We're using a placeholder image for Solana logo
  // const solanaLogoSrc = '/lovable-uploads/2b81c68d-10bf-484d-8377-8286f03db941.png';
  
  return (
    <div className={cn("w-full mt-4", className)}>
      <TokenItem
        name="Solana"
        symbol="SOL"
        balance="0.00"
        dollarValue="$0.00"
        percentChange="0.00%"
        logoSrc="https://cryptologos.cc/logos/solana-sol-logo.png"
      />
    </div>
    
  );
};

export default TokenList;
