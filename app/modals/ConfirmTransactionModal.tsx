"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
// import Button from "@/app/components/ui/Button";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatAddress = (address: string) => {
  if (address.length > 8) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  return address;
};

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  //   const router = useRouter();
  //   const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { address, name, amount } = useStore();
  const networkFee = parseFloat(amount) * 0.1;

  const handleCancel = () => {
    onClose();
  };
  const handleConfirm = () => {
    console.log("Confirming transaction");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      {/* Main Modal */}
      <motion.div
        className="bg-white rounded-t-3xl w-full max-w-md shadow-lg"
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ type: "spring", stiffness: 100 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="bg-[#F3F3F3] h-full rounded-3xl h-16">
            <h2 className="text-xl text-black font-bold text-left p-4">
              Wallet
            </h2>

            <div>
              <div className="flex items-center justify-between pb-2 px-4">
                <p className="text-[#666666]">Send To:</p>
                <h2 className="text-black font-semibold">
                  {address ? formatAddress(address) : "No address provided"}
                </h2>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-2 px-4">
                <p className="text-[#666666]">Amount:</p>
                <h2 className="text-black font-semibold">{amount}</h2>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-2 px-4">
                <p className="text-[#666666]">Network Fee:</p>
                <h2 className="text-black font-semibold">{networkFee}</h2>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-2 px-4">
                <p className="text-[#666666]">Network:</p>
                <h2 className="text-black font-semibold">{name}</h2>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-between p-4">
            <Button text="Cancel" onClick={handleCancel} className="w-full"/>

            <Button text="Confirm" onClick={handleConfirm} />
        </div> */}
        <div className="flex justify-between p-4">
            <button onClick={handleCancel} className="bg-[#F1F1F1] py-[15px] w-[180px] rounded-full text-black">
                Cancel
            </button>
            <button onClick={handleConfirm} className="bg-[#971BB2] py-[15px] w-[180px] rounded-full">
                Confirm
            </button>

        </div>
      </motion.div>
    </div>
  );
};

export default WalletModal;
