import Icon from '../Icon/Common/Icon';
import { useDisclosure } from '../../shared/hooks/useDisclosure';

const SearchBar = ({
  value,
  onChange,
  placeholder = '어떤 스터디를 찾고 계신가요?',
  recentSearches = [],
  onSelectRecent,
  ...rest
}) => {
  const { isOpen, open, close, containerRef } = useDisclosure();

  const showDropdown = isOpen && recentSearches.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-[400px] max-w-full"
    >
      <div className="relative flex w-full h-[44px]">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-full pl-5 pr-12 py-3 rounded-full border-2 border-border bg-bg text-base font-regular text-text-muted placeholder:text-text-disabled focus:outline-none focus:border-primary"
          onFocus={open}
          {...rest}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <Icon name="Search" size={28} className="text-text-muted" />
        </div>
      </div>

      {showDropdown && (
        <ul className="absolute top-[48px] left-0 w-full bg-bg border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] py-xxxs z-50 overflow-hidden">
          {recentSearches.map((term, index) => (
            <li
              key={index}
              className="h-10 px-xs py-[5px]"
              onMouseDown={() => {
                onSelectRecent?.(term);
                close();
              }}
            >
              <div className="w-full h-[30px] flex items-center px-sm rounded-md cursor-pointer hover:bg-bg-muted transition-colors">
                <span className="text-base font-regular text-text leading-[20px]">
                  {term}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
