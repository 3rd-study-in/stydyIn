import { useState } from 'react';
import { joinStudy, leaveStudy } from '../api';

function useStudyParticipate(studyPk, { onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (apiFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiFn(studyPk);
      onSuccess?.();
      return { ok: true, message: data.detail };
    } catch (err) {
      const data = err.response?.data;
      const message = data?.error ?? data?.detail ?? '요청에 실패했습니다.';
      setError(message);
      return { ok: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = () => request(joinStudy);
  const handleLeave = () => request(leaveStudy);

  return { isLoading, error, handleJoin, handleLeave };
}

export default useStudyParticipate;
