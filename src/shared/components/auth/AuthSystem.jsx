import React, { useState } from 'react';
import Image from '../../../atoms/Images/Common/Image';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';
import Modal from '../../../atoms/Modal/Modal';
import { useLogin } from '../../../features/auth/hooks/useLogin';
import { useSignup } from '../../../features/auth/hooks/useSignup';

const AuthSystem = ({ initialView = 'login' }) => {
  const [view, setView] = useState(initialView); // login | signup | complete
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    email: loginEmail,
    setEmail: setLoginEmail,
    password: loginPassword,
    setPassword: setLoginPassword,
    emailError: loginEmailError,
    setEmailError: setLoginEmailError,
    pwError,
    setPwError,
    isLoading: isLoginLoading,
    handleLogin,
  } = useLogin();

  const {
    step,
    email: signupEmail,
    setEmail: setSignupEmail,
    password: signupPassword,
    setPassword: setSignupPassword,
    setPasswordConfirm,
    verificationCode,
    setVerificationCode,
    emailError: signupEmailError,
    setEmailError: setSignupEmailError,
    pwError: signupPwError,
    setPwError: setSignupPwError,
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
  } = useSignup({ onSuccess: () => setView('complete') });

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg">
      <div className="w-[322px] flex flex-col font-sans text-text">
        {view === 'complete' ? (
          <div className="flex flex-col items-center mt-[120px] min-h-screen gap-xl text-center">
            <div className="mt-[120px]">
              <Icon name="CheckFill" color="var(--color-primary)" size={60} />
            </div>
            <h2 className="text-3xl font-bold">회원가입 완료!</h2>
            <p className="text-base text-secondary-dark leading-relaxed pb-sm">
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
            <h2 className="text-3xl font-bold text-center mt-[40px] mb-5xl">
              회원가입
            </h2>
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
                    ${signupEmailError ? 'border-error' : 'border-border focus-within:border-primary'}`}
                  >
                    <input
                      type="email"
                      placeholder="이메일"
                      className="w-full h-[40px] outline-none text-base"
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupEmailError) setSignupEmailError('');
                      }}
                    />
                  </div>
                  <FlexibleButton
                    variant="blue"
                    size="M"
                    type="button"
                    onClick={handleEmailAuth}
                    disabled={
                      !!signupEmailError ||
                      !signupEmail.includes('@') ||
                      isEmailAuthLoading
                    }
                    className={`shrink-0 transition-colors
                        ${
                          signupEmailError ||
                          !signupEmail.includes('@') ||
                          isEmailAuthLoading
                            ? 'bg-secondary-light cursor-not-allowed opacity-70'
                            : 'cursor-pointer hover:bg-primary-dark'
                        }`}
                  >
                    {isEmailAuthLoading ? '인증' : '인증'}
                  </FlexibleButton>
                </div>
                {signupEmailError && (
                  <p className="text-error text-sm">{signupEmailError}</p>
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
                        {isVerifyLoading ? '확인' : '확인'}
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

              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="비밀번호"
                  className={`w-full h-10 border-b-2 outline-none
                    ${signupPwError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSignupPassword(value);
                    if (value && value.length < 8) {
                      setSignupPwError(
                        '비밀번호는 8자 이상, 숫자+영문이어야 합니다.',
                      );
                    } else {
                      setSignupPwError('');
                    }
                  }}
                />
                {signupPwError && (
                  <p className="text-error text-sm">{signupPwError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className={`w-full h-10 border-b-2 outline-none
                    ${pwConfirmError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordConfirm(value);
                    if (value && signupPassword !== value) {
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
                  동의하고 회원가입
                </FlexibleButton>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-left mb-6">
              <h1 className="text-2xl font-bold mt-[100px] leading-snug whitespace-pre-wrap">
                {'계정으로 간편하게\n회원가입/로그인 하세요! :)'}
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
                  className={`w-full h-[40px] border-b-2 outline-none ${loginEmailError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginEmailError) setLoginEmailError('');
                  }}
                />
                {loginEmailError && (
                  <p className="text-error text-sm">{loginEmailError}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <input
                  type="password"
                  placeholder="비밀번호"
                  className={`w-full h-[40px] border-b-2 outline-none ${pwError ? 'border-error' : 'border-border focus:border-primary'}`}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
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
                  disabled={isLoginLoading || !loginEmail || !loginPassword}
                >
                  로그인
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
          onClick={() => alert('이메일 전송 기능은 아직 구현되지 않았습니다.')}
        >
          이메일 보내기
        </button>
      </Modal>
    </div>
  );
};

export default AuthSystem;
