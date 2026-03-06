import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useUserData from '../features/profile/hooks/useUserData'
import { saveProfile } from '../features/profile/api'
import { uploadImage } from '../features/file/api'
import EditProfileInputBox from '../atoms/Input/EditProfileInputBox'
import InputBox from '../atoms/Input/InputBox'
import Dropdown from '../atoms/DropdownSelect/Dropdown'
import TagInputField from '../shared/components/TagInputField/TagInputField'
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder'
import Button from '../atoms/Button/Button'
import { REGION_OPTIONS } from '../constants/regions'
import { ALL_TAGS } from '../constants/tags'

const EMPTY_PROFILE = {
  nickname: '',
  name: '',
  phone: '',
  github_username: '',
  preferred_region: null,
  introduction: '',
  tag: [],
}

export default function ProfileCreatePage() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const { form, handleField, selectedTags, toggleTag, removeTag } = useUserData(EMPTY_PROFILE)
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const isValid = form.name.trim() && form.nickname.trim() && form.phone.trim()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setSubmitError('')
    setIsLoading(true)
    try {
      let imageUrl = null
      if (profileImage) {
        const { data: imgData } = await uploadImage(profileImage)
        imageUrl = imgData.image_url
      }

      const body = {
        name: form.name,
        nickname: form.nickname,
        phone: form.phone,
      }
      if (form.introduction) body.introduction = form.introduction
      if (form.github) body.github_username = form.github
      if (imageUrl) body.profile_img = imageUrl
      if (form.region) body.preferred_region = { id: form.region }
      if (selectedTags.length > 0) body.tag = selectedTags.map((t) => ({ id: t.id, name: t.name }))

      await saveProfile(userId, body)
      navigate('/')
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data
      if (status === 409) {
        setSubmitError(data?.error || '닉네임 또는 전화번호가 이미 사용 중입니다.')
      } else {
        setSubmitError(data?.error || '프로필 저장에 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto py-[60px] px-xl">
      <h1 className="text-[30px] font-bold leading-[40px] text-text mb-xs">프로필 설정</h1>
      <p className="text-sm text-text-muted mb-[30px]">
        정회원이 되어 스터디를 시작하세요.
      </p>

      <div className="flex flex-col gap-[30px]">
        {/* 프로필 이미지 */}
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {previewUrl ? (
            <button onClick={() => fileInputRef.current?.click()} className="relative w-[130px] h-[130px] rounded-full overflow-hidden border border-border cursor-pointer">
              <img src={previewUrl} alt="프로필 미리보기" className="w-full h-full object-cover" />
            </button>
          ) : (
            <UserProfileLPlaceholder onClick={() => fileInputRef.current?.click()} />
          )}
        </div>

        {/* 입력 필드 */}
        <div className="flex flex-col gap-5">
          <EditProfileInputBox
            label="닉네임"
            required
            labelWidth="52px"
            value={form.nickname}
            onChange={handleField('nickname')}
            placeholder="닉네임을 입력하세요"
          />
          <EditProfileInputBox
            label="이름"
            required
            labelWidth="52px"
            value={form.name}
            onChange={handleField('name')}
            placeholder="이름을 입력하세요"
          />
          <EditProfileInputBox
            label="전화번호"
            required
            labelWidth="52px"
            value={form.phone}
            onChange={handleField('phone')}
            placeholder="010-0000-0000"
          />
          <EditProfileInputBox
            label="GitHub"
            labelWidth="52px"
            value={form.github}
            onChange={handleField('github')}
            placeholder="GitHub 사용자명"
          />

          {/* 선호 지역 */}
          <div className="flex items-center gap-[64px]">
            <span className="text-sm text-text shrink-0" style={{ minWidth: '52px' }}>선호 지역</span>
            <Dropdown
              options={REGION_OPTIONS}
              value={form.region}
              onChange={handleField('region')}
              placeholder="지역을 선택하세요"
              width="282px"
            />
          </div>

          {/* 소개 */}
          <div className="flex items-start gap-[64px]">
            <span className="text-sm text-text shrink-0 pt-2" style={{ minWidth: '52px' }}>소개</span>
            <InputBox
              value={form.introduction}
              onChange={handleField('introduction')}
              placeholder="자기소개를 입력하세요"
              maxLength={200}
              width="600px"
            />
          </div>

          {/* 관심 태그 */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-text">관심 태그</span>
            <TagInputField
              options={ALL_TAGS}
              selectedTags={selectedTags}
              onAdd={toggleTag}
              onRemove={removeTag}
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {submitError && (
          <p className="text-sm text-error">{submitError}</p>
        )}

        {/* 시작하기 버튼 */}
        <div className="flex justify-end">
          <Button
            variant="blue"
            size="M"
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
          >
            시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
