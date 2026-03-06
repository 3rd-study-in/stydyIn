import { create } from 'zustand';

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const isExpired = (token) => {
  const p = decodeJwt(token);
  return !p?.exp || p.exp < Date.now() / 1000;
};

const useAuthStore = create((set, get) => ({
  accessToken: null,
  refreshToken: null,
  email: null,
  userId: null,
  uid: null,
  isLoggedIn: false,

  // 앱 초기화 시 1회 호출 — JWT exp 체크로 로그인 상태 복원
  initAuth: () => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');
    const uid = localStorage.getItem('uid');

    if (access && !isExpired(access)) {
      set({
        accessToken: access,
        refreshToken: refresh,
        email,
        userId: userId ? Number(userId) : null,
        uid,
        isLoggedIn: true,
      });
    } else {
      // 만료 → 정리 (refresh 갱신 API 생기면 여기서 호출)
      get().logout();
    }
  },

  // 로그인 성공 후 토큰 저장 — user: { pk, email, uid }
  setTokens: (accessToken, refreshToken, user) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    if (user?.email) localStorage.setItem('email', user.email);
    if (user?.pk) localStorage.setItem('userId', String(user.pk));
    if (user?.uid) localStorage.setItem('uid', user.uid);
    set({
      accessToken,
      refreshToken,
      email: user?.email ?? null,
      userId: user?.pk ?? null,
      uid: user?.uid ?? null,
      isLoggedIn: true,
    });
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('uid');
    set({ accessToken: null, refreshToken: null, email: null, userId: null, uid: null, isLoggedIn: false });
  },
}));

export default useAuthStore;
