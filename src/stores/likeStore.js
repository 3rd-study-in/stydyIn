import { create } from 'zustand';
import { likeStudy, unlikeStudy } from '../features/study/api';

const DEBOUNCE_MS = 400;
const pendingTimers = {};

const useLikeStore = create((set, get) => ({
  likedMap: {},

  // 스터디 목록 batch 초기화 — pending 중인 항목은 보존
  initLikes: (studies) => {
    const current = get().likedMap;
    const next = { ...current };
    studies.forEach((s) => {
      if (!(s.id in pendingTimers)) next[s.id] = !!s.user_liked;
    });
    set({ likedMap: next });
  },

  // 디테일 페이지 단일 초기화 — pending 중이면 무시
  initOneLike: (studyId, liked) => {
    if (studyId in pendingTimers) return;
    set((state) => ({ likedMap: { ...state.likedMap, [studyId]: !!liked } }));
  },

  // 토글 — UI 즉시 반영, API는 debounce 후 1회만 전송
  toggleLike: (studyId, isLoggedIn, navigate) => {
    if (!isLoggedIn) {
      navigate?.('/login');
      return;
    }

    const currentLiked = !!get().likedMap[studyId];
    const newLiked = !currentLiked;

    set((state) => ({ likedMap: { ...state.likedMap, [studyId]: newLiked } }));

    if (!pendingTimers[studyId]) {
      pendingTimers[studyId] = { originalLiked: currentLiked };
    }
    pendingTimers[studyId].targetLiked = newLiked;

    clearTimeout(pendingTimers[studyId].timer);
    pendingTimers[studyId].timer = setTimeout(async () => {
      const { originalLiked, targetLiked } = pendingTimers[studyId];
      delete pendingTimers[studyId];

      if (originalLiked === targetLiked) return;

      try {
        if (targetLiked) await likeStudy(studyId);
        else await unlikeStudy(studyId);
      } catch {
        set((state) => ({
          likedMap: { ...state.likedMap, [studyId]: originalLiked },
        }));
      }
    }, DEBOUNCE_MS);
  },
}));

export default useLikeStore;
