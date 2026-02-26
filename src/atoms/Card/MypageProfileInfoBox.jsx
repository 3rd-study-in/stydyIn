/**
 * 마이페이지 정보 박스 (mypage-profile-infobox.png 기반)
 * 너비: 910px 고정 / 높이: 콘텐츠에 따라 유동
 *
 * @param {string} [email]           이메일(ID)
 * @param {string} [name]            이름
 * @param {string} [phone]           전화번호
 * @param {string} [location]        내 지역
 * @param {string} [github]          GitHub 사용자명
 * @param {React.ReactNode} [children]     소개 박스 슬롯 (bg #F3F5FA 박스 안)
 * @param {React.ReactNode} [interestSlot] 관심 분야 태그 영역 슬롯
 * @param {string} [className]       추가 Tailwind 클래스
 */

const FIELDS = [
  { key: 'email',    label: '이메일(ID)' },
  { key: 'name',     label: '이름'       },
  { key: 'phone',    label: '전화번호'   },
  { key: 'location', label: '내 지역'    },
  { key: 'github',   label: 'GitHub'     },
]

function MypageProfileInfoBox({
  email,
  name,
  phone,
  location,
  github,
  children,
  interestSlot,
  className = '',
}) {
  const values = { email, name, phone, location, github }

  return (
    <div className={`w-[910px] bg-white flex flex-col gap-[20px] font-sans ${className}`}>
      {/* 필드 목록 */}
      <div className="flex flex-col gap-[20px]">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-[30px] h-6">
            <span className="w-[70px] text-sm font-bold text-text-muted shrink-0">
              {label}
            </span>
            <span className="text-base text-text-muted">
              {values[key] || '-'}
            </span>
          </div>
        ))}
      </div>

      {/* 소개 박스 슬롯 */}
      <div className="w-[810px] h-[160px] bg-bg-muted border border-border rounded-[10px] mx-auto overflow-y-auto px-5 py-4 text-sm text-text">
        {children}
      </div>

      {/* 관심 분야 */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-text-muted">관심 분야</span>
        {interestSlot && <div className="flex flex-wrap gap-2">{interestSlot}</div>}
      </div>
    </div>
  )
}

export default MypageProfileInfoBox
