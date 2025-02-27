"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/app/ui/Button";

interface ConfirmSecretPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void; 
  secretPhrase: string[];
}

export default function ConfirmSecretPhraseModal({ isOpen, onClose, onNext, secretPhrase }: ConfirmSecretPhraseModalProps) {
  const [inputs, setInputs] = useState<{ [key: number]: string }>({ 3: "", 6: "", 9: "" });
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleConfirm = () => {
    const isCorrect =
      inputs[3] === secretPhrase[2] &&
      inputs[6] === secretPhrase[5] &&
      inputs[9] === secretPhrase[8];

    setStatus(isCorrect ? "success" : "error");

    setTimeout(() => {
      setStatus(null);
      if (isCorrect) {
        onNext(); 
      }
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-black">Confirm Secret Phrase</h2>
            <p className="text-gray-500 text-sm mb-4">
              Please enter the correct words below from your secret phrase.
            </p>

            {[3, 6, 9].map((num) => (
              <div key={num} className="mb-4">
                <label className="font-semibold text-black">Word #{num}</label>
                <input
                  type="text"
                  value={inputs[num]}
                  onChange={(e) => setInputs({ ...inputs, [num]: e.target.value })}
                  placeholder={`Enter word #${num}`}
                  className="w-full border rounded-lg p-3 mt-2 text-gray-700"
                />
              </div>
            ))}

            <div className="mt-4 flex items-center justify-center">
              <Button text="Continue" bgColor="#971BB2" onClick={handleConfirm} />
            </div>

            <IoCloseCircleOutline
              width={34}
              height={34}
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 text-lg cursor-pointer"
            />

            {/* Toast Notification */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white text-center ${
                    status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {status === "success" ? "Secret phrase confirmed!" : "Incorrect words. Try again."}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
