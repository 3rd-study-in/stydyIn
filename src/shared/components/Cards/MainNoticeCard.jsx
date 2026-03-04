import { useState } from 'react';
import MainNoticeCardBox from '../../../atoms/Card/MainNoticeCardBox';
import MainNoticeItem from '../../../atoms/NotificationItem/MainNoticeItem';

const SAMPLE_NOTICES = [
  {
    id: 1,
    text: '[크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.] 스터디에 댓글이 달렸어요.',
    time: '3분 전',
    isRead: false,
  },
  {
    id: 2,
    text: '[크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.] 스터디에 새로운 유저가 참가했어요.',
    time: '30분 전',
    isRead: false,
  },
  {
    id: 3,
    text: '관심있는 [자바스크립트 공부 인증 스터디] 스터디가 곧 모집이 마감됩니다.',
    time: '30분 전',
    isRead: false,
  },
  {
    id: 4,
    text: '축하드립니다! <은잔디> 등급으로 승급하셨습니다. 🎉',
    time: '2022.04.01',
    isRead: true,
  },
  {
    id: 5,
    text: '관심있는 [춤추면서 파이썬 공부] 스터디가 곧 모집이 마감됩니다.',
    time: '2022.03.16',
    isRead: true,
  },
];

/**
 * 메인 알림 리스트 카드 (main-notice-list.png 전체 컴포넌트)
 * MainNoticeCard(컨테이너) + MainNoticeItem(아이템) 조합
 *
 * @param {Array}    [notices]       알림 데이터 배열 (기본값: 샘플 데이터)
 *   - id: number
 *   - text: string
 *   - time: string
 *   - isRead: boolean
 * @param {function} [onMoreClick]   "알림 더보기" 클릭 핸들러
 */
// 아이템 1개당 높이(80px) + 아래 여백(8px) = 88px, 헤더 60px, 하단(버튼+패딩) 48px
const ITEM_SLOT = 88;
const HEADER_H = 60;
const FOOTER_H = 48;

function MainNoticeCard({ notices = SAMPLE_NOTICES, onMoreClick }) {
  const [items, setItems] = useState(notices);
  const [removingIds, setRemovingIds] = useState([]);

  const activeCount = items.length - removingIds.length;
  const unreadCount = items.filter((n) => !n.isRead && !removingIds.includes(n.id)).length;
  const boxHeight = HEADER_H + activeCount * ITEM_SLOT + FOOTER_H;

  const handleClose = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
      setRemovingIds((prev) => prev.filter((rid) => rid !== id));
    }, 300);
  };

  return (
    <MainNoticeCardBox height={boxHeight}>
      {/* 헤더 타이틀 */}
      <h2 className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-bold text-black leading-6">
        확인하지 않은 알림 <span className="text-primary">{unreadCount}개</span>
      </h2>

      {/* 알림 아이템 목록 */}
      <ul className="absolute top-[60px] left-5 flex flex-col w-[318px]">
        {items.map((notice) => (
          <div
            key={notice.id}
            className="overflow-hidden"
            style={{
              height: removingIds.includes(notice.id) ? 0 : ITEM_SLOT,
              opacity: removingIds.includes(notice.id) ? 0 : 1,
              transition: 'height 0.3s ease, opacity 0.2s ease',
            }}
          >
            <div className="pb-2">
              <MainNoticeItem
                text={notice.text}
                time={notice.time}
                isRead={notice.isRead}
                onClose={() => handleClose(notice.id)}
              />
            </div>
          </div>
        ))}
      </ul>

      {/* 알림 더보기 */}
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
