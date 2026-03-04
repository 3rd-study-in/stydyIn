/**
 * 메인 알림 카드 컨테이너 (main-notice-list.png 기반)
 * 크기: 358×548px
 *
 * @param {React.ReactNode} children 알림 아이템 목록 (MainNoticeItem 배열)
 */
function MainNoticeCardBox({ children, height = 548 }) {
  return (
    <div
      className="relative w-[358px] bg-bg border border-border rounded-xl font-sans overflow-hidden"
      style={{
        height,
        transition: 'height 0.3s ease',
        boxShadow: '0px 5px 15px rgba(71, 73, 77, 0.1)',
      }}
    >
      {children}
    </div>
  );
}

export default MainNoticeCardBox;
