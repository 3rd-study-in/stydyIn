/**
 * 뱃지 래퍼 컴포넌트
 * 아이콘이나 컴포넌트를 감싸서 빨간 점(알림 표시)을 추가한다.
 *
 * @param {React.ReactNode} children  감쌀 컴포넌트
 * @param {boolean}  show             true일 때 빨간 점 표시
 * @param {'bottom-right'|'top-left'} position  뱃지 위치 (기본: 오른쪽 아래)
 * @param {string}   className        추가 Tailwind 클래스
 */
function Badge({ children, show = false, position = 'bottom-right', className = '' }) {
  const posClass = position === 'top-left' ? 'top-0 left-0' : 'bottom-0 right-0'

  return (
    <div className={`relative ${className}`}>
      {children}
      {show && (
        <span className={`absolute ${posClass} w-2.5 h-2.5 bg-error rounded-full`} />
      )}
    </div>
  )
}

export default Badge
