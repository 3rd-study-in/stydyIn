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
      const checkRes = await checkEmailAvailability(email);
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        if (checkRes.status === 409) {
          setEmailError(checkData.error || '사용 중인 이메일입니다.');
        } else {
          setEmailError(
            checkData.error || '이메일 확인 중 오류가 발생했습니다.',
          );
        }
        return;
      }

      const sendRes = await sendEmailVerification(email);
      const sendData = await sendRes.json();

      if (!sendRes.ok) {
        if (sendRes.status === 409) {
          setEmailError(sendData.error || '이미 가입되어 있는 회원입니다.');
        } else {
          setEmailError(
            sendData.email?.[0] || '인증 메일 발송에 실패했습니다.',
          );
        }
        return;
      }

      setStep(2);
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
      const sendRes = await sendEmailVerification(email);
      const sendData = await sendRes.json();
      if (!sendRes.ok) {
        setEmailError(sendData.error || '재전송에 실패했습니다.');
      }
    } catch (err) {
      setEmailError('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsEmailAuthLoading(false);
    }
  };

  // 1.3 인증 코드 체크
  const handleVerifyCode = async () => {
    setIsVerifyLoading(true);
    try {
      const res = await verifyEmailCode(email, verificationCode);

      if (res.ok) {
        setVerifyStatus('success');
        setStep(3);
      } else {
        setVerifyStatus('fail');
      }
    } catch (err) {
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
      const response = await register(email, password);
      const data = await response.json();
      console.log('[register]', response.status, JSON.stringify(data)); // 디버깅
      if (response.ok) {
        onSuccess?.();
      } else if (response.status === 403) {
        setEmailError(
          data.error || '이메일 인증이 완료되지 않았거나 만료되었습니다.',
        );
      } else if (response.status === 409) {
        setEmailError(data.error || '이미 가입되어 있는 회원입니다.');
      } else {
        alert(data.error || '가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('가입 중 오류');
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
