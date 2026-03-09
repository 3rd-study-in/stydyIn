# useLocation & location.key를 이용한 페이지 재진입 감지

## 발생한 문제

스터디를 생성한 뒤 홈으로 돌아왔을 때, 방금 만든 스터디가 목록에 바로 나타나지 않는 문제가 있었다.

**재현 흐름:**
1. 홈(`/?tab=latest`) → 스터디 만들기 클릭
2. 스터디 생성 완료 → `/study/{id}` (상세 페이지) 로 이동
3. 뒤로가기 또는 헤더 로고 클릭 → 홈(`/?tab=latest`) 복귀
4. **목록이 갱신되지 않음** — 새 스터디가 보이지 않음

---

## 원인 분석

`HomePage`에서 스터디 목록을 가져오는 `useEffect`의 의존성 배열이 `[activeTab]` 하나뿐이었다.

```js
// 수정 전
useEffect(() => {
  setCurrentPage(1);
  setAllStudies([]);
}, [activeTab]);

useEffect(() => {
  setLoading(true);
  getStudyList(params).then(res => setAllStudies(res.data.results));
}, [activeTab]); // ← activeTab이 바뀌지 않으면 재실행 안 됨
```

홈에서 다른 페이지로 갔다가 **같은 탭(`latest`)으로 복귀**하면
`activeTab` 값이 변하지 않으므로 `useEffect`가 재실행되지 않는다.
결과적으로 컴포넌트는 기존에 저장된 `allStudies` 상태를 그대로 표시한다.

---

## 해결책: `useLocation`의 `location.key` 활용

### `useLocation()`이란?

React Router v6에서 제공하는 훅으로, **현재 URL과 관련된 다양한 정보**를 담은 객체를 반환한다.

```js
import { useLocation } from 'react-router-dom';

const location = useLocation();
// {
//   pathname: '/',
//   search: '?tab=latest',
//   hash: '',
//   state: null,
//   key: 'abc123'   ← 이게 핵심
// }
```

---

### `location.key`란?

React Router가 **페이지 이동(navigation)마다 자동으로 생성하는 고유 식별자**다.

| 상황 | location.key 변화 |
|---|---|
| 같은 페이지에서 탭 클릭 (`navigate('/?tab=recruiting')`) | 새 key 생성 |
| 다른 페이지 이동 후 뒤로가기 | 새 key 생성 |
| 브라우저 새로고침 | `'default'` 로 초기화 |

즉, **사용자가 어디서 어떻게 오든 홈에 진입할 때마다 반드시 새로운 key가 할당된다.**

---

### 이걸 선택한 이유

| 방법 | 장점 | 단점 |
|---|---|---|
| `location.key`를 deps에 추가 | 별도 라이브러리 없음, 코드 변경 최소화 | — |
| React Query (`useQuery`) | 캐시 무효화, refetch-on-focus 등 강력한 기능 | 라이브러리 추가 필요, 마이그레이션 비용 |
| Zustand 전역 상태로 refetch 트리거 관리 | 정밀한 제어 가능 | 보일러플레이트 증가 |
| `navigate('/?tab=latest')` 후 강제 리로드 | 단순 | UX 나쁨 (깜빡임), 뒤로가기 히스토리 오염 |

현재 프로젝트에는 React Query나 SWR이 없고, 수정 범위를 최소화하는 것이 우선이었기 때문에 `location.key`를 선택했다.

---

## 수정 내용

### 변경 전

```js
// 두 개의 분리된 useEffect
useEffect(() => {
  setCurrentPage(1);
  setAllStudies([]);
}, [activeTab]);

useEffect(() => {
  setLoading(true);
  const params = {};
  if (activeTab === 'local') params.is_offline = 1;
  else if (activeTab === 'online') params.is_offline = 0;
  const statusFilter = STUDY_STATUS_FILTER[activeTab];
  getStudyList(params)
    .then((res) => {
      const all = res.data.results;
      setAllStudies(statusFilter ? all.filter(...) : all);
    })
    .catch(() => setAllStudies([]))
    .finally(() => setLoading(false));
}, [activeTab]);
```

### 변경 후

```js
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

// 컴포넌트 내부
const location = useLocation();

// 리셋 + fetch를 하나의 useEffect로 통합, location.key 의존성 추가
useEffect(() => {
  setCurrentPage(1);
  setAllStudies([]);
  setLoading(true);
  const params = {};
  if (activeTab === 'local') params.is_offline = 1;
  else if (activeTab === 'online') params.is_offline = 0;
  const statusFilter = STUDY_STATUS_FILTER[activeTab];
  getStudyList(params)
    .then((res) => {
      const all = res.data.results;
      setAllStudies(statusFilter ? all.filter(...) : all);
    })
    .catch(() => setAllStudies([]))
    .finally(() => setLoading(false));
}, [activeTab, location.key]); // ← location.key 추가
```

### 두 effect를 하나로 합친 이유

기존에 리셋 effect와 fetch effect가 분리되어 있었는데, 이 둘은 항상 함께 실행되어야 하는 로직이다.

- 리셋만 하고 fetch를 안 하면 빈 화면이 남는다
- fetch만 하고 리셋을 안 하면 페이지 번호가 유지된 채로 데이터가 바뀐다

React 공식 문서에서도 *"같은 이유로 실행되는 로직은 하나의 Effect에 두어라"* 라고 권장한다.
`location.key`를 두 effect에 각각 추가하면 실행 순서가 보장되지 않아 잠재적 버그가 생길 수 있으므로, 통합이 올바른 방법이다.

---

## 수정 파일

- `src/pages/HomePage.jsx`
