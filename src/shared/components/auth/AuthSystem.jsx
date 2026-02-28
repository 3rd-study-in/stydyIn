import React, { useState } from 'react';
import Image from '../../../atoms/Images/Common/Image';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';

const AuthSystem = () => {
  const [view, setView] = useState('login'); // login | signup | reset
  const [step, setStep] = useState(1); // 1: 기본, 2: 인증번호입력중, 3: 인증완료
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // 에러 및 성공 피드백 상태
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null); // 'success' | 'fail' | null

  // 버튼 활성화 조건
  const isLoginValid = email.includes('@') && password.length > 0;
  const isSignupValid =
    step === 3 && password.length > 0 && password === passwordConfirm;

  // TODO: 서버 연결 후 API 호출로 교체
  // 1.1 & 1.2 이메일 중복 확인 및 인증번호 발송
  const handleEmailAuth = () => {
    setEmailError('');
    setStep(2);
  };

  // 1.3 인증 코드 체크 (인증코드 고정값: 123456)
  const handleVerifyCode = () => {
    if (verificationCode === '123456') {
      setVerifyStatus('success');
      setStep(3);
    } else {
      setVerifyStatus('fail');
    }
  };

  // 1.5 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPwError('');
    try {
      const response = await fetch('/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        alert('로그인 성공!');
      } else if (response.status === 401) {
        setEmailError('이메일을 확인해 주세요.');
        setPwError('비밀번호를 확인해 주세요.');
      }
    } catch (err) {
      alert('서버 연결 오류');
    }
  };

  // 1.4 회원가입 완료
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert('회원가입이 정상적으로 완료되었습니다.');
        setView('login');
      }
    } catch (err) {
      alert('가입 중 오류');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg">
      <div className="w-[322px] flex flex-col font-sans text-text">
        {view === 'signup' ? (
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
                    className={`flex-1 border-b-2 pb-1 transition-colors
                    ${emailError ? 'border-error' : 'border-border focus-within:border-primary'}`}
                  >
                    <input
                      type="email"
                      placeholder="이메일"
                      className="w-full outline-none text-base"
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
                    disabled={!!emailError || !email.includes('@')} // 에러가 있거나 형식이 틀리면 비활성화
                    className={`shrink-0 transition-colors 
                        ${
                          emailError || !email.includes('@')
                            ? 'bg-secondary-light cursor-not-allowed opacity-70' // 비활성 스타일
                            : 'cursor-pointer hover:bg-primary-dark' // 활성 스타일
                        }`}
                  >
                    인증
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
                        disabled={verificationCode.length === 0}
                        className={`shrink-0 transition-colors ${
                          verificationCode.length === 0
                            ? 'cursor-not-allowed opacity-70'
                            : 'cursor-pointer'
                        }`}
                      >
                        확인
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
                  <div className="flex items-center gap-xs text-xs text-secondary-dark">
                    <Icon name="HelpCircle" size={14} />
                    <span>
                      인증코드를 받지 못하셨나요?{' '}
                      <span className="text-primary font-bold cursor-pointer">
                        재전송
                      </span>
                    </span>
                  </div>
                </div>
              )}

              <input
                type="password"
                placeholder="비밀번호"
                className="w-full border-b-2 border-border pb-1 outline-none focus:border-primary"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full border-b-2 border-border pb-1 outline-none focus:border-primary"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />

              <div className="text-sm leading-relaxed mt-4">
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
              </div>

              <FlexibleButton
                variant="blue"
                size="L"
                width="100%"
                type="submit"
                className="cursor-pointer text-white"
                disabled={!isSignupValid}
              >
                동의하고 회원가입
              </FlexibleButton>
            </form>
          </>
        ) : (
          /* 로그인 뷰 디자인 */
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
                  className={`w-full h-10 border-b-2 outline-none ${emailError ? 'border-error' : 'border-border focus:border-primary'}`}
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
                  className={`w-full h-10 border-b-2 outline-none ${pwError ? 'border-error' : 'border-border focus:border-primary'}`}
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
                  className="cursor-pointer"
                >
                  로그인
                </FlexibleButton>
              </div>
            </form>
            <div className="flex justify-center mt-10 text-sm text-secondary font-medium">
              <button
                onClick={() => setView('signup')}
                className="hover:text-text cursor-pointer"
              >
                회원가입
              </button>
              <span className="text-border mx-3">|</span>
              <button
                onClick={() => setView('reset')}
                className="hover:text-text cursor-pointer"
              >
                비밀번호 찾기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
