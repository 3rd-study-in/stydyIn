import { BASE_URL } from '../../constants/api';

const fileUrl = (path = '') => `${BASE_URL}/file-uploader${path}`;

// Content-Type은 브라우저가 boundary 포함해서 자동 설정하도록 직접 지정하지 않음
export const uploadImage = (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetch(fileUrl('/image/'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
};
