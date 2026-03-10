# Like(하트) 기능 설계 문서

## 배경

### 초기 상태
- `StudyListCard`와 `StudyDetailPage` 각각 로컬 `useState`로 like 상태 관리
- 두 페이지 간 상태 공유 없음 → 리스트에서 좋아요 누르고 디테일 이동 시 상태 불일치
- API 엔드포인트(`likeStudy`, `unlikeStudy`)는 `src/features/study/api.js`에 존재했으나 미호출

### CLAUDE.md 명세
> "필수 과제에서는 좋아요 기능은 구현하지 않습니다. 버튼의 변화만 구현하세요."

필수 최소 요건은 버튼 UI 토글이지만, 페이지 간 상태 공유와 실제 API 연동까지 구현하기로 결정.

---

## 요구사항 도출 (대화 과정)

### 1차 요청
> "스터디카드에 하트를 누르면 하트가 반영이 되어야 하는게 기능적으로 구현되어있는지 확인하고 이하트가 스터디 디테일페이지에서도 고정적으로 구현되어있는지 확인 필요해 (스터디카드와 디테일의 하트가 정보가 공유되어야하니까 컨텍스트를 활용하면 될듯)"

→ React Context로 두 페이지 간 like 상태 공유 결정.

### 2차 요구사항: API 호출 방식
> "이거 api를 바로바로 불러버리는거임? 클라이언트는 클릭할때마다 api전송을 해버릴거고 그러면 이거 api 낭비 심하다고 생각함. 그래서 클라이언트는 모르게 하트 누르고 뒤로가든 딴짓을하든 상관없이 ui로는 반영된거처럼 보이지만 서버에 보내는거는 하트 누르고 조금 이따 반영하는 방식이 좋을거같음"

→ **Debounced API 패턴** 도입 결정.

---

## 설계 결정

### Debounced API + Optimistic Update

| 항목 | 내용 |
|------|------|
| UI 반영 | 클릭 즉시 (optimistic update) |
| API 전송 | 마지막 클릭 후 **800ms 뒤** 1회만 |
| 연속 클릭 | 짝수 번 클릭 시 net 변화 없음 → API 미전송 |
| API 실패 | 원래 상태로 UI 롤백 |

### pendingRef 구조

```
pendingRef.current[studyId] = {
  originalLiked: boolean,  // API가 마지막으로 아는 상태
  targetLiked: boolean,    // 현재 UI 상태 (클릭마다 갱신)
  timer: TimeoutId,        // debounce 타이머
}
```

타이머 발동 시:
- `originalLiked === targetLiked` → 변화 없음, API 미전송
- `originalLiked !== targetLiked` → API 1회 전송 (POST 또는 DELETE)

---

## 구현 구조

### 파일 구성

```
src/
  contexts/
    LikeContext.jsx       ← LikeProvider, useLike hook
  pages/
    HomePage.jsx          ← initLikes(), toggleLike() 연결
    StudyDetailPage.jsx   ← initOneLike(), toggleLike() 연결
  App.jsx                 ← GeneralLayout, PrivateLayout에 LikeProvider 감싸기
```

### LikeContext API

| 함수 | 설명 |
|------|------|
| `initLikes(studies)` | 스터디 목록 fetch 완료 후 batch 초기화. pending 중인 항목 보존 |
| `initOneLike(studyId, liked)` | 디테일 페이지 로드 시 단일 초기화. pending 중이면 무시 |
| `toggleLike(studyId, isLoggedIn, navigate)` | UI 즉시 토글 + debounced API |
| `likedMap` | `{ [studyId]: boolean }` — 현재 UI like 상태 |

### 상태 초기화 흐름

```
HomePage 스터디 목록 fetch 완료
  └─ initLikes(filtered)
       └─ study.user_liked 기반으로 likedMap 초기화
            └─ pending 중인 항목은 덮어쓰지 않음

StudyDetailPage 스터디 fetch 완료
  └─ useEffect: initOneLike(study.id, study.user_liked)
       └─ pending 중이면 무시 (리스트에서 누른 상태 유지)
```

---

## 동작 시나리오

### 정상 케이스
1. 홈 카드에서 하트 클릭 → 즉시 UI 반영
2. 800ms 뒤 API 전송 (서버 반영)
3. 해당 스터디 디테일로 이동 → 같은 like 상태 표시
4. 디테일에서 하트 클릭 → 즉시 UI 반영 + debounce API
5. 뒤로가기 → 카드도 동일 상태

### 연속 클릭 케이스
1. 하트 3번 클릭 (OFF→ON→OFF→ON)
2. 마지막 클릭 후 800ms 뒤 `originalLiked(false) !== targetLiked(true)` → API 1회 전송

### 짝수 클릭 케이스
1. 하트 2번 클릭 (OFF→ON→OFF)
2. `originalLiked(false) === targetLiked(false)` → API 미전송

### 비로그인 케이스
1. 하트 클릭 → `/login`으로 이동
