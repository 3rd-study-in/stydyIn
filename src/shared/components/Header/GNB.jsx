import React, { useEffect } from 'react';
import Button from '../../../atoms/Button/Button';
import Icon from '../../../atoms/Icon/Common/Icon';
import ProfileCircle from '../../../atoms/ProfileCircle/ProfileCircle';
import SearchBar from '../../../atoms/SearchBar/SearchBar';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Badge from '../../../atoms/Badge/Badge';
import useNotificationStore from '../../../stores/notificationStore';
import useAuthStore from '../../../stores/authStore';

const GNBWrapper = ({ children }) => (
  <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
    <div className="flex items-center justify-between w-full max-w-[1190px]">
      {children}
    </div>
  </header>
);

const Logo = () => (
  <div className="cursor-pointer">
    <Icon name="SymbolLogo" size={126} />
  </div>
);

const NavLinks = () => (
  <nav className="flex items-center gap-x-8 text-lg text-text font-regular h-full">
    <a
      href="#"
      className="flex items-center h-full border-b-4 border-transparent hover:border-primary transition-all"
    >
      내 지역
    </a>
    <a
      href="#"
      className="flex items-center h-full border-b-4 border-transparent hover:border-primary transition-all"
    >
      온라인
    </a>
  </nav>
);

const LoggedOutButtons = () => (
  <div className="flex items-center gap-x-2">
    <FlexibleButton variant="blue" size="M">
      시작하기
    </FlexibleButton>
  </div>
);

function LoggedInActions({ profileSrc }) {
  const hasUnread = useNotificationStore((s) => s.hasUnread)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)

  // 마운트 시 즉시 fetch + 30초 폴링
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return (
    <div className="flex items-center gap-x-5">
      {/* 채팅 아이콘 — TODO: 채팅 store 연결 시 show 값 교체 */}
      <Badge show={true}>
        <Icon name="Chatting" size={30} className="cursor-pointer" />
      </Badge>

      {/* 알림 아이콘 — hasUnread일 때 빨간 점 표시 */}
      <Badge show={hasUnread}>
        <Icon name="Notification" size={30} className="cursor-pointer" />
      </Badge>

      <ProfileCircle src={profileSrc} isLoggedIn={true} size={44} />
    </div>
  )
}

const GNB = ({ profileSrc = '' }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <GNBWrapper>
      <div className="flex items-center gap-x-14 h-full">
        <Logo />
        <NavLinks />
      </div>
      <div className="flex items-center gap-x-8">
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
