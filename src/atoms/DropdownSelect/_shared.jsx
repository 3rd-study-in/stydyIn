import { useState, useRef, useEffect } from 'react'

// ─── SVG Placeholder Icons ────────────────────────────────────────────────────
// 추후 SVG 파일로 교체 예정. 좌표는 Figma CSS % 값을 px로 환산한 값.

// icon-Triangle-Down (18×18)
// Figma: left 23.53%, right 23.53%, top 37.5%, bottom 34.57%
// → points: (4.24, 6.75) (13.76, 6.75) (9, 11.78)
export function TriangleDownIcon({ color = '#8D9299', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <polygon points="4.24,6.75 13.76,6.75 9,11.78" fill={color} />
    </svg>
  )
}

// icon-Triangle-Up (18×18)
// Figma: left 23.53%, right 23.53%, top 39.57%, bottom 32.5%
// → points: (4.24, 12.15) (13.76, 12.15) (9, 7.12)
export function TriangleUpIcon({ color = '#8D9299', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <polygon points="4.24,12.15 13.76,12.15 9,7.12" fill={color} />
    </svg>
  )
}

// icon-filter / Vector Stroke (20×20)
// Figma bounding: left/right 6.25%, top/bottom 11.25%
// → box: (1.25, 2.25) → (18.75, 17.75) — 깔때기(funnel) 근사
export function FilterIcon({ color = '#47494D', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M1.25 2.25h17.5L12 9.75v5.5l-4-2V9.75L1.25 2.25z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── 공통 옵션 리스트 ─────────────────────────────────────────────────────────
// select-option-box.png + select-options.png 기반
// border: 1px solid #D9DBE0, radius: 10px, shadow: 0px 5px 15px rgba(71,73,77,0.1)
// 각 옵션: h-10(40px), hover 시 h-[30px] pill bg #F3F5FA
export function OptionList({ options = [], value, onSelect }) {
  return (
    <ul
      className="absolute top-full left-0 z-50 mt-1 min-w-full bg-white border border-[#D9DBE0] rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] py-1"
      role="listbox"
    >
      {options.length === 0 ? (
        <li className="h-10 flex items-center px-4 text-sm text-[#8D9299]">항목 없음</li>
      ) : (
        options.map((option) => (
          <li key={option.value} role="option" aria-selected={value === option.value}>
            <button
              type="button"
              onClick={() => onSelect(option)}
              className="w-full h-10 px-2 text-left flex items-center font-['Spoqa_Han_Sans_Neo']"
            >
              <span
                className={`flex-1 h-[30px] flex items-center px-2 text-sm text-[#121314] rounded-lg transition-colors ${
                  value === option.value ? 'bg-[#F3F5FA]' : 'hover:bg-[#F3F5FA]'
                }`}
              >
                {option.label}
              </span>
            </button>
          </li>
        ))
      )}
    </ul>
  )
}

// ─── useDropdown 훅 ───────────────────────────────────────────────────────────
// open/close 상태, 외부 클릭 + Escape 키 처리, 선택 핸들러를 묶어서 제공
export function useDropdown({ onChange, disabled = false } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggle = () => {
    if (!disabled) setIsOpen((prev) => !prev)
  }

  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  // 트리거 border 클래스: 기본 #D9DBE0 / 열림 #5C8EF2 + inner shadow #2E6FF2
  const triggerBorderClass = isOpen
    ? 'border-2 border-[#5C8EF2] shadow-[0_0_0_1px_#2E6FF2]'
    : 'border border-[#D9DBE0]'

  return { isOpen, toggle, handleSelect, containerRef, triggerBorderClass }
}
