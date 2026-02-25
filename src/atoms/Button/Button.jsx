import React from 'react';
import KakaoLogo from '../../asset/third-party/Logo-kakao-message.svg?react';

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
  ...props
}) => {
  // 기본 공통 스타일
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[8px] focus:outline-none disabled:cursor-not-allowed';

  // 피그마 디자인 기반 크기 스타일
  const sizeStyles = {
    L: 'w-[250px] h-[50px] text-[16px]',
    M: 'w-[160px] h-[40px] text-[14px]',
    S: 'w-[145px] h-[30px] text-[12px]',
  };

  // 색상 및 상태(Hover, Active, Disabled) 스타일
  const variantStyles = {
    blue: 'bg-[#2E6FF2] text-white hover:bg-[#1e5adb] active:bg-[#1649b8]',
    white: 'bg-white text-[#333] border border-gray-300 hover:bg-gray-50',
    lightgray: 'bg-[#F3F4F6] text-[#666] hover:bg-[#E5E7EB]',
    disabled: 'bg-[#D1D5DB] text-[#9CA3AF]', // button-L-Disabled 스타일
    kakao:
      'bg-[#FFFFFF] text-[#47494D] w-[322px] h-[50px] text-[14px] font-medium border border-[#FFC533] hover:bg-[#fff9e0]',
  };

  const combinedClassName = `
    ${baseStyles} 
    ${disabled ? variantStyles.disabled : variantStyles[variant]} 
    ${sizeStyles[size] || ''} 
    ${className}
  `.trim();

  const isKakao = variant === 'kakao';

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {isKakao && <KakaoLogo className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
