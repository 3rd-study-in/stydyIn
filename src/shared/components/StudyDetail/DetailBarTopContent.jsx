import React, { useState } from 'react';
import TagSize from '../../../atoms/Tag/TagSize';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import { Share, Heart, HeartFill } from '../../../atoms/Icon/Common';

/**
 * 상세페이지 배너 콘텐츠
 */
const DetailBarTopContent = ({
  categories = [],
  title = '',
  hashtags = [],
  location = '',
  isInitialLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(isInitialLiked);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => alert('링크가 클립보드에 복사되었습니다!'))
      .catch(err => console.error('링크 복사 실패:', err));
  };

  return (
    <>
      {/* 카테고리 태그 + 지역 태그 */}
      <div className="flex items-start justify-between">
        <div className="flex gap-[6px]">
          {categories.map((cat, idx) => (
            <TagSize key={idx} size="M" variant="gray">
              {cat}
            </TagSize>
          ))}
        </div>
        {/* 우측 지역 태그 */}
        {location && (
          <TagSize size="M" variant="lightgray">
            {location}
          </TagSize>
        )}
      </div>

      {/* 타이틀 */}
      <h1 className="mt-[30px] text-[30px] font-bold leading-tight text-text line-clamp-2">
        {title}
      </h1>

      {/* 해시태그 + 버튼 */}
      <div className="mt-[138px] flex items-start justify-between">
        
        {/* 해시태그 */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-[6px] text-[16px] font-bold text-info max-w-[460px]">
            {hashtags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-[10px]">
          <FlexibleButton
            variant="white"
            size="L"
            width="190px"
            onClick={handleShareLink}
            className="h-[54px] border-secondary-light active:scale-95 transition-transform"
          >
            <span className="flex items-center justify-center gap-[8px]">
              <Share className="w-[20px] h-[20px]" />
              <span className="text-[16px] font-medium">공유하기</span>
            </span>
          </FlexibleButton>

          <FlexibleButton
            variant="white"
            size="L"
            width="50px"
            onClick={handleLikeToggle}
            className="h-[50px] flex items-center justify-center border-secondary-light p-[15px] active:scale-90 transition-transform"
          >
            {isLiked ? (
              <HeartFill className="w-[20px] h-[20px] text-accent-dark" />
            ) : (
              <Heart className="w-[20px] h-[20px] text-secondary" />
            )}
          </FlexibleButton>
        </div>
      </div>
    </>
  );
};

export default DetailBarTopContent;