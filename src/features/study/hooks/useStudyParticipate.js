import { useState } from 'react';
import { joinStudy, leaveStudy } from '../api';
import useAuthStore from '../../../stores/authStore';

/**
 * 스터디 참가/탈퇴를 처리하는 훅 (2.7 / 2.8)
 *
 * @param {number|string} studyPk
 * @param {{ onSuccess?: () => void }} [options]  - 성공 후 콜백 (예: 상세 refetch)
 * @returns {{ isLoading, error, handleJoin, handleLeave }}
 */
function useStudyParticipate(studyPk, { onSuccess } = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (apiFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFn(studyPk, accessToken);
      const data = await res.json();
      if (res.ok) {
        onSuccess?.();
        return { ok: true, message: data.detail };
      }
      const message = data.error ?? data.detail ?? '요청에 실패했습니다.';
      setError(message);
      return { ok: false, message };
    } catch {
      setError('서버 연결 오류');
      return { ok: false, message: '서버 연결 오류' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = () => request(joinStudy);
  const handleLeave = () => request(leaveStudy);

  return { isLoading, error, handleJoin, handleLeave };
}

export default useStudyParticipate;
