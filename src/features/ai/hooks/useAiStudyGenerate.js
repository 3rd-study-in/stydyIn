import { useState } from 'react';
import { callGptApi } from '../api';

const SYSTEM_PROMPT = `당신은 스터디 그룹 생성 도우미입니다.
스터디 제목을 받으면 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

응답 형식:
{
  "study_info": "스터디 소개글 (1000자 이내, plain text)",
  "schedule_text": "주차별 커리큘럼 (예: 1주차: ..., 2주차: ...) (500자 이내, plain text)",
  "study_day": [{"id": <1-7>, "name": "<요일>"}],
  "term": <1-12 사이 정수 (주 단위)>,
  "start_time": "HH:MM:SS",
  "end_time": "HH:MM:SS",
  "subject": {"id": <id>, "name": "<주제명>"},
  "difficulty": {"id": <id>, "name": "<난이도>"},
  "search_tag": [{"name": "<태그>"}, ...]
}

subject id 매핑: 개념학습(1), 응용/활용(2), 프로젝트(3), 챌린지(4), 자격증/시험(5), 취업/코테(6), 특강(7), 기타(8)
difficulty id 매핑: 초급(1), 중급(2), 고급(3)
study_day id 매핑: 월(1), 화(2), 수(3), 목(4), 금(5), 토(6), 일(7)
search_tag는 최대 5개, 스터디 주제와 관련된 기술/키워드로 구성하세요.`;

const TIME_RE = /^\d{2}:\d{2}:\d{2}$/;

function clamp(min, val, max) {
  return Math.min(max, Math.max(min, val));
}

function validateAndSanitize(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('응답 형식이 올바르지 않습니다.');

  const study_info =
    typeof raw.study_info === 'string' ? raw.study_info.slice(0, 1000) : '';

  const schedule_text =
    typeof raw.schedule_text === 'string' ? raw.schedule_text.slice(0, 500) : '';

  const study_day = Array.isArray(raw.study_day)
    ? raw.study_day
        .filter((d) => d && Number.isInteger(d.id) && d.id >= 1 && d.id <= 7)
        .slice(0, 7)
    : [];

  const term =
    typeof raw.term === 'number' && !isNaN(raw.term)
      ? clamp(1, Math.round(raw.term), 12)
      : 4;

  const start_time =
    typeof raw.start_time === 'string' && TIME_RE.test(raw.start_time)
      ? raw.start_time
      : '19:00:00';

  const end_time =
    typeof raw.end_time === 'string' && TIME_RE.test(raw.end_time)
      ? raw.end_time
      : '21:00:00';

  const subject =
    raw.subject &&
    Number.isInteger(raw.subject.id) &&
    raw.subject.id >= 1 &&
    raw.subject.id <= 8 &&
    typeof raw.subject.name === 'string'
      ? raw.subject
      : { id: 8, name: '기타' };

  const difficulty =
    raw.difficulty &&
    Number.isInteger(raw.difficulty.id) &&
    raw.difficulty.id >= 1 &&
    raw.difficulty.id <= 3 &&
    typeof raw.difficulty.name === 'string'
      ? raw.difficulty
      : { id: 1, name: '초급' };

  const search_tag = Array.isArray(raw.search_tag)
    ? raw.search_tag
        .filter((t) => t && typeof t.name === 'string' && t.name.trim())
        .map((t) => ({ name: t.name.trim() }))
        .slice(0, 5)
    : [];

  return {
    study_info,
    schedule_text,
    study_day,
    term,
    start_time,
    end_time,
    subject,
    difficulty,
    search_tag,
  };
}

function sanitizeTitle(title) {
  return title.replace(/[`"\\]/g, '').trim().slice(0, 50);
}

function useAiStudyGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateStudy = async (title) => {
    const safeTitle = sanitizeTitle(title);
    if (!safeTitle) return { ok: false };

    setIsGenerating(true);
    setAiError(null);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `스터디 제목: ${safeTitle}`,
        },
      ];

      const content = await callGptApi(messages);

      // 응답에서 JSON 부분만 추출 (```json ... ``` 래핑 대응)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');

      const parsed = JSON.parse(jsonMatch[0]);
      const data = validateAndSanitize(parsed);

      setHasGenerated(true);
      return { ok: true, data };
    } catch (err) {
      const message =
        err.name === 'AbortError'
          ? '요청 시간이 초과되었습니다. 다시 시도해주세요.'
          : (err.message ?? 'AI 생성에 실패했습니다.');
      setAiError(message);
      return { ok: false };
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateStudy, isGenerating, aiError, hasGenerated };
}

export default useAiStudyGenerate;
