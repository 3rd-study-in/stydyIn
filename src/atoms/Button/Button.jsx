import React from 'react';
import Icon from '../Icon/Common/Icon';

/**
 * @param {string} variant - 버튼 색상 타입 (blue, white, lightgray, kakao)
 * @param {string} size - 버튼 크기 (L, M, S)
 */
const Button = ({
  children,
  variant = 'blue',
  size = 'L',
  disabled = false,
  ...props
}) => {
  const isKakao = variant === 'kakao';

  // 1. 공통 스타일: 폰트(font-sans), 자간(tracking-tight), 기본 둥글기(rounded-md) 적용
  const baseStyles =
    'relative flex items-center justify-center font-sans tracking-tight transition-all duration-200 rounded-md focus:outline-none disabled:cursor-not-allowed overflow-hidden';

  // 2. 테마 변수 기반 색상 스타일
  // ... 상단 로직 동일

  const variantStyles = {
    // text-white와 함께 font-medium이 잘 보이도록 설정
    blue: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark antialiased',
    white: 'bg-bg text-text border border-border hover:bg-bg-muted',
    lightgray: 'bg-bg-muted text-text-muted hover:bg-secondary-light',
    kakao:
      'bg-bg text-text-muted w-[322px] h-[50px] text-base font-medium border border-accent hover:bg-accent-light/20',
    disabled: 'bg-secondary-light text-text-disabled',
  };

  // Button.jsx 내부 sizeStyles 수정
  const sizeStyles = {
    // L 사이즈: 피그마의 font-weight: 500 반영
    // 만약 여전히 얇아 보인다면 font-semibold(600)로 올리는 것도 방법입니다.
    L: 'w-[250px] h-[50px] text-lg font-medium leading-[24px]',
    M: 'w-[160px] h-[40px] text-base font-medium leading-normal',
    S: 'w-[145px] h-[30px] text-sm font-regular leading-normal',
  };

  // ... 하단 return문 동일

  const combinedClassName = `
    ${baseStyles}
    ${isKakao ? variantStyles.kakao : disabled ? variantStyles.disabled : variantStyles[variant]}
    ${!isKakao ? sizeStyles[size] : ''}
    ${props.className || ''}
  `.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
      style={isKakao ? { position: 'relative' } : {}}
    >
      {isKakao && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center">
          {/* 카카오 로고 크기는 디자인 가이드에 맞춰 고정 */}

          <Icon name="Kakao" size={24} />
        </span>
      )}

      <span className="flex-1 text-center">{children}</span>
    </button>
  );
};

export default Button;
