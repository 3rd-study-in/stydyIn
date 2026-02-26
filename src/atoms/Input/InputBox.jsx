import { useState } from 'react'

// input-box.png / input-box-ON.png / input-box-OFF.png 기반

function InputBox({
  value = '',
  onChange,
  placeholder = '',
  maxLength,
  disabled = false,
  width = '740px',
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false)

  const borderStyle = isFocused && !disabled
    ? 'border-2 border-info'
    : 'border border-border'

  return (
    <div className={`font-['Spoqa_Han_Sans_Neo'] ${className}`} style={{ width }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full h-[50px] px-[13px] rounded-[8px] outline-none
          text-base text-text placeholder:text-text-disabled
          ${borderStyle}
          ${disabled ? 'bg-bg-muted cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      {maxLength && (
        <p className="text-right text-sm font-medium text-text mt-1">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

export default InputBox