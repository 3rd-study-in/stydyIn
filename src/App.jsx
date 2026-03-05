import { CommentSection } from "./shared/components/Comment";
import { StudyDetailUserProfile } from "./atoms/Images/Common";

function App() {
  const mockComments = [
    {
      id: 1,
      userId: 'user1',
      profileImage: '',
      nickname: '주커버그사촌동생',
      date: '2022. 03. 23',
      content: '그룹장님 이거 주말에는 계획 없나요?',
      isSecret: false,
      isDeleted: false,
      replies: [
        {
          id: 2,
          userId: 'leader1',
          profileImage: StudyDetailUserProfile,
          nickname: '파이썬마술사',
          date: '2022. 03. 23',
          content: '네... 주말에는 알바가 있어서... ㅠㅠ',
          isSecret: false,
          isDeleted: false,
        }
      ]
    },
    {
      id: 3,
      userId: 'user1',
      profileImage: '',
      nickname: '주커버그사촌동생',
      date: '2022. 03. 23',
      content: '비밀댓글입니다.',
      isSecret: true,
      isDeleted: false,
      replies: []
    }
  ];

  return (
    <div>
      <CommentSection
        comments={mockComments}
        isMyPost={false}
        currentUserId="viewer"
        leaderId="leader1"
      />
    </div>
  );
}

export default App;