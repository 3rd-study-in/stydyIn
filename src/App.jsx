import { CommentSection } from "./shared/components/Comment";

function App() {
  return (
    <div className="p-[30px]">
      <CommentSection
        studyPk={1}
        leaderId={1}
      />
    </div>
  );
}

export default App;