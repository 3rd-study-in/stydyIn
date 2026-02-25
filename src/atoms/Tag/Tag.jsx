// tag-L / tag-M / tag-S / tag-SS 기반
// tag-L-lightgray / tag-L-gray / tag-L-blue 기반
// tag-M-2 (X 버튼 있는 버전) 기반

function Tag({
  children,
  size = 'M',
  variant = 'lightgray',
  onRemove,
  className = '',
}) {
  const sizeStyle = {
    L: 'h-[44px] px-4 rounded-[44px] text-base',
    M: 'h-8 px-[14px] rounded-[36px] text-base',
    S: 'h-[26px] px-[13px] rounded-[26px] text-sm',
    SS: 'h-5 px-[10px] rounded-[26px] text-xs',
  }

  const variantStyle = {
    lightgray: 'bg-[#F7F8FA] hover:bg-[#E9EBED]',
    gray: 'bg-white border border-[#D9DBE0] hover:bg-[#E9EBED]',
    blue: 'bg-[#5C8EF2] text-white',
  }

    const textColor = variant === 'blue' 
    ? '' 
    : size === 'L' 
      ? 'text-[#47494D]' 
      : 'text-[#121314]'

  return (
    <span className={`inline-flex items-center font-['Spoqa_Han_Sans_Neo'] ${sizeStyle[size]} ${variantStyle[variant]} ${textColor} ${className}`}>
      {children}
      
      {onRemove && (
        <button onClick={onRemove} className="ml-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="#8D9299" />
            <path d="M6 6L12 12M12 6L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}

export default Tag