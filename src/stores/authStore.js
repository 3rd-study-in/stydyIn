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
  isLoggedIn: false,

  // 앱 초기화 시 1회 호출 — JWT exp 체크로 로그인 상태 복원
  initAuth: () => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const email = localStorage.getItem('email');

    if (access && !isExpired(access)) {
      set({ accessToken: access, refreshToken: refresh, email, isLoggedIn: true });
    } else {
      // 만료 → 정리 (refresh 갱신 API 생기면 여기서 호출)
      get().logout();
    }
  },

  // 로그인 성공 후 토큰 저장
  setTokens: (accessToken, refreshToken, email) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    if (email) localStorage.setItem('email', email);
    set({ accessToken, refreshToken, email, isLoggedIn: true });
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
    set({ accessToken: null, refreshToken: null, email: null, isLoggedIn: false });
  },
}));

export default useAuthStore;
