import { useState } from 'react'
import useToggleList from '../../../shared/hooks/useToggleList'

/**
 * 프로필 폼 state를 관리하는 hook
 * 어디서든 가져다 쓸 수 있도록 분리
 *
 * @param {object} profile  API 응답 프로필 객체
 * @returns {{ form, handleField, selectedTags, toggleTag, removeTag }}
 */
function useUserData(profile) {
  const [form, setForm] = useState({
    nickname:     profile.nickname,
    name:         profile.name,
    phone:        profile.phone,
    github:       profile.github_username,
    region:       profile.preferred_region?.location ?? null,
    introduction: profile.introduction,
  })

  const {
    items: selectedTags,
    toggle: toggleTag,
    remove: removeTag,
  } = useToggleList(profile.tag ?? [])

  const handleField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return { form, handleField, selectedTags, toggleTag, removeTag }
}

export default useUserData

// ── 사용 예시 ──────────────────────────────────────────────────────────────────
// import useUserData from '@/features/profile/hooks/useUserData'
//
// const { form, handleField, selectedTags, toggleTag, removeTag } = useUserData(profile)
//
// handleField('nickname')('새닉네임')    → form.nickname 업데이트
// handleField('region')('서울')          → form.region 업데이트
// toggleTag({ id: 4, name: 'React' })   → selectedTags에 없으면 추가, 있으면 제거
// removeTag(4)                           → id=4 태그 제거
