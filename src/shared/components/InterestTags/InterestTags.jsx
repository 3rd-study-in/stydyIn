import TagSize from '../../../atoms/Tag/TagSize';

/**
 * 관심 분야 태그 목록 컴포넌트
 * @param {Object[]} tags - [{id: number, name: string}] 형태의 객체 배열
 */
function InterestTags({ tags }) {
  // 데이터가 없거나 배열이 아니면 출력하지 않음
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null;

  return (
    <section>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          // tag.name을 출력하고, 고유 값인 tag.id를 key로 사용합니다.
          <TagSize key={tag.id} size="M" variant="blue">
            {tag.name}
          </TagSize>
        ))}
      </div>
    </section>
  );
}

export default InterestTags;
