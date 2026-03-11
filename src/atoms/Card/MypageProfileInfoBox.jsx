/**
 * 마이페이지 정보 박스 (mypage-profile-infobox.png 기반)
 * 너비: 910px 고정 / 높이: 콘텐츠에 따라 유동
 *
 * @param {string} [email]                    이메일(ID)
 * @param {string} [name]                     이름
 * @param {string} [phone]                    전화번호
 * @param {string} [location]                 내 지역
 * @param {string} [github]                   GitHub 사용자명
 * @param {React.ReactNode} [children]        소개 박스 슬롯 (bg #F3F5FA 박스 안)
 * @param {React.ReactNode} [interestSlot]    관심 분야 태그 영역 슬롯
 * @param {React.ReactNode} [githubSlot]      GitHub 잔디 슬롯 (GitHub 필드 아래)
 * @param {string} [className]                추가 Tailwind 클래스
 */

const FIELDS = [
  { key: 'email', label: '이메일(ID)' },
  { key: 'name', label: '이름' },
  { key: 'phone', label: '전화번호' },
  { key: 'location', label: '내 지역' },
  { key: 'github', label: 'GitHub\nUser Name' },
];

function MypageProfileInfoBox({
  email,
  name,
  phone,
  location,
  github,
  interestSlot,
  githubSlot,
  className = '',
}) {
  const values = { email, name, phone, location, github };

  return (
    <div
      className={`w-full bg-white flex flex-col gap-3xl font-sans ${className}`}
    >
      {/* 필드 목록 */}
      <div className="flex flex-col gap-1">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center gap-2 h-10">
              <span className="w-24 text-sm font-bold text-secondary-dark shrink-0 whitespace-pre-line leading-snug">
                {label}
              </span>
              <span className="text-sm text-secondary-dark">
                {values[key] || '-'}
              </span>
            </div>
            {/* GitHub 잔디 */}
            {key === 'github' && githubSlot && (
              <div className="ml-26 mt-3">{githubSlot}</div>
            )}
          </div>
        ))}
      </div>

      {/* 관심 분야 */}
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm font-bold text-secondary-dark shrink-0 whitespace-pre-line leading-snug">
          관심 분야
        </span>
        {interestSlot ? (
          <div className="flex flex-wrap gap-2">{interestSlot}</div>
        ) : (
          <span className="text-sm text-text-disabled">
            관심 분야가 없습니다.
          </span>
        )}
      </div>
    </div>
  );
}

export default MypageProfileInfoBox;
