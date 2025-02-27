"use client";

import { useState } from "react";

const ToogleSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="relative w-12 h-6">
      <input
        type="checkbox"
        id="apple-checkbox"
        className="hidden"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label
        htmlFor="apple-checkbox"
        className={`block w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
          checked
            ? "bg-gradient-to-b from-green-400 to-green-500"
            : "bg-gradient-to-b from-gray-400 to-gray-300"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
            checked ? "translate-x-6" : ""
          }`}
        ></span>
      </label>
    </div>
  );
};

export default ToogleSwitch;
