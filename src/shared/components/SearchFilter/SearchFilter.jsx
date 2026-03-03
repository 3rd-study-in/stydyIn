import React, { useState } from 'react';
import FilterDropdown from '../../../atoms/DropdownSelect/FilterDropdown';
import Button from '../../../atoms/Button/Button';

const TAG_FILTERS = {
  주제: [
    '개념학습',
    '응용/활용',
    '프로젝트',
    '챌린지',
    '자격증/시험',
    '취업/코테',
    '특강',
    '기타',
  ],
  난이도: ['초급', '중급', '고급'],
  요일: ['월', '화', '수', '목', '금', '토', '일'],
  유형: ['내 지역', '온라인'],
  상태: ['모집 중', '진행 중', '종료'],
};

const FilterTag = ({ children, isSelected, onClick }) => (
  <span
    onClick={onClick}
    className={`inline-flex items-center h-[44px] px-4 rounded-[44px] text-base cursor-pointer transition-colors
      ${isSelected ? 'bg-primary text-white' : 'bg-bg-muted text-text-muted'}`}
  >
    {children}
  </span>
);

const TagDropdown = () => {
  const [selected, setSelected] = useState({});

  const toggle = (category, tag) => {
    setSelected((prev) => {
      const current = prev[category] ?? [];
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [category]: next };
    });
  };

  const reset = () => setSelected({});

  return (
    <div className="w-full border border-border rounded-lg p-[30px] bg-white">
      <div className="flex flex-col gap-5">
        {Object.entries(TAG_FILTERS).map(([category, tags]) => (
          <div key={category} className="flex items-center gap-5">
            <p className="w-[70px] font-bold text-base text-text-muted">
              {category}
            </p>
            <div className="flex gap-4 flex-wrap">
              {tags.map((tag) => (
                <FilterTag
                  key={tag}
                  isSelected={selected[category]?.includes(tag) ?? false}
                  onClick={() => toggle(category, tag)}
                >
                  {tag}
                </FilterTag>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2.5 mt-[28px]">
        <Button variant="white" size="M" onClick={reset}>
          초기화
        </Button>
        <Button variant="blue" size="M">
          필터 적용
        </Button>
      </div>
    </div>
  );
};

const SearchFilter = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-[1190px] flex flex-col gap-[19px]">
      <div className="self-end" onClick={() => setIsOpen((prev) => !prev)}>
        <FilterDropdown label="검색 필터" options={[]} />
      </div>
      {isOpen && <TagDropdown />}
    </div>
  );
};

export default SearchFilter;
