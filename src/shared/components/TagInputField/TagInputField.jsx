import { useState } from 'react'
import { TagM2 } from '../../../atoms/Tag'

function TagInputField({ options = [], selectedTags = [], onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((t) => t.id === o.id)
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered[0]) {
      onAdd(filtered[0])
      setInputValue('')
    }
  }

  return (
    <div className="relative">
      <div className="border border-border rounded-[8px] px-[13px] h-10 flex items-center focus-within:border-2 focus-within:border-info">
        <input
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="태그를 검색하세요"
          className="flex-1 outline-none text-base text-text placeholder:text-text-disabled bg-white"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-border rounded-[8px] shadow-sm max-h-40 overflow-y-auto">
          {filtered.map((o) => (
            <li
              key={o.id}
              onMouseDown={() => { onAdd(o); setInputValue(''); setIsOpen(false) }}
              className="px-[13px] py-2 text-sm text-text hover:bg-bg-muted cursor-pointer"
            >
              {o.name}
            </li>
          ))}
        </ul>
      )}

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <TagM2 key={tag.id} onRemove={() => onRemove(tag.id)}>
              {tag.name}
            </TagM2>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagInputField
