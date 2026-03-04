/**
 * 상세 페이지 섹션 블록 (스터디 소개, 스터디 일정 등)
 * @param {string} title - 타이틀
 * @param {React.ReactNode} children - 컨텐츠(내용)
 */
const SectionBlock = ({ title = '', children }) => {
  return (
    <div className="w-full max-w-[840px]">
      <h2 className="text-[30px] font-bold text-text">
        {title}
      </h2>

      <div className="mt-[20px] text-[16px] font-normal text-text leading-relaxed">
        {children}
      </div>

      <div className="mt-[30px] border-b border-border" />
    </div>
  );
};

export default SectionBlock;