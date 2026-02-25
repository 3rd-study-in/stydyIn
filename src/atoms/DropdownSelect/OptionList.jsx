// select-option-box.png + select-options.png 기반 드롭다운 옵션 리스트
// border: 1px solid #D9DBE0, radius: 10px, shadow: 0px 5px 15px rgba(71,73,77,0.1)
// 각 옵션: h-10(40px), hover/선택 시 h-[30px] pill bg #F3F5FA

/**
 * @param {{ value: string, label: string }[]} options
 * @param {string | null} value   현재 선택값
 * @param {(option: { value: string, label: string }) => void} onSelect
 */
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
                className={`flex-1 h-[30px] flex items-center px-2 text-sm text-[#121314] rounded-lg transition-colors ${value === option.value ? 'bg-[#F3F5FA]' : 'hover:bg-[#F3F5FA]'
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
