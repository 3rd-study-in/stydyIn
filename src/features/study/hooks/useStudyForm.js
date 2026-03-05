import { useState } from 'react';
import { createStudy, updateStudy } from '../api';
import useAuthStore from '../../../stores/authStore';

const INITIAL_FORM = {
  title: '',
  thumbnail: '',
  is_offline: false,
  study_location: null, // { id } — 오프라인일 때 필수
  recruitment: '',
  study_info: '',
  study_day: [],        // [{ id, name }]
  start_date: '',
  term: '',
  start_time: '',
  end_time: '',
  difficulty: null,     // { id, name }
  subject: null,        // { id, name }
  search_tag: [],       // [{ name }]
};

/**
 * 스터디 생성/수정 폼 상태와 제출 로직을 관리하는 훅 (2.3 / 2.4)
 *
 * @param {{ mode?: 'create'|'edit', studyPk?: number, initialData?: object }} [options]
 * @returns {{ form, setField, toggleDay, isValid, isLoading, error, handleSubmit }}
 */
function useStudyForm({ mode = 'create', studyPk, initialData } = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);

  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title ?? '',
          thumbnail: initialData.thumbnail ?? '',
          is_offline: initialData.is_offline ?? false,
          study_location: initialData.study_location ?? null,
          recruitment: initialData.recruitment ?? '',
          study_info: initialData.study_info ?? '',
          study_day: initialData.study_day ?? [],
          start_date: initialData.start_date ?? '',
          term: initialData.term ?? '',
          start_time: initialData.start_time ?? '',
          end_time: initialData.end_time ?? '',
          difficulty: initialData.difficulty ?? null,
          subject: initialData.subject ?? null,
          search_tag: initialData.search_tag ?? [],
        }
      : INITIAL_FORM,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 단일 필드 업데이트 */
  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  /** 요일 토글: { id, name } 객체를 넣으면 있으면 제거, 없으면 추가 */
  const toggleDay = (day) =>
    setForm((prev) => {
      const exists = prev.study_day.some((d) => d.id === day.id);
      return {
        ...prev,
        study_day: exists
          ? prev.study_day.filter((d) => d.id !== day.id)
          : [...prev.study_day, day],
      };
    });

  /** 필수 필드 모두 채워졌는지 */
  const isValid =
    !!form.title &&
    !!form.thumbnail &&
    form.recruitment >= 3 &&
    form.study_day.length > 0 &&
    !!form.start_date &&
    !!form.term &&
    !!form.start_time &&
    !!form.end_time &&
    !!form.difficulty &&
    !!form.subject &&
    form.search_tag.length > 0 &&
    (!form.is_offline || !!form.study_location);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);
    setError(null);

    const body = {
      ...form,
      recruitment: Number(form.recruitment),
      term: Number(form.term),
    };

    try {
      const res =
        mode === 'edit'
          ? await updateStudy(studyPk, body, accessToken)
          : await createStudy(body, accessToken);

      const data = await res.json();

      if (res.ok) {
        return { ok: true, data };
      }

      const message =
        data.validationError ?? data.detail ?? '스터디 저장에 실패했습니다.';
      setError(message);
      return { ok: false, message };
    } catch {
      setError('서버 연결 오류');
      return { ok: false, message: '서버 연결 오류' };
    } finally {
      setIsLoading(false);
    }
  };

  return { form, setField, toggleDay, isValid, isLoading, error, handleSubmit };
}

export default useStudyForm;
