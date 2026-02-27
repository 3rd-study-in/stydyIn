// import { MainCategoryIcon } from './shared/components/Category';
// // 이미지 4번(atoms/Icon/index.js)에서 정의된 모든 아이콘을 가져옵니다.
// import { 
//   Special, Learn, Practical, Project, 
//   Challenge, Certification, Job, More 
// } from './atoms/Icon';

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
    <div className=" bg-bg font-sans antialiased">
      <main className="flex ">
        <AuthSystem />
      </main>
    </div>
  );
}

export default App;