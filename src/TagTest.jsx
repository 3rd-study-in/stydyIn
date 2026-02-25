import { Tag } from './atoms/Tag'

function TagTest() {
  return (
    <div className="p-10 flex flex-col items-start gap-6">
      {/* L 사이즈 - 색상별 */}
      <div className="flex gap-4 items-center">
        <Tag size="L" variant="lightgray">최신 스터디</Tag>
        <Tag size="L" variant="blue">최신 스터디</Tag>
      </div>

      {/* M 사이즈 */}
      <Tag size="M">랄랄랄랄</Tag>

      {/* S 사이즈 */}
      <Tag size="S">노형동</Tag>

      {/* SS 사이즈 */}
      <Tag size="SS">노형동</Tag>

      {/* M-2 (X 버튼) */}
      <div className="flex gap-4 items-center">
        <Tag size="M" onRemove={() => alert('삭제!')}>Python</Tag>
        <Tag size="M" onRemove={() => alert('삭제!')}>백엔드개발</Tag>
      </div>
    </div>
  )
}

export default TagTest