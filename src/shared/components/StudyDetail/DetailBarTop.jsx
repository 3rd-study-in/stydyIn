import React, { useState } from 'react';
import TagSize from '../../../atoms/Tag/TagSize';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import { Share, Heart, HeartFill } from '../../../atoms/Icon/Common'; 
import { BannerStudy } from '../../../asset/images'; 


/**
 * 스터디 상세 상단 배너 - 기능 포함형 (좋아요/공유하기)
 * @param {number} initialLikeCount - 초기 좋아요 수
 * @param {boolean} isInitialLiked - 사용자의 초기 좋아요 여부
 */
const DetailBarTop = ({
  image = BannerStudy,
  categories = [], 
  title = '',
  hashtags = [],
  location = '',
  initialLikeCount = 0,
  isInitialLiked = false,
}) => {
  // --- 상태 관리 (State) ---
  const [isLiked, setIsLiked] = useState(isInitialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // --- 이벤트 핸들러 (Handlers) ---
  
  // 1. 좋아요 토글 로직
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 2. 링크 공유 로직 (클립보드 복사)
  const handleShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => alert('링크가 클립보드에 복사되었습니다!')) // 추후 Toast 컴포넌트로 대체 가능
      .catch(err => console.error('링크 복사 실패:', err));
  };

  return (
    /* 1. 전체 배너 컨테이너  */
    <div className="mx-auto flex h-[390px] w-[1190px] overflow-hidden rounded-lg border border-border bg-bg shadow-sm">
      
      {/* 2. 좌측 이미지 영역 */}
      <div className="h-[390px] w-[390px] shrink-0 border-r border-border bg-bg-muted">
        <img
          src={image}
          alt="Study Thumbnail"
          className="h-full w-full object-cover"
        />
      </div>

      {/* 3. 우측 콘텐츠 영역 */}
      <div className="relative flex w-[740px] flex-col p-[30px]">
        
        {/* 카테고리 태그 및 지역 정보 (태그 간격 6px) */}
        <div className="flex items-start justify-between">
          <div className="flex gap-[6px]">
            {categories.map((cat, idx) => (
              <TagSize key={idx} size="M" variant="lightgray">
                {cat}
              </TagSize>
            ))}
          </div>
          {/* 지역 정보 텍스트 위치 고정 */}
          <span className="text-base font-medium text-text-muted">{location}</span>
        </div>

        {/* 메인 타이틀 (상단 태그와 30px 간격) */}
        <h1 className="mt-[30px] text-[30px] font-bold leading-tight text-text line-clamp-2">
          {title}
        </h1>

        {/* 해시태그 및 버튼 그룹 (타이틀 하단 138px 여백 확보) */}
        <div className="mt-auto flex items-end justify-between">
          
          {/* 해시태그 및 좋아요 수 표시 영역 */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-[6px] text-lg font-bold text-info max-w-[440px]">
              {hashtags.map((tag, idx) => (
                <span key={idx}>{tag}</span>
              ))}
            </div>
            {/* 좋아요 수 표시 */}
            <span className="text-sm text-text-muted font-medium">
              관심 스터디 <span className="text-accent-dark">{likeCount}</span>명
            </span>
          </div>

          {/* 버튼 그룹: 공유하기 및 좋아요(하트) */}
          <div className="flex gap-[10px] shrink-0">
            <FlexibleButton
              variant="white"
              size="L"
              width="190px"
              onClick={handleShareLink} // 공유 기능 연결
              className="flex items-center justify-center gap-2 border-secondary-light active:scale-95 transition-transform"
            >
              <Share className="h-5 w-5" />
              <span>공유하기</span>
            </FlexibleButton>

            <FlexibleButton
              variant="white"
              size="L"
              width="50px"
              onClick={handleLikeToggle} // 좋아요 기능 연결
              className="flex items-center justify-center border-secondary-light p-0 active:scale-90 transition-transform"
            >
              {/* 상태에 따라 아이콘 및 색상 변경 */}
              {isLiked ? (
                <HeartFill className="h-6 w-6 text-accent-dark" />
              ) : (
                <Heart className="h-6 w-6 text-secondary" />
              )}
            </FlexibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBarTop;