import { DetailBarTopContainer, DetailBarTopContent } from "./shared/components/StudyDetail";
import { StudyDetail } from "./atoms/Images/Common";

function App() {
  return (
    <div>
      <DetailBarTopContainer image={StudyDetail}>
        <DetailBarTopContent
          categories={['프로젝트', '초급']}
          title="크롬 확장 프로그램 함께 구현 해보실 분 찾습니다. (맞춤법 검사, 번역 서비스입니다.)"
          hashtags={['#Python', '#Google', '#크롬확장프로그램', '#구현프로젝트']}
          location="노형동"
          isInitialLiked={false}
        />
      </DetailBarTopContainer>
    </div>
  );
}

export default App;