import React from 'react';
import { Settings, ChevronDown, Scan } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import ProfileImage from '@/public/img/profile.png';

interface AccountHeaderProps {
  className?: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ className }) => {
  return (
    <div className={cn("w-full flex justify-between items-center px-4 py-3", className)}>
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Settings className="w-6 h-6 text-gray-700" />
      </div>

      <button className="flex cursor-pointer items-center gap-2 bg-white py-3 px-5 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <Image src={ProfileImage} alt="Profile" width={24} height={24} className="w-full h-full object-cover" />
        </div>
        <span className="text-base text-black font-medium">Account 1</span>
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </button>

      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Scan className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  );
};

export default AccountHeader;
