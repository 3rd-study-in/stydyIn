    import React, { useState, useEffect } from 'react';
    import Image from '../../../atoms/Images/Common/Image';

    const AuthSystem = () => {
    // UI 상태 관리
    const [view, setView] = useState('login'); // login | signup | reset
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: 이메일입력, 2: 인증번호확인
    const [errorMsg, setErrorMsg] = useState('');

    // 1.1 이메일 중복 확인 및 인증 메일 발송 (회원가입/비번재설정 시)
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
        // 이메일 중복 체크 API 호출
        const response = await fetch(`/accounts/emails/check/?email=${email}`);
        const data = await response.json();

        if (view === 'signup') {
            if (response.status === 409) {
            setErrorMsg(data.error); // "사용 중인 이메일입니다."
            return;
            }
            // 중복이 아니면 인증 단계로 이동 (실제 발송은 안되지만 로직상 처리)
            setStep(2);
        } else {
            // 로그인이나 비번찾기 로직
            setStep(2);
        }
        } catch (err) {
        setErrorMsg("서버 통신 오류가 발생했습니다.");
        }
    };

    // 1.2 인증번호 확인 (123456 고정)
    const verifyCode = (e) => {
        e.preventDefault();
        if (verificationCode === "123456") {
        alert("인증에 성공했습니다!");
        // 이후 가입 완료 API 호출 로직 추가 가능
        } else {
        setErrorMsg("인증번호가 일치하지 않습니다.");
        }
    };

    // 1.5 로그인 실행 (JWT)
    const handleLogin = async (e) => {
        e.preventDefault();
        // API 명세에 따른 로그인 요청 (POST /accounts/login)
        console.log("JWT 로그인 시도:", { email, password });
        // 성공 시 access_token(1h), refresh_token(7h) 저장 로직
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-bg">

        {/* 322px 가로 폭 준수 */}
        <div className="w-[322px] flex flex-col gap-spacing-xl font-sans text-text">
            
            {/* 헤더 텍스트 */}
            <div className="text-left">
            <h1 className="text-2xl font-bold leading-tight">
                {view === 'login' ? "SNS계정으로 간편하게\n회원가입/로그인 하세요! :)" : 
                view === 'signup' ? "새로운 계정을\n만들어보세요! :)" : "비밀번호를\n재설정합니다."}
            </h1>
            </div>

            {/* 메인 이미지 영역 */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-md">
            <Image
            name="LoginImg" width={322} className="w-full h-auto"
            />
            </div>

            {/* 폼 영역 */}
            <div className="flex flex-col gap-spacing-md">
            {view === 'login' ? (
                /* 로그인 폼 */
                <form onSubmit={handleLogin} className="flex flex-col gap-spacing-md">
                <input
                    type="email"
                    placeholder="이메일"
                    className="w-full py-spacing-sm border-b border-border focus:border-primary outline-none text-base"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    className="w-full py-spacing-sm border-b border-border focus:border-primary outline-none text-base"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full py-spacing-md bg-primary text-white rounded-lg font-semibold text-lg mt-spacing-sm">
                    로그인
                </button>
                </form>
            ) : (
                /* 회원가입/비번재설정 폼 (인증 포함) */
                <form onSubmit={step === 1 ? handleEmailSubmit : verifyCode} className="flex flex-col gap-spacing-md">
                <input
                    type="email"
                    placeholder="이메일"
                    disabled={step === 2}
                    className="w-full py-spacing-sm border-b border-border focus:border-primary outline-none text-base disabled:text-text-disabled"
                    onChange={(e) => setEmail(e.target.value)}
                />
                {step === 2 && (
                    <input
                    type="text"
                    placeholder="인증번호 6자리 (123456)"
                    className="w-full py-spacing-sm border-b border-border focus:border-primary outline-none text-base"
                    onChange={(e) => setVerificationCode(e.target.value)}
                    />
                )}
                <button className="w-full py-spacing-md bg-primary text-white rounded-lg font-semibold text-lg mt-spacing-sm">
                    {step === 1 ? "인증번호 발송" : "인증하기"}
                </button>
                </form>
            )}
            </div>

            {/* 에러 메시지 표시 */}
            {errorMsg && <p className="text-center text-error text-sm -mt-2">{errorMsg}</p>}

            {/* 하단 네비게이션 */}
            <div className="flex justify-center gap-spacing-md text-sm text-secondary font-medium">
            {view === 'login' ? (
                <>
                <button onClick={() => {setView('signup'); setStep(1);}} className="hover:text-text">회원가입</button>
                <span className="text-border">|</span>
                <button onClick={() => {setView('reset'); setStep(1);}} className="hover:text-text">비밀번호 찾기</button>
                </>
            ) : (
                <button onClick={() => {setView('login'); setStep(1);}} className="hover:text-text">로그인으로 돌아가기</button>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default AuthSystem;