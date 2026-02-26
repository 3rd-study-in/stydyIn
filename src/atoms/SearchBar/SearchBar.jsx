import React from 'react';
import Icon from '../Icon/Common/Icon';

const SearchBar = ({
  value,
  onChange,
  placeholder = '어떤 스터디를 찾고 계신가요?',
  ...rest
}) => {
  return (
    <div className="relative flex w-[400px] h-[44px]">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full pl-5 pr-12 py-3 rounded-full border-2 border-border bg-white text-sm font-normal text-text-muted placeholder:text-text-disabled focus:outline-none focus:border-primary"
        {...rest}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <Icon name="Search" size={28} className="text-text-muted" />
      </div>
    </div>
  );
};

export default SearchBar;
