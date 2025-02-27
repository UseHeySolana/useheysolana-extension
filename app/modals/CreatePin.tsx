"use client";

import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/app/ui/Button";

interface CreatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void; // Function to transition to ConfirmPinModal
}

export default function CreatePinModal({ isOpen, onClose, onNext }: CreatePinModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const handleConfirm = () => {
    if (pin.includes("")) {
      showAlert("Incomplete PIN!");
    } else {
      onNext(); // Move to ConfirmPinModal
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
        {alertMessage && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md text-sm">
            {alertMessage}
          </div>
        )}

        <h2 className="text-lg font-bold text-black text-center">Create Your PIN</h2>

        <div className="flex justify-center gap-3 my-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 border rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center">
          <Button text="Submit" bgColor="#971BB2" onClick={handleConfirm} />
        </div>

        <IoCloseCircleOutline
          width={34}
          height={34}
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-lg cursor-pointer"
        />
      </div>
    </div>
  );

  
}
