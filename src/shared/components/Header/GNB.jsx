import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import Modal from '../../../atoms/Modal/Modal';
import Image from '../../../atoms/Images/Common/Image';

const GNBWrapper = ({ children }) => (
  <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
    <div className="flex items-center justify-between w-full max-w-(--container-max-width-lg) px-4 xl:px-0">
      {children}
    </div>
  </header>
);

const Logo = () => (
  <a href="/">
    <Icon name="SymbolLogo" size={126} />
  </a>
);

const NavLinks = () => {
  const { pathname, search } = useLocation();
  const currentTab = new URLSearchParams(search).get('tab');

  const isActive = (tab) => pathname === '/' && currentTab === tab;

  const linkClass = (tab) =>
    `flex items-center h-full border-b-4 transition-all ${
      isActive(tab)
        ? 'border-primary'
        : 'border-transparent hover:border-primary'
    }`;

  return (
    <nav className="flex items-center gap-x-8 text-lg text-text font-regular h-full">
      <Link to="/?tab=local" className={linkClass('local')}>
        내 지역
      </Link>
      <Link to="/?tab=online" className={linkClass('online')}>
        온라인
      </Link>
    </nav>
  );
};

const LoggedOutButtons = () => {
  const navigate = useNavigate();
  return (
    <FlexibleButton variant="blue" size="M" onClick={() => navigate('/login')}>
      시작하기
    </FlexibleButton>
  );
};

const PROFILE_MENU = [
  { value: 'mypage', label: '마이페이지' },
  { value: 'logout', label: '로그아웃' },
];

function LoggedInActions() {
  // wooseok: 알림 store + 30초 폴링
  const hasUnread = useNotificationStore((s) => s.hasUnread);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const profileSrc = useAuthStore((s) => s.user?.profile_img ?? '');

  // dev: 드롭다운 / 모달 상태
  const { isOpen, toggle, close, containerRef } = useDisclosure();
  const {
    isOpen: isNoticeOpen,
    toggle: toggleNotice,
    close: closeNotice,
    containerRef: noticeRef,
  } = useDisclosure();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [hasChatBadge, setHasChatBadge] = useState(true);

  const handleSelect = (option) => {
    close();
    if (option.value === 'logout') setIsLogoutModalOpen(true);
    else if (option.value === 'mypage') navigate(`/profile/${userId}`);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    useAuthStore.getState().logout(); // wooseok: authStore 연결
  };

  return (
    <>
      <div className="flex items-center gap-x-xl">
        {/* 채팅 아이콘 */}
        <div
          className="cursor-pointer"
          onClick={() => {
            setHasChatBadge(false);
            setIsChatModalOpen(true);
          }}
        >
          <Badge show={hasChatBadge}>
            <Icon name="Chatting" size={30} />
          </Badge>
        </div>

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
                <FlexibleButton
                  variant="blue"
                  size="S"
                  className="w-full"
                  onClick={() => {
                    navigate('/study/create');
                    close();
                  }}
                >
                  스터디 만들기
                </FlexibleButton>
              </div>
              {PROFILE_MENU.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full h-10 px-xs text-left flex items-center font-sans"
                >
                  <span className="flex-1 h-[30px] flex items-center px-xs text-sm text-text rounded-lg hover:bg-bg-muted transition-colors">
                    {option.label}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        className="bg-bg rounded-2xl px-xl py-lg flex flex-col items-center gap-y-md shadow-lg min-w-[280px]"
      >
        <Image
          name="NotFound"
          alt="준비중"
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
        <p className="text-text text-base font-medium">
          채팅 기능은 준비중입니다.
        </p>
        <Button
          variant="blue"
          size="M"
          onClick={() => setIsChatModalOpen(false)}
        >
          확인
        </Button>
      </Modal>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

const GNB = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) ?? [];
    } catch {
      return [];
    }
  });
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasUnread = useNotificationStore((s) => s.hasUnread);
  const {
    isOpen: isMobileNoticeOpen,
    toggle: toggleMobileNotice,
    close: closeMobileNotice,
    containerRef: mobileNoticeRef,
  } = useDisclosure();

  const saveSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      saveSearch(searchValue);
      navigate(`/search?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSelectRecent = (term) => {
    setSearchValue(term);
    saveSearch(term);
    navigate(`/search?search=${encodeURIComponent(term)}`);
  };

  return (
    <GNBWrapper>
      {/* 데스크탑: 로고 + 네비 */}
      <div className="hidden md:flex items-center gap-x-14 h-full">
        <Logo />
        <NavLinks />
      </div>

      {/* 모바일: 햄버거 (왼쪽) */}
      <button className="flex md:hidden items-center p-1 cursor-pointer">
        <Icon name="Hamburger" size={24} />
      </button>

      {/* 모바일: 로고 (가운데 절대 위치) */}
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <a href="/" className="pointer-events-auto">
          <Icon name="SymbolLogo" size={110} />
        </a>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-x-4xl">
        {/* SearchBar: 모바일 숨김, 900px 이하에서 축소 */}
        <div className="hidden md:flex w-[400px] max-[900px]:w-[200px] transition-[width] duration-200">
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            recentSearches={recentSearches}
            onSelectRecent={handleSelectRecent}
          />
        </div>

        {/* 데스크탑 액션 */}
        <div className="hidden md:flex">
          {isLoggedIn ? <LoggedInActions /> : <LoggedOutButtons />}
        </div>

        {/* 모바일 액션: 알림 아이콘 */}
        <div className="flex md:hidden">
          {isLoggedIn ? (
            <div ref={mobileNoticeRef} className="relative cursor-pointer">
              <div onClick={toggleMobileNotice}>
                <Badge show={hasUnread}>
                  <Icon name="Notification" size={30} />
                </Badge>
              </div>
              {isMobileNoticeOpen && (
                <div className="absolute top-full right-0 mt-xs z-50">
                  <MainNoticeCard onMoreClick={closeMobileNotice} />
                </div>
              )}
            </div>
          ) : (
            <FlexibleButton
              variant="blue"
              size="S"
              onClick={() => navigate('/login')}
            >
              시작하기
            </FlexibleButton>
          )}
        </div>
      </div>

    </GNBWrapper>
  );
};

export default GNB;
