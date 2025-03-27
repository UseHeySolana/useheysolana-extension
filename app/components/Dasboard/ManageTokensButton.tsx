
import React from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ManageTokensButtonProps {
  className?: string;
}

const ManageTokensButton: React.FC<ManageTokensButtonProps> = ({ className }) => {
  return (
    <button 
      className={cn(
        "w-full bg-gray-100 hover:bg-gray-200 rounded-full py-3 flex items-center justify-center gap-2 transition-all neo-morphism",
        className
      )}
    >
      <ListFilter className="w-5 h-5 text-gray-700" />
      <span className="font-medium text-gray-700">Manage tokens</span>
    </button>
  );
};

export default ManageTokensButton;
