import { useNavigate } from 'react-router-dom';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';
import { useResetPassword } from '../../../features/auth/hooks/useResetPassword';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const {
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
  } = useResetPassword();

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg">
      <div className="w-[322px] flex flex-col font-sans text-text">
        {isDone ? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-xl text-center">
            <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Check" color="white" size={36} />
            </div>
            <h2 className="text-3xl font-bold">비밀번호 변경 완료!</h2>
            <p className="text-sm text-text leading-relaxed">
              비밀번호가 성공적으로 변경되었어요.
              <br />
              다시 로그인해 주세요.
            </p>
            <FlexibleButton
              variant="blue"
              size="L"
              width="100%"
              type="button"
              className="cursor-pointer"
              onClick={() => navigate('/')}
            >
              로그인하러 가기
            </FlexibleButton>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-5xl">
              비밀번호 재설정
            </h2>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-xl"
            >
              {/* 현재 비밀번호 */}
              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  className={`w-full h-10 border-b-2 outline-none
                    ${currentPwError ? 'border-error' : 'border-border focus:border-primary'}`}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (currentPwError) setCurrentPwError('');
                  }}
                />
                {currentPwError && (
                  <div className="flex items-center gap-1 text-error text-sm font-medium">
                    <Icon name="Alert" color="var(--color-error)" size={16} />
                    <span>{currentPwError}</span>
                  </div>
                )}
              </div>

              {/* 새 비밀번호 */}
              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="새 비밀번호 (6자 이상)"
                  className={`w-full h-10 border-b-2 outline-none
                    ${newPwError ? 'border-error' : 'border-border focus:border-primary'}`}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPwError) setNewPwError('');
                  }}
                />
                {newPwError && (
                  <div className="flex items-center gap-1 text-error text-sm font-medium">
                    <Icon name="Alert" color="var(--color-error)" size={16} />
                    <span>{newPwError}</span>
                  </div>
                )}
              </div>

              <FlexibleButton
                variant="blue"
                size="L"
                width="100%"
                type="submit"
                className="cursor-pointer text-white mt-md"
                disabled={!isValid || isLoading}
              >
                {isLoading ? '비밀번호 변경' : '비밀번호 변경'}
              </FlexibleButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
