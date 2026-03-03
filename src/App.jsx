import { BrowserRouter } from 'react-router-dom';
import StudyStateCard from './atoms/Card/StudyStateCard';

function App() {
  return (
    <BrowserRouter>
      <StudyStateCard />
    </BrowserRouter>
  );
}

export default App;
