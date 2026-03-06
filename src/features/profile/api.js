import { BASE_URL } from '../../constants/api';

export const uploadImage = (accessToken, file) => {
  const fd = new FormData();
  fd.append('image', file);
  return fetch(`${BASE_URL}/file-uploader/image/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd,
  });
};

export const getProfile = (accessToken, userId) =>
  fetch(`${BASE_URL}/accounts/profiles/${userId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

export const saveProfile = (accessToken, userId, body) =>
  fetch(`${BASE_URL}/accounts/profiles/${userId}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
