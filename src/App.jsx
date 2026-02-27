import { MainCategoryIcon } from './shared/components/Category';
// 이미지 4번(atoms/Icon/index.js)에서 정의된 모든 아이콘을 가져옵니다.
import { 
  Special, Learn, Practical, Project, 
  Challenge, Certification, Job, More 
} from './atoms/Icon';

// function App() {
//   return (
//     <>
//     </>
//   );
// }

// export default App;


import React from 'react';
import AuthSystem from './shared/components/auth/AuthSystem.jsx';

function App() {

  return (
    /**
     * index.css의 테마를 활용한 전체 레이아웃
     * bg-bg: #FFFFFF (배경색)
     * font-sans: 'Spoqa Han Sans Neo' (폰트)
     */

    <div className=" bg-bg font-sans antialiased">
      {/* 모바일 뷰를 고려하여 중앙 정렬된 컨테이너 
        가로 폭 322px 기준은 컴포넌트 내부에서 잡고 있습니다.
      */}
      <main className="flex ">
        <AuthSystem />
      </main>
    </div>
  );
}

export default App;