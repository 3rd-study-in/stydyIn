import React from 'react';
import { twMerge } from 'tailwind-merge'; // 1. 라이브러리 임포트
import Icon from '../Icon/Common/Icon';

const FlexibleButton = ({
  children,
  variant = 'blue',
  size = 'L',
  disabled = false,
  width,
  ...props
}) => {
  const isKakao = variant === 'kakao';

  const baseStyles =
    'relative flex items-center justify-center font-sans tracking-tight transition-all duration-200 rounded-md focus:outline-none disabled:cursor-not-allowed overflow-hidden';

  const variantStyles = {
    blue: 'bg-primary text-white hover:bg-primary-dark antialiased',
    white: 'bg-bg text-text border border-border hover:bg-bg-muted',
    lightgray: 'bg-bg-muted text-text-muted hover:bg-secondary-light',
    kakao:
      'bg-bg text-text-muted border border-accent hover:bg-accent-light/20',
    disabled: 'bg-secondary-light text-text-disabled',
  };

  const sizeStyles = {
    L: 'h-[50px] px-8 text-lg font-medium leading-[24px]',
    M: 'h-[40px] px-6 text-base font-medium leading-normal',
    S: 'h-[30px] px-4 text-sm font-regular leading-normal',
  };

  const activeVariant = disabled
    ? variantStyles.disabled
    : variantStyles[variant];
  const activeSize = !isKakao ? sizeStyles[size] : 'w-[322px] h-[50px]';

  // 2. twMerge로 클래스들을 감쌉니다.
  // 이제 props.className에 들어온 값이 내부 스타일과 충돌하면 외부 값이 우선권을 가집니다.
  const combinedClassName = twMerge(
    baseStyles,
    activeVariant,
    activeSize,
    props.className,
  );

  return (
    <button
      {...props}
      className={combinedClassName}
      disabled={disabled}
      style={{
        ...props.style,
        width: width || (isKakao ? '322px' : undefined),
        ...(isKakao ? { position: 'relative' } : {}),
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
