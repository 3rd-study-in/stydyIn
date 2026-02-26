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
  // 1. 아이콘 컬러 설정: 테마 변수 값과 일치시킴
  const iconColor = variant === 'blue' ? '#FFFFFF' : '#121314';

  // 2. 공통 스타일: 테마의 font-sans, font-medium(500), tracking-tight 적용
  const baseStyles =
    'w-[170px] h-[30px] px-4 inline-flex items-center font-sans font-medium text-base tracking-tight transition-all duration-200 rounded-md focus:outline-none disabled:cursor-not-allowed overflow-hidden';

  // 3. 테마 변수 기반 색상 스타일
  const variantStyles = {
    // 배경이 진한 blue일 때 글자가 얇아 보이지 않도록 antialiased 추가
    blue: 'bg-primary text-white hover:bg-primary-dark antialiased',
    lightgray: 'bg-bg-muted text-text-muted hover:bg-secondary-light',
    white: 'bg-bg text-text hover:bg-bg-muted',
    disabled: 'bg-bg-muted text-text-disabled',
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
      {/* 아이콘 영역: 텍스트와 정렬을 위해 flex 유지 */}
      <span className="mr-3 flex items-center justify-center shrink-0">
        <PersonIcon width={16} height={16} fill={iconColor} />
      </span>

      {/* 텍스트 영역: truncate로 넘침 방지 */}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default SideNavButton;
