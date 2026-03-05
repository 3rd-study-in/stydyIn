import { useNavigate } from 'react-router-dom';
import Image from '../atoms/Images/Common/Image';
import FlexibleButton from '../atoms/Button/FlexibleButton';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="flex items-center gap-[50px]">
        <div className="h-[320px] w-[320px] shrink-0 overflow-hidden rounded-[30px] bg-bg-muted">
          <Image
            name="NotFound"
            alt="banner-char"
            className="h-auto object-contain mb-10"
          />
        </div>

        <div className="flex w-[410px] flex-col gap-3xl">
          <div className="flex flex-col gap-xxxs">
            <p className="text-[100px] font-bold leading-[125px] text-primary">
              404
            </p>
            <div className="flex flex-col gap-lg">
              <h1 className="text-3xl font-bold leading-[40px] text-text">
                페이지를 찾을 수 없습니다.
              </h1>
              <p className="text-lg font-medium leading-[24px] text-text-muted">
                페이지가 존재하지 않거나 사용할 수 없는 페이지입니다. 웹 주소가
                올바른지 확인해 주세요.
              </p>
            </div>
          </div>
          <div className="flex gap-sm">
            <FlexibleButton
              variant="blue"
              size="L"
              width="200px"
              onClick={() => navigate('/')}
            >
              메인으로
            </FlexibleButton>
            <FlexibleButton
              variant="white"
              size="L"
              width="200px"
              onClick={() => navigate(-1)}
            >
              이전 페이지
            </FlexibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
