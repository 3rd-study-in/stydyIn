// tag-M-2 (X 버튼 있는 버전) 기반

function TagM2({
  children,
  onRemove,
  className = '',
}) {
  return (
    <span className={`inline-flex items-center font-['Spoqa_Han_Sans_Neo'] cursor-pointer h-8 px-[14px] rounded-[36px] bg-bg-muted text-text ${className}`}>
      {children}
      
      <button onClick={onRemove} className="ml-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="9" fill="#8D9299" />
          <path d="M6 6L12 12M12 6L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  )
}

export default TagM2