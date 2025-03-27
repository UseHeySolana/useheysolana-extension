import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  bgColor?: string;
  textColor?: string;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  bgColor = '#971BB2',
  textColor = '#FFFFFF',
  className = '',
}) => {
  return (
    <button
      className={`w-[350px] py-4 rounded-full text-lg font-medium ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
