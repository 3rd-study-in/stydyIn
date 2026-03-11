function ProfileTabSkeleton() {
  return (
    <div className="flex flex-col items-center gap-[30px] p-10 w-full">
      {/* 프로필 카드 영역 */}
      <div className="w-[600px] flex flex-col items-center gap-5">
        {/* 프로필 이미지 */}
        <div className="skeleton w-[130px] h-[130px] rounded-full" />
        {/* 닉네임 */}
        <div className="skeleton w-32 h-5 rounded" />
        {/* 소개 박스 */}
        <div className="skeleton w-full h-[80px] rounded-[10px]" />
      </div>

      {/* 구분선 */}
      <div className="skeleton w-full h-px rounded-none" />

      {/* 정보 박스 영역 */}
      <div className="w-full flex flex-col gap-3xl">
        {/* 필드 5개 */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 h-10">
              <div className="skeleton w-24 h-4 shrink-0 rounded" />
              <div className="skeleton h-4 rounded" style={{ width: `${[160, 120, 140, 180, 100][i]}px` }} />
            </div>
          ))}
          {/* GitHub 잔디 자리 */}
          <div className="skeleton ml-26 mt-3 h-[150px] rounded-lg" style={{ width: 'calc(100% - 104px)' }} />
        </div>

        {/* 관심 분야 */}
        <div className="flex items-center gap-2">
          <div className="skeleton w-24 h-4 shrink-0 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${[64, 90, 72, 56][i]}px` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTabSkeleton;
