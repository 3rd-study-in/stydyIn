import React from 'react';
import Icon from '../Icon/Common/Icon';

/**
 * @param {string} variant - 버튼 색상 타입 (blue, white, lightgray, kakao)
 * @param {string} size - 버튼 크기 (L, M, S)
 * @param {string} width - 사용자 지정 너비 (예: '100%', '200px', 'auto')
 */
const FlexibleButton = ({
  children,
  variant = 'blue',
  size = 'L',
  disabled = false,
  width, // Add width prop
  ...props
}) => {
  const isKakao = variant === 'kakao';

  // 1. 공통 스타일: 폰트(font-sans), 자간(tracking-tight), 기본 둥글기(rounded-md) 적용
  const baseStyles =
    'relative flex items-center justify-center font-sans tracking-tight transition-all duration-200 rounded-md focus:outline-none disabled:cursor-not-allowed overflow-hidden';

  // 2. 테마 변수 기반 색상 스타일
  const variantStyles = {
    blue: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark antialiased',
    white: 'bg-bg text-text border border-border hover:bg-bg-muted',
    lightgray: 'bg-bg-muted text-text-muted hover:bg-secondary-light',
    kakao:
      'bg-bg text-text-muted w-[322px] h-[50px] text-base font-medium border border-accent hover:bg-accent-light/20',
    disabled: 'bg-secondary-light text-text-disabled',
  };

  // FlexibleButton.jsx 내부 sizeStyles 수정: 고정 너비 제거, 최소 너비 및 패딩 사용
  const sizeStyles = {
    L: 'min-w-[100px] h-[50px] px-8 text-lg font-medium leading-[24px]', // min-w 대신 px로 유연하게
    M: 'min-w-[80px] h-[40px] px-6 text-base font-medium leading-normal',
    S: 'min-w-[60px] h-[30px] px-4 text-sm font-regular leading-normal',
  };

  const combinedClassName = `
    ${baseStyles}
    ${isKakao ? variantStyles.kakao : disabled ? variantStyles.disabled : variantStyles[variant]}
    ${!isKakao ? sizeStyles[size] : ''}
    ${props.className || ''}
  `.trim();

  return (
    <button
      className={combinedClassName} // 여기서는 배경색, 폰트 등 디자인만 담당
      disabled={disabled}
      {...props}
      style={{
        ...props.style, // 기존 style 유지
        ...(isKakao ? { position: 'relative' } : {}),
        // 핵심: className에서 w-를 찾아서 있으면 그걸 쓰고, 없으면 width prop을 씁니다.
        width: width || (isKakao ? '322px' : undefined),
      }}
    >
      {isKakao && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center">
          <Icon name="Kakao" size={24} />
        </span>
      )}

      <span className="flex-1 text-center">{children}</span>
    </button>
  );
};

export default FlexibleButton;
