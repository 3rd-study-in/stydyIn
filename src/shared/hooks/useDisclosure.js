import { useState, useRef, useEffect } from 'react';

// 범용 열고닫기 훅 — Dropdown, BottomSheet, Modal 등에서 공통으로 사용
// DropdownSelect 전용이었던 useDropdown을 범용으로 일반화

/**
 * @param {object} options
 * @param {boolean} options.disabled  true이면 toggle 비활성화
 * @returns {{
 *   isOpen: boolean,
 *   open: () => void,
 *   close: () => void,
 *   toggle: () => void,
 *   containerRef: React.RefObject,
 *   triggerBorderClass: string
 * }}
 */
export function useDisclosure({ disabled = false } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const open = () => {
    if (!disabled) setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const toggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  // 드롭다운 트리거 border 클래스 (DropdownSelect 전용)
  // 기본: #D9DBE0 / 열림: #5C8EF2 outer + #2E6FF2 inner shadow
  const triggerBorderClass = isOpen
    ? 'border-2 border-[#5C8EF2] shadow-[0_0_0_1px_#2E6FF2]'
    : 'border border-[#D9DBE0]';

  return { isOpen, open, close, toggle, containerRef, triggerBorderClass };
}
