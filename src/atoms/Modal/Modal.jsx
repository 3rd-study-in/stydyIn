import { useEffect } from 'react'

/**
 * 베이스 모달 래퍼 컴포넌트
 *
 * @param {boolean} isOpen        열림 여부
 * @param {() => void} onClose    닫기 콜백 (ESC 키 / 오버레이 외부 클릭)
 * @param {React.ReactNode} children
 * @param {boolean} hasOverlay    true → 어두운 배경 + 클릭 시 닫기, false → 배경 없음
 * @param {string} className      모달 컨테이너에 추가할 Tailwind 클래스
 */
function Modal({ isOpen, onClose, children, hasOverlay = true, className = '' }) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${hasOverlay ? 'bg-black/40' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={className}>{children}</div>
    </div>
  )
}

export default Modal
