import { useState } from 'react';
import { uploadImage } from '../api';
import useAuthStore from '../../../stores/authStore';

function useImageUpload() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const upload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await uploadImage(file, accessToken);
      const data = await res.json();
      if (res.ok) return { ok: true, imageUrl: data.image_url };
      setUploadError(data.detail ?? '이미지 업로드에 실패했습니다.');
      return { ok: false };
    } catch {
      setUploadError('서버 연결 오류');
      return { ok: false };
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, uploadError };
}

export default useImageUpload;
