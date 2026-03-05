import axiosInstance from '../../lib/axiosInstance'

/**
 * 스터디 목록 조회
 * GET /study/?page=1&limit=6
 * @param {{ page?: number, limit?: number }} params
 * @returns Promise<{ count, next, previous, results }>
 */
export const getStudyList = (params = {}) =>
  axiosInstance.get('/study/', { params })
