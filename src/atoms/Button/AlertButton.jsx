import React from 'react';

const AlertButton = ({
  children,
  variant = 'white', // white, lightgray, outline
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'w-[150px] h-[50px] inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed';

  const variantStyles = {
    white: 'bg-white text-[#333] border border-gray-300 hover:bg-gray-50',
    lightgray: 'bg-[#F3F4F6] text-[#666] hover:bg-[#E5E7EB]',
    outline:
      'bg-white text-[#333] border border-[#D1D5DB] hover:border-gray-400',
    disabled: 'bg-[#F9FAFB] text-[#D1D5DB] border border-[#E5E7EB]',
  };

  return (
    <button
      className={`${baseStyles} ${disabled ? variantStyles.disabled : variantStyles[variant]} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default AlertButton;
