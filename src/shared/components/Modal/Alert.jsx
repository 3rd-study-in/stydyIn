import Modal from '../../../atoms/Modal/Modal'

/**
 * 소형 확인 다이얼로그 (alert.png 기반)
 * 크기: 400×160px / 하단 2버튼 고정
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {() => void} onConfirm        왼쪽 버튼 콜백
 * @param {() => void} [onCancel]       오른쪽 버튼 콜백 (없으면 onClose 사용)
 * @param {string} [confirmText='확인'] 왼쪽 버튼 레이블
 * @param {string} [cancelText='취소']  오른쪽 버튼 레이블
 * @param {boolean} [hasOverlay=true]
 * @param {React.ReactNode} children    메시지 영역
 */
function Alert({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  hasOverlay = true,
  children,
}) {
  const handleCancel = onCancel ?? onClose

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasOverlay={hasOverlay}>
      <div className="w-100 h-[160px] bg-white border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] overflow-hidden flex flex-col font-sans">
        {/* 메시지 영역 */}
        <div className="flex-1 flex items-center justify-center px-6 text-base text-black">
          {children}
        </div>

        {/* 하단 버튼 바 */}
        <div className="h-[50px] flex border-t border-border shrink-0">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 border-r border-border bg-white text-text-muted text-base font-medium hover:bg-bg-muted transition-colors"
          >
            {confirmText}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-bg-muted text-text-muted text-base font-medium hover:bg-[#E5E7EB] transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Alert
