import React, { useState } from 'react';
import FilterDropdown from '../../../atoms/DropdownSelect/FilterDropdown';
import Button from '../../../atoms/Button/Button';
import { CATEGORIES } from '../../../constants/categories';

const DIFFICULTY_MAP = { 초급: 1, 중급: 2, 고급: 3 };
const DAY_MAP = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7 };
const STATUS_MAP = { '모집 중': 1, '진행 중': 3, 종료: 4 };

const TAG_FILTERS = {
  주제: ['개념학습', '응용/활용', '프로젝트', '챌린지', '자격증/시험', '취업/코테', '특강', '기타'],
  난이도: ['초급', '중급', '고급'],
  요일: ['월', '화', '수', '목', '금', '토', '일'],
  유형: ['내 지역', '온라인'],
  상태: ['모집 중', '진행 중', '종료'],
};

const toApiParams = (selected) => {
  const params = {};

  const subjects = selected['주제'] ?? [];
  if (subjects.length > 0) {
    const ids = subjects
      .map((name) => CATEGORIES.find((c) => c.label === name)?.id)
      .filter(Boolean);
    params.subject = ids.length === 1 ? ids[0] : ids;
  }

  const difficulties = selected['난이도'] ?? [];
  if (difficulties.length > 0) {
    const ids = difficulties.map((d) => DIFFICULTY_MAP[d]);
    params.difficulty = ids.length === 1 ? ids[0] : ids;
  }

  const days = selected['요일'] ?? [];
  if (days.length > 0) {
    const ids = days.map((d) => DAY_MAP[d]);
    params.study_day = ids.length === 1 ? ids[0] : ids;
  }

  const types = selected['유형'] ?? [];
  if (types.length === 1) {
    params.is_offline = types[0] === '내 지역' ? 1 : 0;
  }

  const statuses = selected['상태'] ?? [];
  if (statuses.length > 0) {
    const ids = statuses.map((s) => STATUS_MAP[s]);
    params.study_status = ids.length === 1 ? ids[0] : ids;
  }

  return params;
};

const FilterTag = ({ children, isSelected, onClick }) => (
  <span
    onClick={onClick}
    className={`inline-flex items-center h-[44px] px-lg rounded-full text-base cursor-pointer transition-colors
      ${isSelected ? 'bg-primary text-white' : 'bg-bg-muted text-text-muted'}`}
  >
    {children}
  </span>
);

const TagDropdown = ({ selected, onToggle, onReset, onApply }) => (
  <div className="w-full border border-border rounded-lg p-3xl bg-white">
    <div className="flex flex-col gap-xl">
      {Object.entries(TAG_FILTERS).map(([category, tags]) => (
        <div key={category} className="flex items-center gap-xl">
          <p className="w-[70px] font-bold text-base text-text-muted">
            {category}
          </p>
          <div className="flex gap-lg flex-wrap">
            {tags.map((tag) => (
              <FilterTag
                key={tag}
                isSelected={selected[category]?.includes(tag) ?? false}
                onClick={() => onToggle(category, tag)}
              >
                {tag}
              </FilterTag>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-sm mt-2xl">
      <Button variant="white" size="M" onClick={onReset}>
        초기화
      </Button>
      <Button variant="blue" size="M" onClick={onApply}>
        필터 적용
      </Button>
    </div>
  </div>
);

const SearchFilter = ({ onApply, onReset, initialSelected, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected || {});

  const toggle = (category, tag) => {
    setSelected((prev) => {
      const current = prev[category] ?? [];
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [category]: next };
    });
  };

  const reset = () => {
    setSelected({});
    onReset?.();
  };

  const apply = () => {
    onApply?.(toApiParams(selected), selected);
  };

  return (
    <div className="w-full max-w-(--container-max-width-lg) flex flex-col gap-[19px]">
      <div className="self-end" onClick={() => { setIsOpen((prev) => { const next = !prev; onOpenChange?.(next); return next; }); }}>
        <FilterDropdown label="검색 필터" options={[]} />
      </div>
      {isOpen && (
        <TagDropdown
          selected={selected}
          onToggle={toggle}
          onReset={reset}
          onApply={apply}
        />
      )}
    </div>
  );
};

export default SearchFilter;
