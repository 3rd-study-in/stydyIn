export const MOCK_PROFILE = {
  is_associate_member: false,
  is_social_user: false,
  user_login_type: '일반',
  user: 1,
  name: '소울곰',
  nickname: '진짜소울곰',
  profile_img: null,
  introduction: '수정된 소개글입니다.',
  phone: '010-9999-8888',
  email: 'soulgom@example.com',
  preferred_region: { id: 2, sort_order: 2, location: '경기' },
  github_username: 'soulgom',
  tag: [
    { id: 1, name: 'Python' },
    { id: 3, name: 'Django' },
  ],
  grade: '새싹',
}

export const MOCK_STUDIES = [
  { id: 1, status: '모집 중',   location: '서울', category: '개념학습',  difficulty: '초급', title: 'Python 기초 스터디',    currentCount: 3 },
  { id: 2, status: '진행 중',   location: null,   category: '프로젝트',  difficulty: '중급', title: 'React 프로젝트 스터디',  currentCount: 5 },
  { id: 3, status: '모집 완료', location: '경기', category: '취업/코테', difficulty: '고급', title: '코딩테스트 준비 스터디', currentCount: 8 },
]

export const MOCK_NOTIFICATIONS = [
  { id: 1, text: '새로운 스터디에 참여 요청이 들어왔습니다.',                  time: '방금' },
  { id: 2, text: 'Python 기초 스터디가 시작되었습니다.',                       time: '1시간 전' },
  { id: 3, text: '관심 스터디 "React 프로젝트"의 모집이 시작되었습니다.',      time: '3시간 전' },
]
