import React from 'react';
import Button from '../../../atoms/Button/Button';
import Icon from '../../../atoms/Icon/Common/Icon';
import ProfileCircle from '../../../atoms/ProfileCircle/ProfileCircle';
import SearchBar from '../../../atoms/SearchBar/SearchBar';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';

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

const LoggedInActions = ({ profileSrc }) => (
  <div className="flex items-center gap-x-5">
    <div className="relative cursor-pointer">
      <Icon name="Chatting" size={30} />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-error rounded-full"></div>
    </div>
    <div className="relative cursor-pointer">
      <Icon name="Notification" size={30} />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-error rounded-full"></div>
    </div>
    <ProfileCircle src={profileSrc} isLoggedIn={true} size={44} />
  </div>
);

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
