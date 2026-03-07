import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../atoms/Icon/Common/Icon';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';

const Logo = () => (
  <a href="/">
    <Icon name="SymbolLogo" size={126} />
  </a>
);

const GNBLogin = () => {
  const navigate = useNavigate();

  return (
    <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
      <div className="flex items-center w-full max-w-[1190px] px-4 xl:px-0 justify-center md:justify-center">
        {/* 모바일: 햄버거 (왼쪽) */}
        <button className="flex md:hidden items-center p-1 cursor-pointer">
          <Icon name="Hamburger" size={24} />
        </button>

        {/* 데스크탑: 로고 중앙 */}
        <div className="hidden md:flex">
          <Logo />
        </div>

        {/* 모바일: 로고 (가운데 절대 위치) */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <a href="/" className="pointer-events-auto">
            <Icon name="SymbolLogo" size={110} />
          </a>
        </div>

        {/* 모바일: 시작하기 버튼 (오른쪽) */}
        <div className="flex md:hidden ml-auto">
          <FlexibleButton
            variant="blue"
            size="S"
            onClick={() => navigate('/login')}
          >
            시작하기
          </FlexibleButton>
        </div>
      </div>
    </header>
  );
};

export default GNBLogin;
