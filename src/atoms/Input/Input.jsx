import { useState } from 'react'

// input-box.png / input-box-ON.png / input-box-OFF.png 기반
// Edit-profile-input-box.png 기반

function Input({
  label,
  required = false,
  value = '',
  onChange,
  placeholder = '',
  maxLength,
  disabled = false,
  width,
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false)

  const inputWidth = width || (label ? '282px' : '740px')
  const inputHeight = label ? 'h-10' : 'h-[50px]'

  const borderStyle = isFocused && !disabled
    ? 'border-2 border-[#5C8EF2]'
    : 'border border-[#D9DBE0]'

  return (
    <div className={`font-['Spoqa_Han_Sans_Neo'] ${className}`} style={{ width: inputWidth }}>
      <div className={label ? 'flex items-center gap-[64px]' : ''}>
        
        {/* 라벨 */}
        {label && (
          <label className="text-sm text-[#121314]">
            {label}
            {required && <span className="text-[#FF4D4D]">*</span>}
          </label>
        )}

        {/* 입력창 */}
        <div className="flex-1">
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
              w-full ${inputHeight} px-[13px] rounded-[8px] outline-none
              text-base text-[#121314] placeholder:text-[#8D9299]
              ${borderStyle}
              ${disabled ? 'bg-[#F7F8FA] cursor-not-allowed' : 'bg-white'}
            `}
          />
          
          {/* 글자수 카운터 */}
          {maxLength && !label && (
            <p className="text-right text-sm font-medium text-[#121314] mt-1">
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Input