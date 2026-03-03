import { BASE_URL } from '../../constants/api';

export const checkEmailAvailability = (email) =>
  fetch(
    `${BASE_URL}/accounts/emails/check/?email=${encodeURIComponent(email)}`,
  );

export const sendEmailVerification = (email) =>
  fetch(`${BASE_URL}/accounts/email-verifications/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

export const verifyEmailCode = (email, verificationNumber) =>
  fetch(`${BASE_URL}/accounts/email-verifications/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, verification_number: verificationNumber }),
  });

export const login = (email, password) =>
  fetch(`${BASE_URL}/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const register = (email, password) =>
  fetch(`${BASE_URL}/accounts/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const resetPassword = (email, currentPassword, newPassword, token) =>
  fetch(`${BASE_URL}/accounts/password/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      email,
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
