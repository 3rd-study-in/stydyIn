import React, { useState } from 'react';
import Image from '../../../atoms/Images/Common/Image';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';
import Modal from '../../../atoms/Modal/Modal';

const api = {
  get: (path) => fetch(`https://api.wenivops.co.kr/services/studyin${path}`),
  post: (path, body) =>
    fetch(`https://api.wenivops.co.kr/services/studyin${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

const AuthSystem = () => {
  const [view, setView] = useState('login'); // login | signup | complete
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [step, setStep] = useState(1); // 1: 기본, 2: 인증번호입력중, 3: 인증완료
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // 에러 및 성공 피드백 상태
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null); // 'success' | 'fail' | null

  // 로딩 상태
  const [isEmailAuthLoading, setIsEmailAuthLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // 인증코드 안내 툴팁
  const [showCodeHelp, setShowCodeHelp] = useState(false);

  // 버튼 활성화 조건
  const isLoginValid = email.includes('@') && password.length > 0;
  const isSignupValid =
    step === 3 && password.length > 0 && password === passwordConfirm;

  // 1.1 이메일 중복 확인 → 1.2 인증번호 발송
  const handleEmailAuth = async () => {
    setEmailError('');
    setIsEmailAuthLoading(true);
    try {
      // 1.1 이메일 중복 확인
      const checkRes = await api.get(
        `/accounts/emails/check/?email=${encodeURIComponent(email)}`,
      );
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

      // 1.2 인증번호 발송
      const sendRes = await api.post('/accounts/email-verifications/', {
        email,
      });
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
      const sendRes = await api.post('/accounts/email-verifications/', {
        email,
      });
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
      const res = await api.post('/accounts/email-verifications/verify/', {
        email,
        verification_number: verificationCode,
      });
      const data = await res.json();

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

  // 1.5 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPwError('');
    setIsSubmitLoading(true);
    try {
      const response = await api.post('/accounts/login/', {
        email,
        password,
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('email', email);
        alert('로그인 성공!');
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
      setIsSubmitLoading(false);
    }
  };

  // 1.4 회원가입 완료
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const response = await api.post('/accounts/register/', {
        email,
        password,
      });
      const data = await response.json();
      if (response.ok) {
        setView('complete');
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg">
      <div className="w-[322px] flex flex-col font-sans text-text">
        {view === 'complete' ? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-xl text-center">
            <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Check" color="white" size={36} />
            </div>
            <h2 className="text-3xl font-bold">회원가입 완료!</h2>
            <p className="text-sm text-text leading-relaxed">
              스터디인 회원가입을 완료했어요.
              <br />
              로그인 후 <strong>프로필 생성</strong>을 진행해 볼까요?
            </p>
            <FlexibleButton
              variant="blue"
              size="L"
              width="100%"
              type="button"
              className="cursor-pointer"
              onClick={() => setView('login')}
            >
              로그인하기
            </FlexibleButton>
          </div>
        ) : view === 'signup' ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-5xl">회원가입</h2>
            <form
              onSubmit={handleRegister}
              noValidate
              className="flex flex-col gap-xl"
            >
              {/* 이메일 영역 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex-1 border-b-2 transition-colors
                    ${emailError ? 'border-error' : 'border-border focus-within:border-primary'}`}
                  >
                    <input
                      type="email"
                      placeholder="이메일"
                      className="w-full h-[40px] outline-none text-base"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                    />
                  </div>
                  <FlexibleButton
                    variant="blue"
                    size="M"
                    type="button"
                    onClick={handleEmailAuth}
                    disabled={
                      !!emailError || !email.includes('@') || isEmailAuthLoading
                    } // 에러가 있거나 형식이 틀리면 비활성화
                    className={`shrink-0 transition-colors 
                        ${
                          emailError ||
                          !email.includes('@') ||
                          isEmailAuthLoading
                            ? 'bg-secondary-light cursor-not-allowed opacity-70' // 비활성 스타일
                            : 'cursor-pointer hover:bg-primary-dark' // 활성 스타일
                        }`}
                  >
                    {isEmailAuthLoading ? '전송중...' : '인증'}
                  </FlexibleButton>
                </div>
                {emailError && (
                  <p className="text-error text-sm">{emailError}</p>
                )}
              </div>

              {/* 인증코드 박스 */}
              {step >= 2 && (
                <div className="flex flex-col gap-md">
                  <div className="bg-bg-muted rounded-md p-5 flex flex-col gap-md border border-border">
                    <div className="flex items-start gap-md">
                      <Icon
                        name="Send"
                        color="var(--color-primary)"
                        size={40}
                      />
                      <p className="text-sm font-regular leading-tight">
                        이메일로 전송된
                        <br />
                        <span className="font-bold text-base">인증코드</span>를
                        입력해 주세요 :)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={verifyStatus === 'success'}
                        className={`flex-1 h-10 px-3 border rounded-md outline-none bg-white
                          ${verifyStatus === 'fail' ? 'border-error' : verifyStatus === 'success' ? 'border-primary' : 'border-border'}
                          ${verifyStatus === 'success' ? 'cursor-not-allowed opacity-70' : ''}`}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <FlexibleButton
                        variant="blue"
                        size="M"
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={
                          verificationCode.length === 0 || isVerifyLoading
                        }
                        className={`shrink-0 transition-colors ${
                          verificationCode.length === 0 || isVerifyLoading
                            ? 'cursor-not-allowed opacity-70'
                            : 'cursor-pointer'
                        }`}
                      >
                        {isVerifyLoading ? '확인중...' : '확인'}
                      </FlexibleButton>
                    </div>

                    {/* 피드백 메시지 */}
                    {verifyStatus === 'success' && (
                      <div className="flex items-center gap-xs text-primary text-sm font-medium">
                        <Icon
                          name="CheckFill"
                          color="var(--color-primary)"
                          size={16}
                        />
                        <span>이메일 인증이 완료되었어요 :)</span>
                      </div>
                    )}

                    {verifyStatus === 'fail' && (
                      <div className="flex items-center gap-1 text-error text-sm font-medium">
                        <Icon
                          name="Alert"
                          color="var(--color-error)"
                          size={16}
                        />
                        <span>인증번호가 올바르지 않아요.</span>
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center gap-xs text-xs text-secondary-dark">
                    <button
                      type="button"
                      onClick={() => setShowCodeHelp((prev) => !prev)}
                      className="flex items-center cursor-pointer"
                    >
                      <Icon name="HelpCircle" size={14} />
                    </button>
                    <span>
                      인증코드를 받지 못하셨나요?{' '}
                      <span
                        className="text-primary font-bold cursor-pointer"
                        onClick={handleResendCode}
                      >
                        재전송
                      </span>
                    </span>

                    {showCodeHelp && (
                      <div className="absolute top-full mt-2 left-[-10px] z-20 w-[310px] rounded-lg bg-secondary-dark p-xl text-white shadow-lg">
                        <div
                          className="absolute -top-2 left-[10px]"
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderBottom:
                              '8px solid var(--color-secondary-dark)',
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-sm top-sm cursor-pointer opacity-70"
                          onClick={() => setShowCodeHelp(false)}
                        >
                          <Icon name="X" size={20} color="white" />
                        </button>
                        <p className="text-base font-bold pb-sm">
                          이메일이 수신되지 않나요? : (
                        </p>
                        <ul className="flex flex-col text-xm leading-relaxed">
                          <li>
                            - 이메일 주소가 정확히 입력되었는지 확인해 주세요.
                            <br />- 스팸 메일함을 확인해 주세요.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <input
                type="password"
                placeholder="비밀번호"
                className="w-full h-[40px] border-b-2 border-border outline-none focus:border-primary"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className={`w-full h-10 border-b-2 outline-none
                    ${pwConfirmError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordConfirm(value);
                    if (value && password !== value) {
                      setPwConfirmError('비밀번호가 일치하지 않아요.');
                    } else {
                      setPwConfirmError('');
                    }
                  }}
                />
                {pwConfirmError && (
                  <p className="text-error text-sm">{pwConfirmError}</p>
                )}
              </div>

              <div className="text-sm leading-relaxed mt-xl">
                <p className="font-bold">본인은 만 14세 이상이며, 스터디인의</p>
                <p>
                  <span className="text-primary underline cursor-pointer">
                    이용 약관
                  </span>
                  ,{' '}
                  <span className="text-primary underline cursor-pointer">
                    개인정보취급방침
                  </span>
                  을 확인하였습니다.
                </p>

                <FlexibleButton
                  variant="blue"
                  size="L"
                  width="100%"
                  type="submit"
                  className="cursor-pointer text-white mt-md"
                  disabled={!isSignupValid || isSubmitLoading}
                >
                  {isSubmitLoading ? '동의하고 회원가입' : '동의하고 회원가입'}
                </FlexibleButton>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-left mb-6">
              <h1 className="text-2xl font-bold leading-snug whitespace-pre-wrap">
                {'SNS계정으로 간편하게\n회원가입/로그인 하세요! :)'}
              </h1>
            </div>
            <Image
              name="LoginImg"
              width={322}
              className="rounded-lg w-full h-auto mb-10"
            />
            <form
              onSubmit={handleLogin}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  placeholder="이메일"
                  className={`w-full h-[40px] border-b-2 outline-none ${emailError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                />
                {emailError && (
                  <p className="text-error text-sm">{emailError}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <input
                  type="password"
                  placeholder="비밀번호"
                  className={`w-full h-[40px] border-b-2 outline-none ${pwError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (pwError) setPwError('');
                  }}
                />
                {pwError && <p className="text-error text-sm">{pwError}</p>}
              </div>
              <div className="mt-6">
                <FlexibleButton
                  variant="blue"
                  size="L"
                  width="100%"
                  type="submit"
                  className="cursor-pointer text-white"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? '로그인' : '로그인'}
                </FlexibleButton>
              </div>
            </form>
            <div className="flex justify-center mt-10 text-sm text-secondary-dark font-medium">
              <button
                onClick={() => setView('signup')}
                className="cursor-pointer"
              >
                회원가입
              </button>
              <span className="text-secondary-dark mx-3">|</span>
              <button
                onClick={() => setShowResetModal(true)}
                className="cursor-pointer"
              >
                비밀번호 찾기
              </button>
            </div>
          </>
        )}
      </div>

      {/* 비밀번호 찾기 모달 */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        className="relative bg-white rounded-2xl w-[390px] flex flex-col text-center overflow-hidden border border-secondary-light"
      >
        <div className="px-8 pt-10 flex flex-col gap-md">
          <button
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => setShowResetModal(false)}
          >
            <Icon
              name="X"
              size={20}
              className="text-secondary cursor-pointer"
            />
          </button>

          <h2 className="text-xl font-bold">비밀번호 찾기</h2>
          <p className="text-base text-text leading-relaxed">
            가입 시 등록한 이메일을 입력해 주세요.
            <br />
            비밀번호 재설정 링크를 이메일로 보내드릴게요 :)
          </p>
          <input
            type="email"
            placeholder="이메일 입력"
            value={resetEmail}
            className="w-full mt-lg border-b-2 border-border h-10 outline-none focus:border-primary text-md"
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </div>
        <button
          type="button"
          disabled={!resetEmail.includes('@')}
          className="w-full py-4 mt-3xl bg-primary text-white text-lg font-medium disabled:bg-secondary-light cursor-pointer disabled:cursor-not-allowed"
        >
          이메일 보내기
        </button>
      </Modal>
    </div>
  );
};

export default AuthSystem;
