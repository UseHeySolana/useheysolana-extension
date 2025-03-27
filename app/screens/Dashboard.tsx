
import React from 'react';
import AccountHeader from '@/app/components/Dasboard/AccountHeader';
import BalanceCard from '@/app/components/Dasboard/BalanceCard';
import ActionButtons from '@/app/components/Dasboard/ActionButtons';;
import WelcomeNotification from '@/app/components/Dasboard/WelcomeNotification';
import TokenNavigation from '@/app/components/Dasboard/TokenNavigation';
import TokenSearch from '@/app/components/Dasboard/TokenSearch';
import TokenList from '@/app/components/Dasboard/TokenList';
import ManageTokensButton from '@/app/components/Dasboard/ManageTokensButton';
import BottomNavigation from '@/app/components/Dasboard/BottomNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-32">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Header with account selector */}
        <AccountHeader className="mt-4" />
        
        {/* Balance display */}
        <div className="mt-4 bg-white rounded-3xl pb-4 pt-4">
          <BalanceCard />
            <div className="w-full h-[4px] bg-[#D9D9D9]"></div>

          <ActionButtons className='px-4'/>
        </div>
        
        {/* Welcome notification */}
        <div className="mt-6">
          <WelcomeNotification />
        </div>
        
        {/* Token section with tabs */}
        <div className="px-4 mt-6 bg-white rounded-t-3xl pt-2">
          <TokenNavigation />
          <TokenSearch className="mt-4" />
          <TokenList />
          <div className="py-6">
            <ManageTokensButton />
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
