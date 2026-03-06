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

export const getLikedStudies = () =>
  axiosInstance.get('/study/my-like-study/')

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

export const getMyStudies = () =>
  axiosInstance.get('/study/my-study/')

export const getMyParticipatingStudies = () =>
  axiosInstance.get('/study/my-participating-study/')

export const getMyClosedStudies = () =>
  axiosInstance.get('/study/my-closed-study/')

export const getStudyListPaged = (params = {}) =>
  axiosInstance.get('/study/list/', { params })
