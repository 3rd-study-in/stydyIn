import SideNavButton from '../../../atoms/Button/SideNavButton';

const TABS = [
  { key: 'profile', label: '내 프로필' },
  { key: 'study', label: '내 스터디' },
  { key: 'notification', label: '알림' },
];

/**
 * 마이페이지 좌측 사이드 네비게이션
 *
 * @param {'profile'|'study'|'notification'} activeTab  현재 활성 탭
 * @param {function} onTabChange                         탭 변경 핸들러
 */
function MypageSideNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex flex-col gap-5 w-[170px] shrink-0">
      <h2 className="text-2xl font-bold text-text font-sans leading-[34px]">
        마이페이지
      </h2>
      <div className="flex flex-col gap-[10px]">
        {TABS.map(({ key, label }) => (
          <SideNavButton
            key={key}
            variant={activeTab === key ? 'blue' : 'lightgray'}
            onClick={() => onTabChange(key)}
          >
            {label}
          </SideNavButton>
        ))}
      </div>
    </nav>
  );
}

export default MypageSideNav;
