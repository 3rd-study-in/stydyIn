import axiosInstance from '../../lib/axiosInstance'

export const getStudyList = (params = {}) =>
  axiosInstance.get('/study/', { params })

export const getStudyDetail = (studyPk) =>
  axiosInstance.get(`/study/${studyPk}/`)

export const createStudy = (body) =>
  axiosInstance.post('/study/', body)

export const updateStudy = (studyPk, body) =>
  axiosInstance.put(`/study/${studyPk}/`, body)

export const deleteStudy = (studyPk) =>
  axiosInstance.delete(`/study/${studyPk}/`)

export const getStudyParticipants = (studyPk) =>
  axiosInstance.get(`/study/${studyPk}/participate/`)

export const joinStudy = (studyPk) =>
  axiosInstance.post(`/study/${studyPk}/participate/`)

export const leaveStudy = (studyPk) =>
  axiosInstance.delete(`/study/${studyPk}/participate/`)

export const getLikedStudies = (params = {}) =>
  axiosInstance.get('/study/my-like-study/', { params })

export const likeStudy = (studyPk) =>
  axiosInstance.post(`/study/${studyPk}/like/`)

export const unlikeStudy = (studyPk) =>
  axiosInstance.delete(`/study/${studyPk}/like/`)

export const getSubjects = () =>
  axiosInstance.get('/study/subject/')

export const getDifficulties = () =>
  axiosInstance.get('/study/difficulty/')

export const getSearchTags = () =>
  axiosInstance.get('/study/searchtag/')

export const getMyStudies = (params = {}) =>
  axiosInstance.get('/study/my-study/', { params })

export const getMyParticipatingStudies = (params = {}) =>
  axiosInstance.get('/study/my-participating-study/', { params })

export const getMyClosedStudies = (params = {}) =>
  axiosInstance.get('/study/my-closed-study/', { params })

export const getStudyListPaged = (params = {}) =>
  axiosInstance.get('/study/list/', { params })
