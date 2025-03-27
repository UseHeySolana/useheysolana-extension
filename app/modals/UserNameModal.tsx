"use client";

import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/app/components/ui/Button";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export default function UsernameModal({ isOpen, onClose, onNext }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [errors, setErrors] = useState({ username: "", phone: "" });

  const validateForm = () => {
    const newErrors = { username: "", phone: "" };
    if (!username) newErrors.username = "Username is required";
    if (!phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return !newErrors.username && !newErrors.phone;
  };

  const checkUsernameAvailability = (value: string) => {
    setUsername(value);
    setIsAvailable(value.length > 3);
    setErrors((prev) => ({ ...prev, username: "" }));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(); // Proceed to CreatePinModal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
        <h2 className="text-lg font-bold text-black">One last thing</h2>
        <p className="text-gray-500 text-sm mb-4">
          Your username will be unique and can be used to make transactions.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => checkUsernameAvailability(e.target.value)}
            placeholder="Select a username"
            className={`w-full border-b p-3 text-gray-700 ${errors.username && "border-red-500"}`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}

          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter phone number"
            className={`w-full border-b p-3 text-gray-700 mt-2 ${errors.phone && "border-red-500"}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {username && (
          <div className={`p-3 rounded-lg ${isAvailable ? 'bg-green-100 border border-green-500 text-black' : 'bg-red-100 border border-red-500 text-black'}`}>
            <span className="flex items-center">
              {isAvailable ? '✅ Username available' : '❌ Username taken'}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center">
          <Button
            text="Done"
            bgColor="#971BB2"
            onClick={handleSubmit} 
            disabled={!isAvailable}
          />
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
