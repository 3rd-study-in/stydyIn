// 프로필 설정 전 상태

import Image from '../../../asset/icons/common/icon-Image.svg'

function UserProfileLPlaceholder({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-[130px] h-[130px] rounded-full bg-bg-muted border border-border cursor-pointer ${className}`}
    >
      <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center">
        <img src={Image} alt="이미지 추가" className="w-[26px] h-[26px]" />
      </div>
    </button>
  )
}

export default UserProfileLPlaceholder