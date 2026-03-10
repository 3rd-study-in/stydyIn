import { useNavigate } from 'react-router-dom';
import TagSize from '../../../atoms/Tag/TagSize';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import { Share, Heart, HeartFill } from '../../../atoms/Icon/Common';
import { CATEGORIES } from '../../../constants/categories';

/**
 * 상세페이지 배너 콘텐츠
 */
const DetailBarTopContent = ({
  categories = [],
  title = '',
  hashtags = [],
  location = '',
  isLiked = false,
  onLike,
  onShare,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* 카테고리 태그 + 지역 태그 */}
          <div className="flex items-start ">
            <div className="flex gap-[6px]">
              {categories.map((cat, idx) => {
                const matched = CATEGORIES.find((c) => c.label === cat);
                const href = matched
                  ? `/search?subject=${matched.id}`
                  : `/search?search=${encodeURIComponent(cat)}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigate(href)}
                    className="cursor-pointer bg-transparent border-0 p-0 hover:opacity-75 transition-opacity"
                  >
                    <TagSize size="M" variant="gray">
                      {cat}
                    </TagSize>
                  </button>
                );
              })}
            </div>
            {/* 우측 지역 태그 */}
            {location && (
              <TagSize size="M" variant="lightgray">
                {location}
              </TagSize>
            )}
          </div>

          {/* 타이틀 */}
          <h1 className="text-[30px] mt-3xl font-bold leading-tight text-text line-clamp-2">
            {title}
          </h1>
        </div>
        {/* 해시태그 + 버튼 */}
        <div className=" flex items-start justify-between">
          {/* 해시태그 */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-xxs text-lg font-bold text-info max-w-[460px]">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(
                      `/search?search=${encodeURIComponent(tag.replace('#', ''))}`,
                    )
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-sm">
            <FlexibleButton
              variant="white"
              size="L"
              width="190px"
              onClick={onShare}
              className="border-secondary-light active:scale-95 transition-transform"
            >
              <span className="flex items-center justify-center gap-xs">
                <Share className="w-[20px] h-[20px]" />
                <span className="text-lg font-medium">공유하기</span>
              </span>
            </FlexibleButton>

            <FlexibleButton
              variant="white"
              size="L"
              width="50px"
              onClick={onLike}
              className="flex items-center justify-center border-secondary-light p-[15px] active:scale-90 transition-transform"
            >
              {isLiked ? (
                <HeartFill className="w-[20px] h-[20px] text-accent-dark" />
              ) : (
                <Heart className="w-[20px] h-[20px] text-secondary" />
              )}
            </FlexibleButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailBarTopContent;
