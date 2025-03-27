"use client";

import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import Button from '@/app/components/ui/Button';
import { useModal } from "@/app/context/ModalContext";

export default function SeedPhrase() {
  const secretPhrase = [
    "polygon",
    "cast",
    "roman",
    "exile",
    "phobia",
    "chip",
    "block",
    "torah",
    "vile",
    "cluster",
  ];
  const [copied, setCopied] = useState(false);
  const { openModal } = useModal();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretPhrase.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between pt-5 items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-lg font-bold text-black">Secret Phrase</h1>
        <p className="text-gray-500 text-sm">Write this down</p>

        <div className="bg-gray-100 p-4 rounded-lg my-4">
          <div className="grid grid-cols-2 gap-2">
            {secretPhrase.map((word, index) => (
              <p key={index} className="text-gray-700">
                {index + 1}. {word}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center bg-gray-200 py-3 rounded-full mt-2 gap-1 font-semibold text-gray-700"
        >
          <IoCopyOutline />
          {copied ? "Copied!" : "Copy secret phrase"}
        </button>
      </div>

      <div className="fixed bottom-0 mb-12 left-0 right-0 flex flex-col items-center px-6">
        <Button text="Next" bgColor="#971BB2" onClick={() => openModal("confirmSecretPhrase", { secretPhrase })} />
      </div>
    </div>
  );
}
