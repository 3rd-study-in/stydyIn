// 이미지 적용된 프로필

function UserProfile({ src, alt = '프로필', className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-[130px] h-[130px] rounded-full object-cover ${className}`}
    />
  )
}

export default UserProfile