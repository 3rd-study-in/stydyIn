import { useState } from 'react';
import { CommentArrow, Send } from '../../../atoms/Icon/Common';

/**
 * 대댓글 입력창
 */
const ReplyInput = ({
  onSubmit,
  placeholder = "답글을 입력하세요.",
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="w-[824px] flex gap-[12px] ml-[16px]">
      {/* 대댓글 화살표 */}
      <CommentArrow className="w-[22px] h-[26px] text-border shrink-0" />

      {/* 입력창 */}
      <div className="w-[790px] h-[50px] flex border border-border rounded-[8px] overflow-hidden">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-[16px] text-[16px] font-normal text-text placeholder:text-secondary outline-none"
        />
        <button
          onClick={handleSubmit}
          className="w-[50px] h-[50px] bg-secondary-light flex items-center justify-center"
        >
          <Send className="w-[26px] h-[26px] text-bg" />
        </button>
      </div>
    </div>
  );
};

export default ReplyInput;