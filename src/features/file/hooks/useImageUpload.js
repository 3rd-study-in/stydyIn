import { useState } from 'react';
import { uploadImage } from '../api';

function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const upload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const { data } = await uploadImage(file);
      return { ok: true, imageUrl: data.image_url };
    } catch (err) {
      const msg = err.response?.data?.detail ?? '이미지 업로드에 실패했습니다.';
      setUploadError(msg);
      return { ok: false };
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, uploadError };
}

export default useImageUpload;
