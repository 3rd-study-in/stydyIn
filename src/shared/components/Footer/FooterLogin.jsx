import { Link } from 'react-router-dom';

const FooterLogin = () => {
  const footerData = {
    policy: [
      { label: '이용약관', url: '#' },
      { label: '위치기반서비스이용약관', url: '#' },
      { label: '개인정보 처리방침', url: '#' },
    ],
  };

  return (
    // py-5xl(48px), text-text-disabled(비활성/힌트 색상) 적용
    <footer className="py-5xl px-xxxs text-center text-text-disabled text-xs sm:text-sm">
      {/* 1. 상단 링크 영역 */}
      <div className="flex justify-center items-center gap-md mb-4">
        {/* gap-md(12px), mb-xs(8px) */}
        {footerData.policy.map((item, index) => (
          <div key={item.label} className="flex items-center gap-md">
            <Link
              to={item.url}
              className="hover:text-primary transition-colors" // text-blue-600 대신 시스템 컬러인 primary 적용
            >
              {item.label}
            </Link>

            {/* 마지막 요소가 아닐 때만 구분선 표시 */}
            {index < footerData.policy.length - 1 && (
              // 하드코딩된 mx-3 대신 시스템 간격인 gap과 mx-0 사용
              <span className="text-border mx-0" aria-hidden="true">
                |
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 2. 하단 카피라이트 영역 */}
      <div className="text-text-disabled">
        <span>© Copyright </span>
        {/* font-bold(700), text-text(진한 색상) 적용 */}
        <span className="font-bold text-text">WENIV Corp.</span>
        <span> All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default FooterLogin;
