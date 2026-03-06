import axiosInstance from '../../lib/axiosInstance'

export const checkEmailAvailability = (email) =>
  axiosInstance.get(`/accounts/emails/check/?email=${encodeURIComponent(email)}`)

export const sendEmailVerification = (email) =>
  axiosInstance.post('/accounts/email-verifications/', { email })

export const verifyEmailCode = (email, verificationNumber) =>
  axiosInstance.post('/accounts/email-verifications/verify/', {
    email,
    verification_number: verificationNumber,
  })

export const login = (email, password) =>
  axiosInstance.post('/accounts/login/', { email, password })

export const register = (email, password) =>
  axiosInstance.post('/accounts/register/', { email, password })

export const getMemberType = () =>
  axiosInstance.get('/accounts/members/type/')

export const getRegions = () =>
  axiosInstance.get('/accounts/regions/')

export const resetPassword = (email, currentPassword, newPassword) =>
  axiosInstance.put('/accounts/password/', {
    email,
    current_password: currentPassword,
    new_password: newPassword,
  })
