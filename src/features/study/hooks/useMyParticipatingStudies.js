import { useState, useEffect } from 'react';
import { getMyParticipatingStudies } from '../api';
import useAuthStore from '../../../stores/authStore';

/**
 * 내가 참여 중인 스터디 목록을 가져오는 훅 (2.17)
 * StudySideList 컴포넌트에 바로 넘길 수 있는 studies 배열을 반환합니다.
 *
 * @returns {{ studies, isLoading, error, refetch }}
 *
 * @example
 * const { studies, isLoading } = useMyParticipatingStudies()
 * <StudySideList studies={studies} />
 */
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
      const res = await getMyParticipatingStudies(accessToken);
      const data = await res.json();
      if (res.ok) {
        setStudies(data);
      } else {
        setError(data.detail ?? '참여 중인 스터디를 불러오지 못했습니다.');
      }
    } catch {
      setError('서버 연결 오류');
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
