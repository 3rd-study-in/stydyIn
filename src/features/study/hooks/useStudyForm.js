import { useState } from 'react';
import { createStudy, updateStudy } from '../api';

const INITIAL_FORM = {
  title: '',
  thumbnail: '',
  is_offline: false,
  study_location: null,
  recruitment: '',
  study_info: '',
  study_day: [],
  start_date: '',
  term: '',
  start_time: '',
  end_time: '',
  difficulty: null,
  subject: null,
  search_tag: [],
};

function useStudyForm({ mode = 'create', studyPk, initialData } = {}) {
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

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
      const { data } =
        mode === 'edit'
          ? await updateStudy(studyPk, body)
          : await createStudy(body);
      return { ok: true, data };
    } catch (err) {
      const data = err.response?.data;
      const message = data?.validationError ?? data?.detail ?? '스터디 저장에 실패했습니다.';
      setError(message);
      return { ok: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return { form, setField, toggleDay, isValid, isLoading, error, handleSubmit };
}

export default useStudyForm;
