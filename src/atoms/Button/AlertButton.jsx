import React from 'react';

const AlertButton = ({
  children,
  variant = 'white', // white, lightgray, outline
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  // 1. 공통 스타일: rounded 관련 클래스를 완전히 제거하여 직각을 유지합니다.
  const baseStyles =
    'w-[150px] h-[50px] inline-flex items-center justify-center font-sans font-medium text-base tracking-tight transition-all duration-200 focus:outline-none disabled:cursor-not-allowed';

  // 2. 테마 변수 기반 색상 스타일
  const variantStyles = {
    // 기본 흰색 버튼 (W-Background, W-Gray-Lv2)
    white: 'bg-bg text-text border border-secondary-light hover:bg-bg-muted',

    // 연한 회색 배경 버튼 (W-Gray-Lv1, W-Gray-Lv4)
    lightgray:
      'bg-bg-muted text-text-muted border border-secondary-light hover:bg-secondary-light',

    // 아웃라인 강조 버튼 (W-Gray-Lv2 기준)
    outline:
      'bg-bg text-text border border-secondary hover:border-secondary-dark active:bg-bg-muted',

    // 비활성화 상태 (W-Gray-Lv3 텍스트)
    disabled: 'bg-bg-muted text-text-disabled border border-border opacity-50',
  };

  const combinedClassName = `
    ${baseStyles} 
    ${disabled ? variantStyles.disabled : variantStyles[variant]} 
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default AlertButton;
