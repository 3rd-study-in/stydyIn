import { useState, useEffect } from 'react';
import { getStudyDetail } from '../api';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

/**
 * API 날짜 문자열 → "2022. 03. 29(화)" 형식으로 변환
 */
function formatStartDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1];
  return `${year}. ${month}. ${day}(${dayName})`;
}

/**
 * "HH:MM:SS" → "HH:MM" 형식으로 변환
 */
function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

/**
 * 스터디 기간/총 회차/총 시간 계산
 * @param {number} term        - 주 수
 * @param {number} daysPerWeek - 주당 진행 요일 수
 * @param {string} startTime   - "HH:MM:SS"
 * @param {string} endTime     - "HH:MM:SS"
 */
function formatDuration(term, daysPerWeek, startTime, endTime) {
  if (!term) return '';
  const totalSessions = term * daysPerWeek;

  let totalHours = '';
  if (startTime && endTime) {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const hoursPerSession = (eh * 60 + em - (sh * 60 + sm)) / 60;
    totalHours = Math.round(hoursPerSession * totalSessions);
  }

  return `${term}주/총 ${totalSessions}회${totalHours ? ` ${totalHours}시간` : ''}`;
}

/**
 * 스터디 상세 정보를 가져와 StudyStateCard에 맞는 형태로 변환하는 훅 (2.2)
 *
 * @param {number|string} studyPk
 * @returns {{
 *   study,          // 원본 API 응답
 *   cardProps,      // StudyStateCard에 바로 넣을 수 있는 props
 *   isLoading,
 *   error,
 *   refetch
 * }}
 */
function useStudyDetail(studyPk) {
  const [study, setStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    if (!studyPk) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getStudyDetail(studyPk);
      const data = await res.json();
      if (res.ok) {
        setStudy(data);
      } else {
        setError(data.detail ?? '스터디 정보를 불러오지 못했습니다.');
      }
    } catch {
      setError('서버 연결 오류');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyPk]);

  // StudyStateCard props로 변환
  const cardProps = study
    ? {
        status: study.study_status?.name === '모집 중' ? 'recruiting' : 'closed',
        selectedDays: (study.study_day ?? []).map((d) => d.name),
        startDate: formatStartDate(study.start_date),
        startTime: formatTime(study.start_time),
        endTime: formatTime(study.end_time),
        duration: formatDuration(
          study.term,
          (study.study_day ?? []).length,
          study.start_time,
          study.end_time,
        ),
        currentCount: (study.participants ?? []).length,
        maxCount: study.recruitment,
      }
    : null;

  return { study, cardProps, isLoading, error, refetch: fetchDetail };
}

export default useStudyDetail;

// ── 사용 예시 ──────────────────────────────────────────────────────────────────
// import useStudyDetail from '@/features/study/hooks/useStudyDetail'
// import StudyStateCard from '@/shared/components/Cards/StudyStateCard'
//
// function StudyDetailPage({ studyId }) {
//   const { cardProps, isLoading, error } = useStudyDetail(studyId)
//
//   if (isLoading) return <p>로딩 중...</p>
//   if (error) return <p>{error}</p>
//   if (!cardProps) return null
//
//   return <StudyStateCard {...cardProps} onParticipate={...} onShare={...} onLike={...} />
// }
