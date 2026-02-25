import React from 'react';
import PersonIcon from '../../asset/icons/common/icon-person.svg?react';

const SideNavButton = ({
  children,
  variant = 'lightgray', // blue, lightgray
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'w-[170px] h-[30px] px-4 inline-flex items-center font-medium text-[14px] transition-all duration-200 rounded-[8px] focus:outline-none disabled:cursor-not-allowed';

  const variantStyles = {
    blue: 'bg-[#2E6FF2] text-white hover:bg-[#1e5adb]',
    lightgray: 'bg-[#F3F4F6] text-[#47494D] hover:bg-[#E5E7EB]',
    disabled: 'bg-gray-100 text-gray-300',
  };

  const iconColor = variant === 'blue' ? '#FFFFFF' : '#121314';

  return (
    <button
      className={`${baseStyles} ${disabled ? variantStyles.disabled : variantStyles[variant]} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      <span className="mr-3 flex items-center justify-center">
        <PersonIcon fill={iconColor} />
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
};

export default SideNavButton;
