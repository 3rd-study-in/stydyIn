import axiosInstance from '../../lib/axiosInstance'

export const getProfile = (userId) =>
  axiosInstance.get(`/accounts/profiles/${userId}/`)

export const saveProfile = (userId, body) =>
  axiosInstance.put(`/accounts/profiles/${userId}/`, body)

export const checkPhoneAvailability = (phone) =>
  axiosInstance.get(`/accounts/phones/check/?phone=${encodeURIComponent(phone)}`)

export const checkNicknameAvailability = (nickname) =>
  axiosInstance.get(`/accounts/nicknames/check/?nickname=${encodeURIComponent(nickname)}`)
