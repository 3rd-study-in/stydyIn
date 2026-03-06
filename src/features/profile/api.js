import axiosInstance from '../../lib/axiosInstance'

export const getProfile = (userId) =>
  axiosInstance.get(`/accounts/profiles/${userId}/`)

export const saveProfile = (userId, body) =>
  axiosInstance.put(`/accounts/profiles/${userId}/`, body)
