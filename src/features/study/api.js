
import axiosInstance from '../../lib/axiosInstance'

/**
 * 스터디 목록 조회
 * GET /study/?page=1&limit=6
 * @param {{ page?: number, limit?: number }} params
 * @returns Promise<{ count, next, previous, results }>
 */
export const getStudyList = (params = {}) =>
  axiosInstance.get('/study/', { params })
 
import { BASE_URL } from '../../constants/api';

const studyUrl = (path = '') => `${BASE_URL}/study${path}`;

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...authHeaders(token),
});

// 2.1 스터디 전체 가져오기
// export const getStudyList = ({ page, limit, skip } = {}) => {
//  const params = new URLSearchParams();
//  if (page !== undefined) params.set('page', page);
//  if (limit !== undefined) params.set('limit', limit);
//  if (skip !== undefined) params.set('skip', skip);
//  const query = params.toString() ? `?${params}` : '';
//  return fetch(studyUrl(`/${query}`));
//};

// 2.2 스터디 상세
export const getStudyDetail = (studyPk) =>
  fetch(studyUrl(`/${studyPk}/`));

// 2.3 스터디 만들기
export const createStudy = (body, token) =>
  fetch(studyUrl('/'), {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });

// 2.4 스터디 수정하기
export const updateStudy = (studyPk, body, token) =>
  fetch(studyUrl(`/${studyPk}/`), {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });

// 2.5 스터디 삭제하기
export const deleteStudy = (studyPk, token) =>
  fetch(studyUrl(`/${studyPk}/`), {
    method: 'DELETE',
    headers: authHeaders(token),
  });

// 2.6 스터디 참가자 조회하기
export const getStudyParticipants = (studyPk) =>
  fetch(studyUrl(`/${studyPk}/participate/`));

// 2.7 스터디 참가하기
export const joinStudy = (studyPk, token) =>
  fetch(studyUrl(`/${studyPk}/participate/`), {
    method: 'POST',
    headers: authHeaders(token),
  });

// 2.8 스터디 탈퇴하기
export const leaveStudy = (studyPk, token) =>
  fetch(studyUrl(`/${studyPk}/participate/`), {
    method: 'DELETE',
    headers: authHeaders(token),
  });

// 2.9 좋아요 누른 스터디 가져오기
export const getLikedStudies = (token) =>
  fetch(studyUrl('/my-like-study/'), {
    headers: authHeaders(token),
  });

// 2.10 스터디 좋아요 누르기
export const likeStudy = (studyPk, token) =>
  fetch(studyUrl(`/${studyPk}/like/`), {
    method: 'POST',
    headers: authHeaders(token),
  });

// 2.11 스터디 좋아요 취소
export const unlikeStudy = (studyPk, token) =>
  fetch(studyUrl(`/${studyPk}/like/`), {
    method: 'DELETE',
    headers: authHeaders(token),
  });

// 2.13 스터디 주제 카테고리 조회
export const getSubjects = () => fetch(studyUrl('/subject/'));

// 2.14 스터디 난이도 카테고리 조회
export const getDifficulties = () => fetch(studyUrl('/difficulty/'));

// 2.15 검색 태그 카테고리 조회
export const getSearchTags = () => fetch(studyUrl('/searchtag/'));

// 2.16 내가 만든 스터디 조회
export const getMyStudies = (token) =>
  fetch(studyUrl('/my-study/'), {
    headers: authHeaders(token),
  });

// 2.17 내가 참여중인 스터디 조회
export const getMyParticipatingStudies = (token) =>
  fetch(studyUrl('/my-participating-study/'), {
    headers: authHeaders(token),
  });

// 2.18 내 마감된 스터디 조회
export const getMyClosedStudies = (token) =>
  fetch(studyUrl('/my-closed-study/'), {
    headers: authHeaders(token),
  });

// 2.19 스터디 리스트 조회 (검색/필터/페이지네이션)
export const getStudyListPaged = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ).toString();
  return fetch(studyUrl(`/list/${query ? `?${query}` : ''}`));
};

