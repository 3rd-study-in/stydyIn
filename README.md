# StudyIn

개발자 스터디 모집 및 관리 플랫폼입니다. 스터디를 생성하고, 참가하고, 함께 성장할 수 있는 공간을 제공합니다.

## 기술 스택

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Auth:** JWT (access_token 1h / refresh_token 7h)
- **Linting:** ESLint + Prettier

## 주요 기능

- 이메일 기반 회원가입 / 로그인 (JWT 인증)
- 스터디 목록 조회 / 검색 / 필터
- 스터디 생성 · 수정 · 삭제
- 스터디 참가 / 탈퇴
- 댓글 작성
- 사용자 프로필 조회 · 수정
- AI 커리큘럼 및 소개글 자동 생성

## 폴더 구조

```
src/
├── atoms/                      # 가장 기본이 되는 원시 컴포넌트 (비즈니스 로직 없음)
│   ├── Button/
│   ├── Input/
│   ├── Textarea/
│   ├── Badge/                  # 난이도, 스터디 상태 뱃지
│   ├── Avatar/                 # 프로필 이미지
│   ├── Icon/
│   ├── Spinner/                # 로딩 인디케이터
│   ├── Tag/                    # 관심 태그
│   └── Checkbox/
│
├── features/                   # 도메인별 기능 모음
│   ├── auth/                   # 로그인, 회원가입, JWT 처리
│   │   ├── components/         # LoginForm, SignupEmailStep, ProfileSetupForm 등
│   │   ├── hooks/              # useAuth
│   │   ├── api.js
│   │   └── index.js
│   ├── study/                  # 스터디 목록, 상세, 생성/수정/삭제
│   │   ├── components/         # StudyCard, StudyList, StudyForm, StudyDetail 등
│   │   ├── hooks/              # useStudy
│   │   ├── api.js
│   │   └── index.js
│   ├── profile/                # 사용자 프로필 조회 및 수정
│   │   ├── components/         # ProfileCard, ProfileEditForm
│   │   ├── hooks/
│   │   ├── api.js
│   │   └── index.js
│   ├── comment/                # 댓글 목록, 작성, 삭제
│   │   ├── components/         # CommentList, CommentItem, CommentInput
│   │   ├── hooks/
│   │   ├── api.js
│   │   └── index.js
│   └── ai/                     # AI 커리큘럼 / 소개글 자동 생성
│       ├── components/         # AICurriculumGenerator, AIDescriptionGenerator
│       ├── hooks/              # useAIGenerate
│       ├── api.js
│       └── index.js
│
├── shared/                     # 여러 feature에서 공통으로 사용하는 코드
│   ├── components/
│   │   ├── Modal/
│   │   ├── BottomSheet/        # 더보기(⋮) 바텀시트 모달
│   │   ├── Banner/             # 메인 피드 배너
│   │   ├── Pagination/
│   │   ├── LikeButton/         # 좋아요 버튼 (하트 토글)
│   │   ├── Header/
│   │   └── Layout/
│   ├── hooks/                  # usePagination, useModal 등
│   └── utils/                  # validators.js, formatters.js
│
├── constants/                  # 고정 데이터
│   ├── regions.js              # 선호 지역 목록
│   ├── tags.js                 # 관심 태그 (Python, JS, React 등)
│   ├── subjects.js             # 주제 (개념학습, 프로젝트, 챌린지 등)
│   └── difficulty.js          # 난이도 (초급 / 중급 / 고급)
│
├── pages/                      # 라우팅 단위 페이지
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── StudyDetailPage.jsx
│   ├── StudyCreatePage.jsx
│   ├── StudyEditPage.jsx
│   └── ProfilePage.jsx
│
├── stores/                     # 전역 상태 (auth 토큰, 유저 정보 등)
└── styles/
    ├── global.css
    └── variables.css
```

### 컴포넌트 계층 원칙

| 폴더 | 기준 | 예시 |
|---|---|---|
| `atoms/` | 더 이상 쪼갤 수 없는 기본 단위, 비즈니스 로직 없음 | Button, Input, Badge, Avatar |
| `shared/components/` | 여러 feature에서 재사용, atoms보다 복합적 | Modal, Banner, Pagination, Header |
| `features/*/components/` | 특정 도메인에 종속된 컴포넌트 | StudyCard, LoginForm, CommentList |

**의존 방향:** `atoms` ← `shared` ← `features` ← `pages` (단방향)

## 시작하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint
```

## 회원 등급

| 등급 | 조건 | 가능한 기능 |
|---|---|---|
| 준회원 | 회원가입 직후 | 스터디 조회만 가능 |
| 정회원 | 프로필 설정 완료 | 스터디 생성, 참가, 댓글 작성 가능 |

## 인증 방식

- JWT 기반 인증
- `access_token`: 1시간 유효
- `refresh_token`: 7시간 유효
- 이메일 인증 코드는 `123456` 고정 (실제 발송 없음)
