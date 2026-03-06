import { BASE_URL } from '../../constants/api';

export const getProfile = (userId, token) =>
  fetch(`${BASE_URL}/accounts/profiles/${userId}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
