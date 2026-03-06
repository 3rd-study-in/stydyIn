import { useState, useCallback } from 'react';

const API_BASE_URL = 'https://api.wenivops.co.kr/services/studyin';

/**
 * 댓글/대댓글 API 훅
 */
const useComment = (studyPk) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 토큰 가져오기 (로그인 상태 관리에 따라 수정 필요)
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // 공통 헤더
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

  // ===== 댓글 =====

  // 3.1 댓글 가져오기
  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/`);
      if (!res.ok) throw new Error('댓글을 불러올 수 없습니다.');
      const data = await res.json();
      setComments(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [studyPk]);

  // 3.2 댓글 하나만 가져오기
  const fetchComment = useCallback(async (commentPk) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/`);
      if (!res.ok) throw new Error('댓글을 찾을 수 없습니다.');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk]);

  // 3.3 댓글 작성하기
  const createComment = useCallback(async (content, isSecret = false) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, is_secret: isSecret }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '댓글 작성 실패');
      }
      const newComment = await res.json();
      await fetchComments(); // 목록 새로고침
      return newComment;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk, fetchComments]);

  // 3.4 댓글 수정하기
  const updateComment = useCallback(async (commentPk, content, isSecret) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content, is_secret: isSecret }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '댓글 수정 실패');
      }
      const updatedComment = await res.json();
      await fetchComments();
      return updatedComment;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk, fetchComments]);

  // 3.5 댓글 삭제하기
  const deleteComment = useCallback(async (commentPk) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '댓글 삭제 실패');
      }
      await fetchComments();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [studyPk, fetchComments]);

  // ===== 대댓글 =====

  // 3.6 대댓글 가져오기
  const fetchRecomments = useCallback(async (commentPk) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/recomment/`);
      if (!res.ok) throw new Error('대댓글을 불러올 수 없습니다.');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk]);

  // 3.7 대댓글 하나만 가져오기
  const fetchRecomment = useCallback(async (commentPk, recommentPk) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/recomment/${recommentPk}/`);
      if (!res.ok) throw new Error('대댓글을 찾을 수 없습니다.');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk]);

  // 3.8 대댓글 작성하기
  const createRecomment = useCallback(async (commentPk, content, isSecret = false, taggedUserId = null) => {
    try {
      const body = { content, is_secret: isSecret };
      if (taggedUserId) body.tagged_user = taggedUserId;

      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/recomment/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || errData.error || '대댓글 작성 실패');
      }
      const newRecomment = await res.json();
      await fetchComments();
      return newRecomment;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk, fetchComments]);

  // 3.9 대댓글 수정하기
  const updateRecomment = useCallback(async (commentPk, recommentPk, content, isSecret) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/recomment/${recommentPk}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content, is_secret: isSecret }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '대댓글 수정 실패');
      }
      const updatedRecomment = await res.json();
      await fetchComments();
      return updatedRecomment;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [studyPk, fetchComments]);

  // 3.10 대댓글 삭제하기
  const deleteRecomment = useCallback(async (commentPk, recommentPk) => {
    try {
      const res = await fetch(`${API_BASE_URL}/study/${studyPk}/comment/${commentPk}/recomment/${recommentPk}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '대댓글 삭제 실패');
      }
      await fetchComments();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [studyPk, fetchComments]);

  return {
    comments,
    loading,
    error,
    // 댓글
    fetchComments,
    fetchComment,
    createComment,
    updateComment,
    deleteComment,
    // 대댓글
    fetchRecomments,
    fetchRecomment,
    createRecomment,
    updateRecomment,
    deleteRecomment,
  };
};

export default useComment;