import React from 'react';
import Icon from '../../../atoms/Icon/Common/Icon';

const Logo = () => (
  <div className="cursor-pointer">
    <Icon name="SymbolLogo" size={126} />
  </div>
);

const GNBLogin = () => {
  return (
    <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
      <div className="flex items-center justify-center w-full max-w-[1190px]">
        <Logo />
      </div>
    </header>
  );
};

export default GNBLogin;