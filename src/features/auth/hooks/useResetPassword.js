import { useState } from 'react';
import { resetPassword } from '../api';

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

    let hasError = false;

    if (newPassword.length < 6) {
      setNewPwError('비밀번호는 6자 이상이어야 합니다.');
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('email');
      const res = await resetPassword(email, currentPassword, newPassword, token);

      if (res.ok) {
        setIsDone(true);
      } else if (res.status === 400) {
        const data = await res.json();
        setCurrentPwError(data.error || '비밀번호가 일치하지 않습니다.');
      } else if (res.status === 401) {
        setCurrentPwError('인증 정보가 없습니다. 다시 로그인해 주세요.');
      } else {
        const data = await res.json();
        setCurrentPwError(
          data.error || '비밀번호 변경 중 오류가 발생했습니다.',
        );
      }
    } catch {
      setCurrentPwError('네트워크 오류가 발생했습니다.');
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
