import { useState } from 'react';
import { login } from '../api';
import useAuthStore from '../../../stores/authStore';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setTokens = useAuthStore((s) => s.setTokens);

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPwError('');
    setIsLoading(true);
    try {
      const response = await login(email, password);
      const data = await response.json();
      if (response.ok) {
        setTokens(data.access_token, data.refresh_token, email);
      } else if (response.status === 401) {
        setEmailError('이메일을 확인해 주세요.');
        setPwError('비밀번호를 확인해 주세요.');
      } else if (response.status === 403) {
        setEmailError(
          data.error || '이메일 인증이 완료되지 않았거나 만료되었습니다.',
        );
      } else {
        setEmailError(data.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 연결 오류');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    pwError,
    setPwError,
    isLoading,
    handleLogin,
  };
};
