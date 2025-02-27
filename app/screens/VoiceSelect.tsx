"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/app/ui/ToggleSwitch";
import Button from "@/app/ui/Button";

const OnboardingFour = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/voiceregistration");
  };

  const [language, setLanguage] = useState("English (United States)");
  const [voice, setVoice] = useState("American (Voice 1)");
  const [assistantName, setAssistantName] = useState("Solana (Default)");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between pt-20 px-6 pb-32">
      {/* Content Section */}
      <div className="flex-grow">
        {/* Voice Assistant Toggle */}
        <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center mb-4">
          <span className="text-lg text-black font-semibold">
            Voice Assistant
          </span>
          <Toggle />
        </div>

        {/* Select Language */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <span className="text-lg text-black font-semibold">
            Select a language
          </span>
          <select
            className="w-full text-black mt-2 p-2 border rounded-xl"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English (United States)</option>
            <option>Spanish (Spain)</option>
          </select>
        </div>

        {/* Select Assistant Voice */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <span className="text-lg text-black font-semibold">
            Select assistant Voice
          </span>
          <select
            className="w-full text-black mt-2 p-2 border rounded-xl"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option>American (Voice 1)</option>
            <option>British (Voice 2)</option>
          </select>
        </div>

        {/* Enter Assistant Name */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <span className="text-lg text-black font-semibold">
            Enter assistant Name
          </span>
          <div className="flex items-center mt-2 border rounded-xl p-2">
            <input
              type="text"
              className="w-full text-black outline-none"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
            />
            {assistantName && (
              <button
                onClick={() => setAssistantName("")}
                className="ml-2 text-gray-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Buttons Section - Fixed to Bottom */}
      <div className="fixed bottom-0 mb-12 left-0 right-0 flex flex-col items-center px-6">
        <Button text="Next" bgColor="#971BB2" onClick={handleNext} />
        <Button text="Skip" bgColor="transparent" textColor="#111111" onClick={handleNext} className="mt-4"/>
      </div>
    </div>
  );
};

export default OnboardingFour;
