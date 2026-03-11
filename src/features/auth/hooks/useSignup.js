import { useState } from 'react';
import {
  checkEmailAvailability,
  sendEmailVerification,
  verifyEmailCode,
  register,
} from '../api';

export const useSignup = ({ onSuccess } = {}) => {
  const [step, setStep] = useState(1); // 1: 기본, 2: 인증번호입력중, 3: 인증완료
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null); // 'success' | 'fail' | null

  const [isEmailAuthLoading, setIsEmailAuthLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [showCodeHelp, setShowCodeHelp] = useState(false);

  const isSignupValid =
    step === 3 &&
    password.length >= 8 &&
    password === passwordConfirm;

  // 1.1 이메일 중복 확인 → 1.2 인증번호 발송
  const handleEmailAuth = async () => {
    setEmailError('');
    setIsEmailAuthLoading(true);
    try {
      try {
        await checkEmailAvailability(email);
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;
        setEmailError(status === 409
          ? (data?.error || '사용 중인 이메일입니다.')
          : (data?.error || '이메일 확인 중 오류가 발생했습니다.'));
        return;
      }

      try {
        await sendEmailVerification(email);
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;
        setEmailError(status === 409
          ? (data?.error || '이미 가입되어 있는 회원입니다.')
          : (data?.email?.[0] || '인증 메일 발송에 실패했습니다.'));
        return;
      }

      setStep(2);
      setVerificationCode('123456');
    } catch (err) {
      setEmailError('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsEmailAuthLoading(false);
    }
  };

  // 인증번호 재전송
  const handleResendCode = async () => {
    setVerifyStatus(null);
    setVerificationCode('');
    setEmailError('');
    setIsEmailAuthLoading(true);
    try {
      await sendEmailVerification(email);
    } catch (err) {
      setEmailError(err.response?.data?.error || '재전송에 실패했습니다.');
    } finally {
      setIsEmailAuthLoading(false);
    }
  };

  // 1.3 인증 코드 체크
  const handleVerifyCode = async () => {
    setIsVerifyLoading(true);
    try {
      await verifyEmailCode(email, verificationCode);
      setVerifyStatus('success');
      setStep(3);
    } catch {
      setVerifyStatus('fail');
    } finally {
      setIsVerifyLoading(false);
    }
  };

  // 1.4 회원가입 완료
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403) {
        setEmailError(data?.error || '이메일 인증이 완료되지 않았거나 만료되었습니다.');
      } else if (status === 409) {
        setEmailError(data?.error || '이미 가입되어 있는 회원입니다.');
      } else {
        alert(data?.error || '가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    verificationCode,
    setVerificationCode,
    emailError,
    setEmailError,
    pwError,
    setPwError,
    pwConfirmError,
    setPwConfirmError,
    verifyStatus,
    isEmailAuthLoading,
    isVerifyLoading,
    isSubmitLoading,
    showCodeHelp,
    setShowCodeHelp,
    isSignupValid,
    handleEmailAuth,
    handleResendCode,
    handleVerifyCode,
    handleRegister,
  };
};
