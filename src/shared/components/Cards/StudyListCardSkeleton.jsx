/**
 * StudyListCard 레이아웃과 동일한 구조의 스켈레톤 로딩 카드.
 * shimmer 애니메이션은 index.css의 .skeleton 클래스로 처리됩니다.
 */
function StudyListCardSkeleton() {
  return (
    <div className="relative w-[280px] h-[480px] bg-white border border-border rounded-md overflow-hidden">
      {/* 헤더 영역 — 상태 레이블 자리 */}
      <div className="absolute top-0 left-0 w-full h-[52px] px-4 flex items-center gap-2">
        <div className="skeleton w-5 h-5 rounded-full" />
        <div className="skeleton w-20 h-4" />
      </div>

      {/* 썸네일 영역 */}
      <div className="absolute top-[52px] left-0 w-full h-[280px] skeleton rounded-none" />

      {/* 좋아요 버튼 자리 */}
      <div className="absolute right-4 top-[286px] w-8 h-8 rounded-full skeleton" />

      {/* 콘텐츠 영역 */}
      <div className="absolute top-[332px] left-0 w-full px-4 py-3 flex flex-col gap-3">
        {/* 태그 두 개 */}
        <div className="flex gap-2">
          <div className="skeleton w-14 h-5 rounded-full" />
          <div className="skeleton w-10 h-5 rounded-full" />
        </div>

        {/* 제목 — 두 줄 */}
        <div className="flex flex-col gap-2">
          <div className="skeleton w-full h-4" />
          <div className="skeleton w-3/4 h-4" />
        </div>

        {/* 참가자 수 */}
        <div className="flex items-center gap-2 mt-1">
          <div className="skeleton w-4 h-4 rounded-full" />
          <div className="skeleton w-32 h-3" />
        </div>
      </div>
    </div>
  );
}

export default StudyListCardSkeleton;
