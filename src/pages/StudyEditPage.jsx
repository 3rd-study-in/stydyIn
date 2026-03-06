import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useStudyDetail from '../features/study/hooks/useStudyDetail';
import useStudyForm from '../features/study/hooks/useStudyForm';
import {
  deleteStudy,
  getSubjects,
  getDifficulties,
} from '../features/study/api';
import useAuthStore from '../stores/authStore';
import InputBox from '../atoms/Input/InputBox';
import FlexibleButton from '../atoms/Button/FlexibleButton';

const DAYS = [
  { id: 1, name: '월' },
  { id: 2, name: '화' },
  { id: 3, name: '수' },
  { id: 4, name: '목' },
  { id: 5, name: '금' },
  { id: 6, name: '토' },
  { id: 7, name: '일' },
];

const TERM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const inputCls =
  'h-[40px] px-3 border border-border rounded-lg text-sm text-text outline-none focus:border-2 focus:border-info';
const textareaCls =
  'w-full border border-border rounded-lg p-4 text-base text-text placeholder:text-text-disabled outline-none resize-none focus:border-2 focus:border-info';
const chipBase =
  'px-4 h-[36px] rounded-full text-sm border transition-colors cursor-pointer';
const chipActive = 'bg-primary-dark text-white border-primary-dark';
const chipInactive = 'bg-white text-text border-border hover:bg-bg-muted';

