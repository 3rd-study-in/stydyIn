import React from 'react';
import Icon from '../../../atoms/Icon/Common/Icon';

const Logo = () => (
  <a href="/">
    <Icon name="SymbolLogo" size={126} />
  </a>
);

const GNBLogin = () => {
  return (
    <header className="relative flex justify-center w-full h-[80px] bg-bg border-b border-border">
      <div className="flex items-center justify-center w-full max-w-[1190px] max-md:px-4">
        <Logo />
      </div>
    </header>
  );
};

export default GNBLogin;