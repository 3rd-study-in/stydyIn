import { useState, useEffect } from 'react';
import { getMyParticipatingStudies } from '../api';
import useAuthStore from '../../../stores/authStore';

function useMyParticipatingStudies() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [studies, setStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudies = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getMyParticipatingStudies();
      setStudies(data);
    } catch (err) {
      setError(err.response?.data?.detail ?? '참여 중인 스터디를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return { studies, isLoading, error, refetch: fetchStudies };
}

export default useMyParticipatingStudies;
