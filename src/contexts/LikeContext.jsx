import { createContext, useContext, useRef, useState } from 'react';
import { likeStudy, unlikeStudy } from '../features/study/api';

const LikeContext = createContext(null);
const DEBOUNCE_MS = 800;

export function LikeProvider({ children }) {
  const [likedMap, setLikedMap] = useState({});
  const pendingRef = useRef({});

  // 스터디 목록 batch 초기화 — pending 중인 항목은 덮어쓰지 않음
  function initLikes(studies) {
    setLikedMap((prev) => {
      const next = { ...prev };
      studies.forEach((s) => {
        if (!(s.id in pendingRef.current)) next[s.id] = !!s.user_liked;
      });
      return next;
    });
  }

  // 디테일 페이지 단일 초기화 — pending 중이면 무시
  function initOneLike(studyId, liked) {
    if (studyId in pendingRef.current) return;
    setLikedMap((prev) => ({ ...prev, [studyId]: !!liked }));
  }

  // 토글 — UI 즉시 반영, API는 debounce 후 1회만 전송
  function toggleLike(studyId, isLoggedIn, navigate) {
    if (!isLoggedIn) {
      navigate?.('/login');
      return;
    }

    setLikedMap((prev) => {
      const newLiked = !prev[studyId];

      if (!pendingRef.current[studyId]) {
        pendingRef.current[studyId] = { originalLiked: !!prev[studyId] };
      }
      pendingRef.current[studyId].targetLiked = newLiked;

      clearTimeout(pendingRef.current[studyId].timer);
      pendingRef.current[studyId].timer = setTimeout(async () => {
        const { originalLiked, targetLiked } = pendingRef.current[studyId];
        delete pendingRef.current[studyId];

        if (originalLiked === targetLiked) return;

        try {
          if (targetLiked) await likeStudy(studyId);
          else await unlikeStudy(studyId);
        } catch {
          setLikedMap((p) => ({ ...p, [studyId]: originalLiked }));
        }
      }, DEBOUNCE_MS);

      return { ...prev, [studyId]: newLiked };
    });
  }

  return (
    <LikeContext.Provider value={{ likedMap, initLikes, initOneLike, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  return useContext(LikeContext);
}
