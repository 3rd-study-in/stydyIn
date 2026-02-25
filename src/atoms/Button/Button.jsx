import React from 'react';

/**
 * @param {string} variant - 버튼 색상 타입 (blue, white, lightgray, kakao)
 * @param {string} size - 버튼 크기 (L, M, S)
 */
const Button = ({
  children,
  type = 'button',
  variant = 'blue',
  size = 'L',
  onClick,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  // 기본 공통 스타일
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none disabled:cursor-not-allowed';

  // 피그마 디자인 기반 크기 스타일
  const sizeStyles = {
    L: 'w-[250px] h-[50px] text-[18px]',
    M: 'w-[170px] h-[45px] text-[16px]',
    S: 'w-[145px] h-[36px] text-[14px]',
  };

  // 색상 및 상태(Hover, Active, Disabled) 스타일
  const variantStyles = {
    blue: 'bg-[#2F6EF6] text-white hover:bg-[#1e5adb] active:bg-[#1649b8]',
    white: 'bg-white text-[#333] border border-gray-300 hover:bg-gray-50',
    lightgray: 'bg-[#F3F4F6] text-[#666] hover:bg-[#E5E7EB]',
    disabled: 'bg-[#D1D5DB] text-[#9CA3AF]', // button-L-Disabled 스타일
    kakao:
      'bg-[#FEE500] text-[#191919] w-full h-[54px] rounded-lg font-bold hover:bg-[#FADA0A]',
  };

  const combinedClassName = `
    ${baseStyles} 
    ${disabled ? variantStyles.disabled : variantStyles[variant]} 
    ${sizeStyles[size] || ''} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {/* 아이콘이 있을 경우(내 프로필 등) 렌더링 */}
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
