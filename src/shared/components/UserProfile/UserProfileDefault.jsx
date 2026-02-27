// 기본 프로필

import defaultImg from '../../../asset/images/UserProfileDefault.png'

function UserProfileDefault({ className = '' }) {
  return (
    <img
      src={defaultImg}
      alt="기본 프로필"
      className={`w-[130px] h-[130px] rounded-full border border-border ${className}`}
    />
  )
}

export default UserProfileDefault