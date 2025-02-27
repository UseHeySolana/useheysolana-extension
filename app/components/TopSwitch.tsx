import React from 'react';

interface TopSwitchProps {
  currentScreen: number;
}

const TopSwitch: React.FC<TopSwitchProps> = ({ currentScreen }) => {
  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${currentScreen === index ? 'bg-purple-500' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">swipe</p>
    </div>
  );
};

export default TopSwitch;