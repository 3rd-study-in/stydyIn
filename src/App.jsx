import { MainCategoryIcon } from './shared/components/Category';
// 이미지 4번(atoms/Icon/index.js)에서 정의된 모든 아이콘을 가져옵니다.
import { 
  Special, Learn, Practical, Project, 
  Challenge, Certification, Job, More 
} from './atoms/Icon';

function App() {
  // 이미지 3번의 디자인 순서와 라벨을 100% 일치시켰습니다.
  const categoryData = [
    { icon: Special, label: '특강' },
    { icon: Learn, label: '개념학습' },
    { icon: Practical, label: '응용/활용' },
    { icon: Project, label: '프로젝트' },
    { icon: Challenge, label: '챌린지' },
    { icon: Certification, label: '자격증/시험' },
    { icon: Job, label: '취업/코테' },
    { icon: More, label: '기타' },
  ];

  return (
    <div className="p-10 bg-white min-h-screen">
      {/* 이미지 5번 스펙: 카테고리 간 간격 30px 적용
        index.css에 정의된 --spacing-3xl (30px)을 사용합니다.
      */}
      <div className="flex gap-[30px] items-start">
        {categoryData.map((item, index) => (
          <MainCategoryIcon 
            key={index} 
            icon={item.icon} 
            label={item.label} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;