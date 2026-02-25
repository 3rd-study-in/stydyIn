import React from 'react';

const SideNavButton = ({
  children,
  variant = 'blue', // blue, lightgray, white
  icon,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'w-full max-w-[250px] h-[50px] px-4 inline-flex items-center font-medium transition-all duration-200 rounded-[8px] focus:outline-none disabled:cursor-not-allowed';

  const variantStyles = {
    blue: 'bg-[#2F6EF6] text-white hover:bg-[#1e5adb]',
    lightgray: 'bg-[#F3F4F6] text-[#666] hover:bg-[#E5E7EB]',
    white: 'bg-white text-[#333] hover:bg-gray-50',
    disabled: 'bg-gray-100 text-gray-300',
  };

  return (
    <button
      className={`${baseStyles} ${disabled ? variantStyles.disabled : variantStyles[variant]} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {/* 아이콘 영역: Icon 컴포넌트 준비 전까지는 빈 div나 span으로 대체 가능 */}
      {icon && (
        <span className="mr-3 flex items-center justify-center">{icon}</span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default SideNavButton;
