"use client";

import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/app/components/ui/Button";
import { useStore } from "@/store/useStore"; // Import the store

interface ConfirmPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmPinModal({ isOpen, onClose }: ConfirmPinModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const { pin: storedPin } = useStore(); // Access the stored PIN from the store

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
      const enteredPin = pin.join(""); // Combine the PIN array into a string
      if (enteredPin === storedPin) {
        showAlert("PIN Confirmed Successfully!");
        onClose(); // Close the modal on success
      } else {
        showAlert("PIN does not match. Please try again!");
      }
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
        {alertMessage && (
          <div
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-sm ${
              alertMessage.includes("Successfully")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {alertMessage}
          </div>
        )}

        <h2 className="text-lg font-bold text-black text-center">Confirm Your PIN</h2>

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
          <Button text="Confirm" bgColor="#971BB2" onClick={handleConfirm} />
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
