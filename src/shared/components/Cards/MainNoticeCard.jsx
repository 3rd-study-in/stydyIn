import { useEffect, useState } from 'react';
import MainNoticeCardBox from '../../../atoms/Card/MainNoticeCardBox';
import MainNoticeItem from '../../../atoms/NotificationItem/MainNoticeItem';
import useNotificationStore from '../../../stores/notificationStore';

function formatTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

const ITEM_SLOT = 88;
const HEADER_H = 60;
const FOOTER_H = 48;

function MainNoticeCard({ onMoreClick }) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const deleteOne = useNotificationStore((s) => s.deleteOne);

  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const activeCount = notifications.length - removingIds.length;
  const unreadCount = notifications.filter(
    (n) => !n.checked && !removingIds.includes(n.notification_id)
  ).length;
  const boxHeight = HEADER_H + Math.max(activeCount, 1) * ITEM_SLOT + FOOTER_H;

  const handleClose = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      deleteOne(id);
      setRemovingIds((prev) => prev.filter((rid) => rid !== id));
    }, 300);
  };

  return (
    <MainNoticeCardBox height={boxHeight}>
      <h2 className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-bold text-black leading-6">
        확인하지 않은 알림 <span className="text-primary">{unreadCount}개</span>
      </h2>

      {notifications.length === 0 ? (
        <p className="absolute top-[60px] left-0 right-0 text-center text-sm text-text-muted py-6">
          알림이 없습니다.
        </p>
      ) : (
        <ul className="absolute top-[60px] left-5 flex flex-col w-[318px]">
          {notifications.map((notice) => (
            <div
              key={notice.notification_id}
              className="overflow-hidden"
              style={{
                height: removingIds.includes(notice.notification_id) ? 0 : ITEM_SLOT,
                opacity: removingIds.includes(notice.notification_id) ? 0 : 1,
                transition: 'height 0.3s ease, opacity 0.2s ease',
              }}
            >
              <div className="pb-2">
                <MainNoticeItem
                  text={notice.content}
                  time={formatTime(notice.created)}
                  isRead={notice.checked}
                  onClose={() => handleClose(notice.notification_id)}
                />
              </div>
            </div>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onMoreClick}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-[#959595] underline leading-4 whitespace-nowrap"
      >
        알림 더보기
      </button>
    </MainNoticeCardBox>
  );
}

export default MainNoticeCard;
