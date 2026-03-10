import { MainThumbnail } from '../../../atoms/Images/Common';

/**
 * 상세 페이지 배너 컨테이너 (겉 컨테이너 + 이미지 영역)
 * @param {string} image - 이미지 URL
 * @param {React.ReactNode} children - 내부 콘텐츠
 */
const DetailBarTopContainer = ({ image, children }) => {
  return (
    <div className="flex h-[390px] w-[1190px] overflow-hidden rounded-lg border border-border bg-bg shadow-sm">
      <div className="h-[390px] w-[390px] shrink-0 border-r border-border  bg-bg-muted">
        <img
          src={image || MainThumbnail}
          alt="Study Thumbnail"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-[30px]">{children}</div>
    </div>
  );
};

export default DetailBarTopContainer;
