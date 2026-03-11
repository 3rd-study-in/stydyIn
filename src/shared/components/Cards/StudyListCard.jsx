import { useState, isValidElement, cloneElement } from 'react';
import Icon from '../../../atoms/Icon/Common/Icon';
import { TagSize } from '../../../atoms/Tag/index';
import { MainThumbnail } from '../../../atoms/Images/Common/index';

const STATUS_MAP = {
  recruiting: { label: '모집 중!', color: 'var(--color-primary)' },
  in_progress: { label: '진행 중!', color: 'var(--color-accent)' },
  completed: { label: '모집 완료', color: 'var(--color-secondary)' },
  closed: { label: '종료', color: 'var(--color-secondary)' },
};

/**
 * 세로형 스터디 목록 카드 (study-list-sample.png 기반)
 *
 * @param {'recruiting'|'in_progress'|'completed'|'closed'} status
 * @param {string}  [location]      위치 뱃지 텍스트
 * @param {string}  [category]      주제 태그 (예: '프로젝트')
 * @param {string}  [difficulty]    난이도 태그 (예: '초급')
 * @param {string}  title           스터디 제목
 * @param {number}  currentCount    현재 참가자 수
 * @param {string}  [image]         썸네일 이미지 URL (children 없을 때 사용)
 * @param {boolean} [isLiked]       좋아요 초기값 (없으면 내부 상태)
 * @param {() => void} [onLike]     좋아요 클릭 콜백
 * @param {() => void} [onClick]    카드 클릭 콜백
 * @param {React.ReactNode} [children]  썸네일 슬롯 (image보다 우선)
 * @param {string}  [className]     추가 Tailwind 클래스
 */
function StudyListCard({
  status = 'recruiting',
  location,
  category,
  difficulty,
  title,
  currentCount,
  isLiked: isLikedProp,
  onLike,
  onClick,
  image,
  children,
  className = '',
}) {
  const { label, color } = STATUS_MAP[status] ?? STATUS_MAP.recruiting;
  const [likedState, setLikedState] = useState(isLikedProp ?? false);
  const isLiked = isLikedProp !== undefined ? isLikedProp : likedState;

  function handleLike(e) {
    e.stopPropagation();
    if (onLike) {
      onLike();
    } else {
      setLikedState((prev) => !prev);
    }
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-[280px] h-[480px] bg-white border border-border rounded-md overflow-hidden font-sans ${onClick ? 'cursor-pointer hover:border-[#c6cacf]' : ''} ${className}`}
    >
      {/* 헤더 — 상태(사이렌 + 텍스트) + 위치 TagSize */}
      <div className="absolute top-0 left-0 w-full h-[52px] px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="Speaker" size={24} color={color} />
          <span className="text-base font-bold" style={{ color }}>
            {label}
          </span>
        </div>
        {location && (
          <TagSize
            size="S"
            variant="lightgray"
            className="hover:bg-bg-muted cursor-default"
          >
            {location}
          </TagSize>
        )}
      </div>

      {/* 썸네일 */}
      <div className="absolute top-[52px] left-0 w-full h-[280px] bg-bg-muted border-y border-border overflow-hidden">
        {children ? (
          isValidElement(children) && children.type === 'img'
            ? cloneElement(children, {
                onError: (e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = MainThumbnail;
                },
              })
            : children
        ) : (
          <img
            src={image || MainThumbnail}
            alt="스터디 썸네일"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = MainThumbnail;
            }}
          />
        )}
      </div>

      {/* 좋아요 버튼 */}
      <button
        onClick={handleLike}
        className="absolute right-4 top-[286px] w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
        style={{ filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.1))' }}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      >
        {isLiked ? (
          <Icon name="HeartFill" size={20} className="text-accent-dark" />
        ) : (
          <Icon name="Heart" size={20} className="text-accent-dark" />
        )}
      </button>

      {/* 콘텐츠 */}
      <div className="absolute top-[332px] left-0 w-full h-[148px] px-4 py-3 flex flex-col justify-start ">
        {/* 태그 */}
        <div className="flex items-center gap-2">
          {category && (
            <TagSize size="S" variant="gray">
              {category}
            </TagSize>
          )}
          {difficulty && (
            <TagSize size="S" variant="gray">
              {difficulty}
            </TagSize>
          )}
        </div>

        {/* 제목 */}
        <p className="text-lg font-bold text-text pt-md leading-snug line-clamp-2">
          {title}
        </p>

        {/* 참가자 수 */}
        {currentCount !== undefined && (
          <div className="flex items-center mt-2 gap-1 text-sm text-secondary">
            <Icon name="People" size={18} color="var(--color-secondary)" />
            <span>
              현재{' '}
              <strong className="font-bold text-primary">
                {currentCount}명
              </strong>
              이 신청했어요.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyListCard;
