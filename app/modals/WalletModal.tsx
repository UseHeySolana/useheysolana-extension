"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import WalletImage from "@/public/img/wallet.png";
import CreateWallet from "@/public/img/createWallet.png";
import ImportWallet from "@/public/img/importWallet.png";
import ImportWalletModal from "@/app/modals/ImportWalletModal"; 

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/30 backdrop-blur-sm z-50" onClick={onClose}>
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
          <h2 className="text-2xl text-black font-bold text-center mb-6">Wallet</h2>

          <Image src={WalletImage} alt="Wallet" width={200} height={200} className="mx-auto mb-6" />

          <div className="space-y-4">
            {/* Create Wallet */}
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition cursor-pointer"
              onClick={() => router.push("/seedphrase")}
            >
              <div className="flex items-center gap-3">
                <Image src={CreateWallet} alt="Create Wallet" width={40} height={40} />
                <div>
                  <div className="text-black font-semibold text-left">Create new wallet</div>
                  <div className="text-black text-sm">Create a new Solana wallet</div>
                </div>
              </div>
            </button>

            {/* Import Wallet */}
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition cursor-pointer"
              onClick={() => setIsImportModalOpen(true)}
            >
              <div className="flex items-center gap-3">
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

      {/* Import Wallet Modal */}
      <ImportWalletModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default WalletModal;
