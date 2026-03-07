import { useState, useEffect } from 'react';
import { getStudyList } from '../api';

/**
 * 스터디 목록을 가져오는 훅 (2.1)
 *
 * @param {{ page?: number, limit?: number, skip?: number }} [params]
 * @returns {{ studies, count, next, previous, isLoading, error, refetch }}
 */
function useStudyList(params = {}) {
  const [studies, setStudies] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getStudyList(params);
      setStudies(data.results ?? []);
      setCount(data.count ?? 0);
      setNext(data.next ?? null);
      setPrevious(data.previous ?? null);
    } catch (err) {
      setError(err.response?.data?.detail ?? '스터디 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.skip]);

  return { studies, count, next, previous, isLoading, error, refetch: fetchStudies };
}

export default useStudyList;
