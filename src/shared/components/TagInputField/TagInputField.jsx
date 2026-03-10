import { useState } from 'react';
import { TagM2 } from '../../../atoms/Tag';

function TagInputField({ options = [], selectedTags = [], onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((t) => t.id === o.id),
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered[0] && selectedTags.length < 5) {
      onAdd(filtered[0]);
      setInputValue('');
    }
    if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      onRemove(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div className="relative">
      <div
        className="border border-border rounded-md px-3.25 py-2 flex flex-wrap items-center gap-2 h-[60px] focus-within:border-2 focus-within:border-info cursor-text"
        onClick={(e) => {
          e.currentTarget.querySelector('input')?.focus();
        }}
      >
        {selectedTags.map((tag) => (
          <TagM2 key={tag.id} onRemove={() => onRemove(tag.id)}>
            {tag.name}
          </TagM2>
        ))}
        {selectedTags.length < 5 && (
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedTags.length === 0 ? '태그 입력 (최대 5개)' : ''
            }
            className="flex-1 min-w-30 outline-none text-sm text-text placeholder:text-text-disabled bg-transparent"
          />
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-sm max-h-40 overflow-y-auto">
          {filtered.map((o) => (
            <li
              key={o.id}
              onMouseDown={() => {
                if (selectedTags.length < 5) {
                  onAdd(o);
                  setInputValue('');
                  setIsOpen(false);
                }
              }}
              className="px-3.25 py-2 text-sm text-text hover:bg-bg-muted cursor-pointer"
            >
              {o.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagInputField;
