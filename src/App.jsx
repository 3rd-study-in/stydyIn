import { useState } from "react";
// 경로에서 Common/을 제거하고 Pagination 폴더로 직접 연결합니다.
import Pagination from "./shared/components/Pagination"; 

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="p-10">
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
    </div>
  );
}

export default App;