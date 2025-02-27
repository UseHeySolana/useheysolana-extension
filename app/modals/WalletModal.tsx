"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import WalletImage from "@/public/img/wallet.png";
import CreateWallet from "@/public/img/createWallet.png";
import ImportWallet from "@/public/img/importWallet.png";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  if (!isOpen) return null;

  const handleNext = () => {
    router.push("/seedphrase");
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50" onClick={onClose}>
      {/* Blurred Quote Mark */}
      <motion.div
        className="absolute top-4 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-8xl text-purple-600 blur-sm select-none">&quot;&quot;</div>
      </motion.div>

      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-t-3xl w-full max-w-md shadow-lg"
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ type: "spring", stiffness: 100 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 
        ">
          {/* <div className="w-4/12 h-2 bg-black flex flex-col items-center justify-center rounded-full relative"></div> */}
          <h2 className="text-2xl text-black font-bold text-center mb-6">Wallet</h2>


          {/* Wallet Image */}
          <Image src={WalletImage} alt="Wallet" width={200} height={200} className="mx-auto mb-6" />

          {/* Wallet Options */}
          <div className="space-y-4 cursor-pointer mb-20">
            <button className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <div className="flex items-center gap-3" onClick={handleNext}>
                <Image src={CreateWallet} alt="Create Wallet" width={40} height={40} />
                <div>
                  <div className="text-black font-semibold text-left">Create new wallet</div>
                  <div className="text-black text-sm">Create a new Solana wallet</div>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <div className="flex items-center cursor-pointer gap-3">
                <Image src={ImportWallet} alt="Import Wallet" width={40} height={40} />
                <div>
                  <div className="text-black font-semibold text-left">Import existing wallet</div>
                  <div className="text-black text-sm">Import a previously existing wallet</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletModal;