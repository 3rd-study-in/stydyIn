# 이거 사용법

Auth + Notification Zustand 스토어, GNB, NotificationItem, axiosInstance 사용 가이드.

---

## authStore — 인증 상태 관리

**파일**: `src/stores/authStore.js`

```js
import useAuthStore from '@/stores/authStore'

// 컴포넌트에서 구독 (selector로 개별 구독 — zustand/no-destructure 규칙 준수)
const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
const email      = useAuthStore((s) => s.email)

// 액션 — 훅(hook) 내부에서
const setTokens = useAuthStore((s) => s.setTokens)
setTokens(access_token, refresh_token, email)  // 로그인 성공 후 호출

// 액션 — 컴포넌트 외부 / 일반 함수에서 (getState 사용)
useAuthStore.getState().initAuth()   // main.jsx 앱 시작 시 1회 호출
useAuthStore.getState().logout()     // 로그아웃 처리
const { accessToken, email } = useAuthStore.getState()  // 일반 함수 내 읽기
```

### 상태 목록

| 상태 | 타입 | 설명 |
|------|------|------|
| `accessToken` | `string \| null` | 현재 JWT access token |
| `refreshToken` | `string \| null` | 현재 JWT refresh token |
| `email` | `string \| null` | 로그인한 사용자 이메일 |
| `isLoggedIn` | `boolean` | 토큰 유효 여부 |

### 액션 목록

| 액션 | 설명 |
|------|------|
| `initAuth()` | 앱 시작 시 localStorage에서 토큰 읽어 JWT exp 체크 → 유효하면 로그인 상태 복원 |
| `setTokens(access, refresh, email)` | 로그인 성공 후 store + localStorage 동기 저장 |
| `logout()` | store 초기화 + localStorage 제거 |

---

## notificationStore — 알림 상태 관리

**파일**: `src/stores/notificationStore.js`

```js
import useNotificationStore from '@/stores/notificationStore'

// 컴포넌트에서 구독
const notifications      = useNotificationStore((s) => s.notifications)
const hasUnread          = useNotificationStore((s) => s.hasUnread)
const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
const markAllRead        = useNotificationStore((s) => s.markAllRead)
const deleteOne          = useNotificationStore((s) => s.deleteOne)

// 사용 예시
fetchNotifications()             // GET /notifications/ 호출 (GNB에서 30초 폴링)
markAllRead()                    // PUT /notifications/ 호출 (알림 탭 열릴 때)
deleteOne(notification_id)       // DELETE /notifications/<id>/ 호출 (X 버튼)
```

### 상태 목록

| 상태 | 타입 | 설명 |
|------|------|------|
| `notifications` | `array` | 알림 배열 (`notification_id`, `content`, `created`, `checked` 등) |
| `hasUnread` | `boolean` | 새 알림 존재 여부 (GNB 빨간 점 기준) |
| `prevIds` | `Set` | 이전에 확인한 알림 id 집합 (새 데이터 비교용) |

### 알림 응답 필드

| 필드 | 설명 |
|------|------|
| `notification_id` | 알림 고유 id |
| `notification_type` | `PARTICIPATION` / `COMMENT` / `RECOMMENT` |
| `content` | 알림 텍스트 |
| `created` | 생성 시각 |
| `checked` | 읽음 여부 (`false` → 빨간 점 표시) |
| `acted_user_id` | 액션을 취한 사용자 id |
| `study_id` | 관련 스터디 id |
| `comment_id` | 관련 댓글 id |

---

## GNB — 자동 동작

**파일**: `src/shared/components/Header/GNB.jsx`

```jsx
// 그냥 놓으면 됨 — isLoggedIn 내부에서 authStore 구독, 폴링도 자동
<GNB />

// profileSrc가 필요하면 prop으로 전달
<GNB profileSrc={user.profileImageUrl} />
```

### 동작 흐름

- `isLoggedIn` **true** → `LoggedInActions` 렌더링
  - 마운트 시 `fetchNotifications()` 즉시 호출
  - 30초마다 자동 폴링
  - `hasUnread` true → 벨 아이콘 우하단 빨간 점 표시
- `isLoggedIn` **false** → "시작하기" 버튼만 표시

---

## NotificationItem — 알림 항목 컴포넌트

**파일**: `src/atoms/NotificationItem/NotificationItem.jsx`

```jsx
import NotificationItem from '@/atoms/NotificationItem/NotificationItem'

<ul>
  {notifications.map((n) => (
    <NotificationItem
      key={n.notification_id}
      text={n.content}               // 알림 텍스트
      time={n.created}               // 시간 표시
      checked={n.checked}            // false → 좌상단 빨간 점 표시
      onClose={() => deleteOne(n.notification_id)}  // X 버튼 핸들러
    />
  ))}
</ul>
```

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `text` | `string` | — | 알림 내용 |
| `time` | `string` | — | 시간 표시 (예: "방금", "1시간 전") |
| `checked` | `boolean` | `true` | false이면 좌상단에 빨간 점 표시 |
| `onClose` | `function` | — | X 버튼 클릭 핸들러 |

---

## axiosInstance — 인증 헤더 자동 주입

**파일**: `src/lib/axiosInstance.js`

```js
import axiosInstance from '@/lib/axiosInstance'

// 모든 요청에 Authorization: Bearer <token> 자동 포함
// 별도 헤더 설정 불필요
const { data } = await axiosInstance.get('/notifications/')
await axiosInstance.put('/notifications/')
await axiosInstance.delete(`/notifications/${id}/`)
```

- `authStore.accessToken`을 request 인터셉터에서 읽어 자동 주입
- 토큰이 없으면 Authorization 헤더 미포함 (로그인 전 상태)
- axios 특성상 응답은 `{ data }` 구조로 바로 접근

---

## ESLint 규칙 — zustand/no-destructure

```js
// ❌ 구조분해 금지 (eslint 에러)
const { notifications, hasUnread } = useNotificationStore()

// ✅ selector 함수로 개별 구독
const notifications = useNotificationStore((s) => s.notifications)
const hasUnread     = useNotificationStore((s) => s.hasUnread)

// ✅ 컴포넌트 외부(일반 함수)에서는 getState() 사용 가능
const { accessToken } = useAuthStore.getState()
```
