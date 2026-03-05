import React, { useEffect, useState } from 'react';
import Button from '../../../atoms/Button/Button';
import Icon from '../../../atoms/Icon/Common/Icon';
import ProfileCircle from '../../../atoms/ProfileCircle/ProfileCircle';
import SearchBar from '../../../atoms/SearchBar/SearchBar';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Badge from '../../../atoms/Badge/Badge';
import useNotificationStore from '../../../stores/notificationStore';
import useAuthStore from '../../../stores/authStore';
import { useDisclosure } from '../../hooks/useDisclosure';
import MainNoticeCard from '../Cards/MainNoticeCard';
import LogoutConfirmModal from '../Modal/LogoutConfirmModal';

const GNBWrapper = ({ children }) => (
  <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
    <div className="flex items-center justify-between w-full max-w-(--container-max-width-lg)">
      {children}
    </div>
  </header>
);

const Logo = () => (
  <a href="/">
    <Icon name="SymbolLogo" size={126} />
  </a>
);

const NavLinks = () => (
  <nav className="flex items-center gap-x-8 text-lg text-text font-regular h-full">
    <a href="#" className="flex items-center h-full border-b-4 border-transparent hover:border-primary transition-all">
      내 지역
    </a>
    <a href="#" className="flex items-center h-full border-b-4 border-transparent hover:border-primary transition-all">
      온라인
    </a>
  </nav>
);

const LoggedOutButtons = () => (
  <FlexibleButton variant="blue" size="M">
    시작하기
  </FlexibleButton>
);

const PROFILE_MENU = [
  { value: 'mypage', label: '마이페이지' },
  { value: 'logout', label: '로그아웃' },
];

function LoggedInActions({ profileSrc }) {
  // wooseok: 알림 store + 30초 폴링
  const hasUnread = useNotificationStore((s) => s.hasUnread);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // dev: 드롭다운 / 모달 상태
  const { isOpen, toggle, close, containerRef } = useDisclosure();
  const {
    isOpen: isNoticeOpen,
    toggle: toggleNotice,
    close: closeNotice,
    containerRef: noticeRef,
  } = useDisclosure();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSelect = (option) => {
    close();
    if (option.value === 'logout') setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    useAuthStore.getState().logout(); // wooseok: authStore 연결
  };

  return (
    <>
      <div className="flex items-center gap-x-xl">
        {/* 채팅 아이콘 — TODO: 채팅 store 연결 시 show 값 교체 */}
        <Badge show={true}>
          <Icon name="Chatting" size={30} className="cursor-pointer" />
        </Badge>

        {/* 알림 아이콘 — hasUnread일 때 빨간 점, 클릭 시 패널 */}
        <div ref={noticeRef} className="relative cursor-pointer">
          <div onClick={toggleNotice}>
            <Badge show={hasUnread}>
              <Icon name="Notification" size={30} className="cursor-pointer" />
            </Badge>
          </div>
          {isNoticeOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-xs z-50">
              <MainNoticeCard onMoreClick={closeNotice} />
            </div>
          )}
        </div>

        {/* 프로필 드롭다운 */}
        <div ref={containerRef} className="relative">
          <div onClick={toggle} className="cursor-pointer">
            <ProfileCircle src={profileSrc} isLoggedIn={true} size={44} />
          </div>
          {isOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-xs w-[160px] bg-bg border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] py-xxxs z-50">
              <div className="px-xs py-xxxs">
                <FlexibleButton variant="blue" size="S" className="w-full">
                  스터디 만들기
                </FlexibleButton>
              </div>
              {PROFILE_MENU.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full h-10 px-xs text-left flex items-center font-sans"
                >
                  <span className="flex-1 h-[30px] flex items-center px-xs text-sm text-text rounded-lg hover:bg-bg-muted transition-colors">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

const GNB = ({ profileSrc = '' }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <GNBWrapper>
      <div className="flex items-center gap-x-14 h-full">
        <Logo />
        <NavLinks />
      </div>
      <div className="flex items-center gap-x-4xl">
        <SearchBar />
        {isLoggedIn ? (
          <LoggedInActions profileSrc={profileSrc} />
        ) : (
          <LoggedOutButtons />
        )}
      </div>
    </GNBWrapper>
  );
};

export default GNB;