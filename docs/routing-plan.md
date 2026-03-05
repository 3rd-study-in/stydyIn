# React Router v7 라우팅 구조 계획

## 이 구조를 선택한 이유

### 1. GNB / GNBLogin 두 가지 헤더 존재

- 로그인 여부에 따라 헤더가 달라짐 (`GNB` ↔ `GNBLogin`)
- 레이아웃을 `PublicLayout` / `PrivateLayout`으로 분리하면 조건 분기 없이 자연스럽게 처리 가능

### 2. 인증 가드 일원화

- 보호 라우트마다 개별적으로 인증 체크하지 않고 `PrivateLayout` 하나에서 처리
- `authStore`의 `isLoggedIn`을 한 곳에서 확인 → 미인증 시 `Navigate`로 `/login` 리다이렉트

### 3. Header / Footer 중복 제거

- Flat 방식은 모든 라우트에 Header, Footer 반복 작성 필요
- Nested Layout(중첩 레이아웃) 방식으로 한 번만 선언 → `<Outlet />`으로 자식 페이지 렌더링

### 4. 프로젝트 규모에 적합

- 총 7개 페이지 수준 → `routes.jsx` 파일 별도 분리는 과한 분리
- `App.jsx` 안에서 레이아웃 컴포넌트 + `createBrowserRouter`로 충분

---

## 레이아웃 구분

| 레이아웃        | 헤더       | 인증 필요 | 해당 페이지                                                            |
| --------------- | ---------- | --------- | ---------------------------------------------------------------------- |
| `PublicLayout`  | `GNBLogin` | X         | LoginPage, SignupPage                                                  |
| `PrivateLayout` | `GNB`      | O         | HomePage, StudyDetailPage, StudyCreatePage, StudyEditPage, ProfilePage |

---

## 라우트 경로 정의

| path                   | element           | layout          |
| ---------------------- | ----------------- | --------------- |
| `/login`               | `LoginPage`       | `PublicLayout`  |
| `/signup`              | `SignupPage`      | `PublicLayout`  |
| `/`                    | `HomePage`        | `PrivateLayout` |
| `/study/create`        | `StudyCreatePage` | `PrivateLayout` |
| `/study/:studyId`      | `StudyDetailPage` | `PrivateLayout` |
| `/study/:studyId/edit` | `StudyEditPage`   | `PrivateLayout` |
| `/profile/:userId`     | `ProfilePage`     | `PrivateLayout` |

---

---

## 주의사항

- `/study/create`는 `/study/:studyId`보다 **위에 선언**해야 함 → 아니면 `create`가 `studyId` 파라미터로 매칭됨
- `PrivateLayout`의 `isLoggedIn` 체크는 `main.jsx`에서 `initAuth()`가 먼저 실행되므로 정확히 동작함
- 준회원(`isProfileComplete=false`) 분기는 라우터 단이 아닌 **각 페이지 내부** 또는 별도 가드 컴포넌트에서 처리

---
