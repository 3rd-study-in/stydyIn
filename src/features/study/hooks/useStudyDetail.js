import { useState, useEffect } from 'react';
import { getStudyDetail } from '../api';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

function formatStartDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1];
  return `${year}. ${month}. ${day}(${dayName})`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

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

function useStudyDetail(studyPk) {
  const [study, setStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    if (!studyPk) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getStudyDetail(studyPk);
      setStudy(data);
    } catch (err) {
      setError(err.response?.data?.detail ?? '스터디 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyPk]);

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
