import { useState } from 'react';
import { resetPassword } from '../api';
import useAuthStore from '../../../stores/authStore';

export const useResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPwError, setCurrentPwError] = useState('');
  const [newPwError, setNewPwError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const isValid = currentPassword.length > 0 && newPassword.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setNewPwError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const { email } = useAuthStore.getState();
      await resetPassword(email, currentPassword, newPassword);
      setIsDone(true);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 400) {
        setCurrentPwError(data?.error || '비밀번호가 일치하지 않습니다.');
      } else if (status === 401) {
        setCurrentPwError('인증 정보가 없습니다. 다시 로그인해 주세요.');
      } else {
        setCurrentPwError(data?.error || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    currentPwError,
    setCurrentPwError,
    newPwError,
    setNewPwError,
    isLoading,
    isDone,
    isValid,
    handleSubmit,
  };
};
