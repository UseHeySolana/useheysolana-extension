"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// import Image from "next/image";
import { X } from "lucide-react";
import Button from "../components/ui/Button";

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportWalletModal: React.FC<ImportWalletModalProps> = ({ isOpen, onClose }) => {
  const [secretPhrase, setSecretPhrase] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-white/30 backdrop-blur-md z-50">

      <motion.div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 shadow-lg"
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ type: "spring", stiffness: 100 }}
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-2xl font-bold text-center mb-6">Import existing wallet</h2>
        <p className="text-gray-600 text-center mb-6">Enter the secret phrase to restore your Solana wallet.</p>


        <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              A2
            </div>
            <span className="text-black font-semibold">Account 2</span>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>


        <div className="mt-6">
          <label className="text-black font-semibold block mb-2">Secret phrase</label>
          <div className="relative">
            <textarea
              className="w-full bg-gray-100 text-black p-3 rounded-xl h-24 resize-none outline-none"
              placeholder="Enter your secret phrase"
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
            />
            <button
              className="absolute bottom-3 right-3 bg-gray-200 px-4 py-1 rounded-full text-gray-700"
              onClick={() => navigator.clipboard.readText().then(setSecretPhrase)}
            >
              Paste
            </button>
          </div>
        </div>


        <div className="mt-4 bg-blue-100 p-4 rounded-xl text-sm text-gray-700 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          The secret phrase is typically 10 words separated by single spaces.
        </div>

        
        <Button
            text="Next"
            bgColor={secretPhrase ? "#971BB2" : "#D1D5DB"}
            onClick={() => console.log("Button Clicked")}
            disabled={!secretPhrase}
            className="w-full mt-4"
            />        



        <p className="mt-4 text-center text-gray-500 cursor-pointer">I don’t know what a secret phrase is</p>
      </motion.div>
    </div>
  );
};

export default ImportWalletModal;
