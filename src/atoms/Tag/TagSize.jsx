// tag-L / tag-M / tag-S / tag-SS 기반
// tag-L-lightgray / tag-L-gray / tag-L-blue 기반

function TagSize({
  children,
  size = 'M',
  variant = 'lightgray',
  className = '',
}) {
  const sizeStyle = {
    L: 'h-[44px] px-4 rounded-[44px] text-base',
    M: 'h-8 px-[14px] rounded-[36px] text-base',
    S: 'h-[26px] px-[13px] rounded-[26px] text-sm',
    SS: 'h-5 px-[10px] rounded-[26px] text-xs',
  }

  const variantStyle = {
    lightgray: 'bg-bg-muted hover:bg-secondary-light',
    gray: 'bg-white border border-border hover:bg-secondary-light',
    blue: 'bg-info text-white',
  }

  const textColor = variant === 'blue' 
    ? '' 
    : size === 'L' 
      ? 'text-text-muted' 
      : 'text-text'

  return (
    <span className={`inline-flex items-center font-['Spoqa_Han_Sans_Neo'] cursor-pointer ${sizeStyle[size]} ${variantStyle[variant]} ${textColor} ${className}`}>
      {children}
    </span>
  )
}

export default TagSize