// 폼을 study 데이터가 로드된 후 초기화하기 위해 내부 컴포넌트로 분리
function StudyEditForm({ study, studyId }) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { form, setField, toggleDay, isValid, isLoading, error, handleSubmit } =
    useStudyForm({
      mode: 'edit',
      studyPk: studyId,
      initialData: study,
    });

  const [subjects, setSubjects] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getSubjects()
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
    getDifficulties()
      .then((r) => r.json())
      .then(setDifficulties)
      .catch(() => {});
  }, []);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (form.search_tag.length >= 5) return;
      setField('search_tag')([...form.search_tag, { name: tagInput.trim() }]);
      setTagInput('');
    }
  };

  const removeTag = (idx) => {
    setField('search_tag')(form.search_tag.filter((_, i) => i !== idx));
  };

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (result?.ok) navigate(`/study/${studyId}`);
  };

  const onDelete = async () => {
    await deleteStudy(studyId, accessToken);
    navigate('/');
  };

  return (
    <div className="max-w-max-width-lg mx-auto px-5 py-10">
      {/* 상단 버튼 */}
      <div className="flex justify-end gap-2 mb-8">
        <FlexibleButton
          variant="lightgray"
          size="L"
          width="100px"
          onClick={() => setShowDeleteConfirm(true)}
        >
          삭제
        </FlexibleButton>
        <FlexibleButton
          variant="blue"
          size="L"
          width="150px"
          onClick={onSubmit}
          disabled={!isValid || isLoading}
        >
          저장하기
        </FlexibleButton>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 w-[320px]">
            <p className="text-base font-bold text-text">
              스터디를 삭제하시겠습니까?
            </p>
            <div className="flex gap-3 w-full">
              <FlexibleButton
                variant="lightgray"
                size="M"
                width="100%"
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </FlexibleButton>
              <FlexibleButton
                variant="blue"
                size="M"
                width="100%"
                onClick={onDelete}
              >
                삭제
              </FlexibleButton>
            </div>
          </div>
        </div>
      )}

      {/* 썸네일 + 기본 정보 */}
      <div className="flex gap-6 mb-10 border border-border rounded-xl p-6">
        {/* 썸네일 */}
        <div className="w-[290px] h-[290px] shrink-0 rounded-lg border border-border bg-bg-muted flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer">
          {form.thumbnail ? (
            <img
              src={form.thumbnail}
              className="w-full h-full object-cover"
              alt="썸네일"
            />
          ) : (
            <div className="text-center text-text-disabled text-sm">
              <p>대표 이미지 삽입</p>
              <p className="mt-1 text-xs">(권장 사이즈 1200*1200px)</p>
            </div>
          )}
        </div>

        {/* 오른쪽 입력 */}
        <div className="flex-1 flex flex-col gap-5 justify-center">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">
              스터디 제목 <span className="text-error">*</span>
            </label>
            <InputBox
              value={form.title}
              onChange={setField('title')}
              placeholder="스터디 제목 입력"
              maxLength={50}
              width="100%"
            />
          </div>

          {/* 유형 */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">
              스터디 유형 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={form.is_offline}
                  onChange={() => setField('is_offline')(true)}
                  className="accent-primary"
                />
                <span className="text-sm text-text">내 지역</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!form.is_offline}
                  onChange={() => setField('is_offline')(false)}
                  className="accent-primary"
                />
                <span className="text-sm text-text">온라인</span>
              </label>
            </div>
            {form.is_offline && (
              <p className="mt-1 text-xs text-text-muted">
                오프라인 지역을 선택해주세요.
              </p>
            )}
          </div>

          {/* 모집 인원 */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">
              모집 인원 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.recruitment}
                onChange={(e) => setField('recruitment')(e.target.value)}
                min={3}
                max={99}
                className={`w-[80px] ${inputCls}`}
              />
              <span className="text-sm text-text">명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 스터디 소개 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-text mb-4">스터디 소개</h2>
        <textarea
          value={form.study_info}
          onChange={(e) => setField('study_info')(e.target.value)}
          placeholder="스터디 소개를 입력해 주세요."
          maxLength={1000}
          rows={6}
          className={textareaCls}
        />
        <p className="text-right text-sm text-text-disabled mt-1">
          {form.study_info.length}/1000
        </p>
      </section>

      {/* 상세 일정 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-text mb-6">상세 일정</h2>
        <div className="flex flex-col gap-6">
          {/* 요일 */}
          <div className="flex items-center gap-4">
            <label className="w-[120px] text-sm text-text shrink-0">
              스터디 요일
            </label>
            <div className="flex gap-2">
              {DAYS.map((day) => {
                const selected = form.study_day.some((d) => d.id === day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-[36px] h-[36px] rounded-full text-sm font-medium transition-colors ${selected ? chipActive : chipInactive}`}
                  >
                    {day.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 시작일 */}
          <div className="flex items-center gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0">
              스터디 시작일 <span className="text-error">*</span>
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setField('start_date')(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* 기간 */}
          <div className="flex items-center gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0">
              스터디 기간 <span className="text-error">*</span>
            </label>
            <select
              value={form.term}
              onChange={(e) => setField('term')(e.target.value)}
              className={`w-[160px] ${inputCls}`}
            >
              <option value="">선택</option>
              {TERM_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}주
                </option>
              ))}
            </select>
          </div>

          {/* 시간 */}
          <div className="flex items-center gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0">
              스터디 시간 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setField('start_time')(e.target.value)}
                className={inputCls}
              />
              <span className="text-text">~</span>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setField('end_time')(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 태그 설정 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-text mb-6">스터디 태그 설정</h2>
        <div className="flex flex-col gap-6">
          {/* 주제 */}
          <div className="flex items-start gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0 pt-1">
              스터디 주제 <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setField('subject')(form.subject?.id === s.id ? null : s)
                  }
                  className={`${chipBase} ${form.subject?.id === s.id ? chipActive : chipInactive}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* 난이도 */}
          <div className="flex items-start gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0 pt-1">
              스터디 난이도 <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() =>
                    setField('difficulty')(
                      form.difficulty?.id === d.id ? null : d,
                    )
                  }
                  className={`${chipBase} ${form.difficulty?.id === d.id ? chipActive : chipInactive}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 태그 */}
          <div className="flex items-start gap-4">
            <label className="w-[120px] text-sm font-bold text-text shrink-0 pt-1">
              검색 태그 <span className="text-error">*</span>
            </label>
            <div className="flex-1">
              {form.search_tag.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.search_tag.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 h-[32px] bg-bg-muted rounded-full text-sm text-text"
                    >
                      {t.name}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="text-text-disabled hover:text-text ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={
                  form.search_tag.length >= 5
                    ? '최대 5개까지 입력 가능합니다.'
                    : '태그 입력 후 Enter (최대 5개)'
                }
                disabled={form.search_tag.length >= 5}
                className="w-full h-[50px] px-4 border border-border rounded-lg text-sm text-text placeholder:text-text-disabled outline-none focus:border-2 focus:border-info disabled:bg-bg-muted"
              />
            </div>
          </div>
        </div>
      </section>

      {error && <p className="text-error text-sm text-center mb-4">{error}</p>}
    </div>
  );
}

function StudyEditPage() {
  const { studyId } = useParams();
  const { study, isLoading } = useStudyDetail(studyId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted">
        로딩 중...
      </div>
    );
  }

  if (!study) return null;

  return <StudyEditForm study={study} studyId={studyId} />;
}

export default StudyEditPage;
