import { useState } from 'react';
import Button from '../../../atoms/Button/Button';
import Icon from '../../../atoms/Icon/Common/Icon';
import ProfileCircle from '../../../atoms/ProfileCircle/ProfileCircle';
import SearchBar from '../../../atoms/SearchBar/SearchBar';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import { useDisclosure } from '../../hooks/useDisclosure';
import Modal from '../../../atoms/Modal/Modal';

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

const PROFILE_MENU = [
  { value: 'mypage', label: '마이페이지' },
  { value: 'logout', label: '로그아웃' },
];

const LoggedInActions = ({ profileSrc }) => {
  const { isOpen, toggle, close, containerRef } = useDisclosure();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSelect = (option) => {
    close();
    if (option.value === 'logout') {
      setIsLogoutModalOpen(true);
    }
    // settings: 추후 페이지 이동 연결
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    // 추후 로그아웃 로직 연결
  };

  return (
    <>
      <div className="flex items-center gap-x-5">
        <div className="relative cursor-pointer">
          <Icon name="Chatting" size={30} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-error rounded-full"></div>
        </div>
        <div className="relative cursor-pointer">
          <Icon name="Notification" size={30} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-error rounded-full"></div>
        </div>
        <div ref={containerRef} className="relative">
          <div onClick={toggle} className="cursor-pointer">
            <ProfileCircle src={profileSrc} isLoggedIn={true} size={44} />
          </div>
          {isOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[160px] bg-white border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] py-1 z-50">
              <div className="px-2 py-1">
                <FlexibleButton variant="blue" size="S" className="w-full">
                  스터디 만들기
                </FlexibleButton>
              </div>
              {PROFILE_MENU.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full h-10 px-2 text-left flex items-center font-sans"
                >
                  <span className="flex-1 h-[30px] flex items-center px-2 text-sm text-text rounded-lg hover:bg-bg-muted transition-colors">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
        <div className="bg-white rounded-2xl p-6 w-[320px] flex flex-col gap-5">
          <p className="text-center text-text font-medium">로그아웃 하시겠습니까?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 h-11 rounded-xl border border-border text-sm text-text hover:bg-bg-muted transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleLogoutConfirm}
              className="flex-1 h-11 rounded-xl bg-primary text-white text-sm hover:opacity-90 transition-opacity"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const GNB = ({ isLoggedIn = true, profileSrc = '' }) => {
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
