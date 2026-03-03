import { useState } from 'react'

import GNB from '../shared/components/Header/GNB'
import Footer from '../shared/components/Footer/Footer'
import MypageSideNav from '../shared/components/MypageSideNav'
import MypageProfileCard from '../atoms/Card/MypageProfileCard'
import MypageProfileInfoBox from '../atoms/Card/MypageProfileInfoBox'
import Button from '../atoms/Button/Button'
import EditProfileInputBox from '../atoms/Input/EditProfileInputBox'
import InputBox from '../atoms/Input/InputBox'
import { TagSize, TagM2 } from '../atoms/Tag'
import Dropdown from '../atoms/DropdownSelect/Dropdown'
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder'
import StudyListCard from '../shared/components/Cards/StudyListCard'
import Pagination from '../shared/components/Pagination/Pagination'
import NoContents from '../shared/components/NoContents/NoContents'
import NotificationItem from '../atoms/NotificationItem/NotificationItem'

import { MOCK_PROFILE, MOCK_STUDIES, MOCK_NOTIFICATIONS } from '../constants/mockUpData'
import { REGION_OPTIONS } from '../constants/regions'
import { ALL_TAGS, STUDY_TABS } from '../constants/tags'
import useUserData from '../features/profile/hooks/useUserData'

// ─── 내 프로필 탭 ─────────────────────────────────────────────────────────────

function ProfileTab({ profile }) {
    const [isEditing, setIsEditing] = useState(false)
    const { form, handleField, selectedTags, toggleTag, removeTag } = useUserData(profile)

    // 수정 모드
    if (isEditing) {
        return (
            <div className="flex flex-col gap-[30px] p-[40px] w-full">
                {/* 프로필 이미지 */}
                <div className="flex justify-center">
                    <UserProfileLPlaceholder onClick={() => { }} />
                </div>

                {/* 입력 필드 */}
                <div className="flex flex-col  gap-5 ">
                    <EditProfileInputBox label="닉네임" value={form.nickname} onChange={handleField('nickname')} placeholder="닉네임을 입력하세요" />
                    <EditProfileInputBox label="이름" required value={form.name} onChange={handleField('name')} placeholder="이름을 입력하세요" />
                    <EditProfileInputBox label="전화번호" required value={form.phone} onChange={handleField('phone')} placeholder="010-0000-0000" />
                    <EditProfileInputBox label="GitHub" value={form.github} onChange={handleField('github')} placeholder="GitHub 사용자명" />

                    {/* 선호 지역 */}
                    <div className="flex items-center gap-[64px]">
                        <span className="text-sm text-text shrink-0">선호 지역</span>
                        <Dropdown
                            options={REGION_OPTIONS}
                            value={form.region}
                            onChange={handleField('region')}
                            placeholder="지역을 선택하세요"
                            width="282px"
                        />
                    </div>

                    {/* 소개글 */}
                    <div className="flex items-start gap-[64px]">
                        <span className="text-sm text-text shrink-0 pt-2">소개</span>
                        <InputBox
                            value={form.introduction}
                            onChange={(e) => handleField('introduction')(e.target.value)}
                            placeholder="자기소개를 입력하세요"
                            maxLength={200}
                            width="600px"
                        />
                    </div>

                    {/* 관심 태그 선택 */}
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-text">관심 태그</span>
                        <div className="flex flex-wrap gap-2">
                            {ALL_TAGS.map((tag) => {
                                const selected = selectedTags.some((t) => t.id === tag.id)
                                return (
                                    <TagSize
                                        key={tag.id}
                                        size="M"
                                        variant={selected ? 'blue' : 'lightgray'}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag.name}
                                    </TagSize>
                                )
                            })}
                        </div>
                        {/* 선택된 태그 (제거 버튼 포함) */}
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedTags.map((tag) => (
                                    <TagM2 key={tag.id} onRemove={() => removeTag(tag.id)}>
                                        {tag.name}
                                    </TagM2>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 justify-end">
                    <Button variant="white" size="M" onClick={() => setIsEditing(false)}>취소</Button>
                    <Button variant="blue" size="M" onClick={() => setIsEditing(false)}>저장하기</Button>
                </div>
            </div>
        )
    }

    // 뷰 모드
    return (
        <div className="flex flex-col items-center gap-[30px] p-[40px] w-full">
            <div className="flex justify-end w-full">
                <Button variant="white" size="S" onClick={() => setIsEditing(true)}>수정하기</Button>
            </div>

            <MypageProfileCard
                hasUser={!profile.is_associate_member}
                profileImage={profile.profile_img}
                nickname={profile.nickname}
            >
                {profile.introduction}
            </MypageProfileCard>

            <MypageProfileInfoBox
                email={profile.email}
                name={profile.name}
                phone={profile.phone}
                location={profile.preferred_region?.location}
                github={profile.github_username}
                interestSlot={profile.tag.map((t) => (
                    <TagSize key={t.id} size="M">{t.name}</TagSize>
                ))}
            >
                {profile.introduction}
            </MypageProfileInfoBox>
        </div>
    )
}

// ─── 내 스터디 탭 ─────────────────────────────────────────────────────────────

function StudyTab() {
    const [activeStudyTab, setActiveStudyTab] = useState('created')
    const [currentPage, setCurrentPage] = useState(1)
    const studies = MOCK_STUDIES

    return (
        <div className="flex flex-col  px-[55px] w-full">
            {/* 탭 필터 */}
            <div className="flex gap-[14px] my-[30px]">
                {STUDY_TABS.map(({ key, label }) => (
                    <TagSize
                        key={key}
                        size="L"
                        variant={activeStudyTab === key ? 'blue' : 'lightgray'}
                        onClick={() => { setActiveStudyTab(key); setCurrentPage(1) }}
                    >
                        {label}
                    </TagSize>
                ))}
            </div>

            {studies.length === 0 ? (
                <NoContents
                    title="스터디가 없습니다"
                    description="아직 등록된 스터디가 없어요."
                    buttonText="스터디 만들기"
                    onButtonClick={() => { }}
                />
            ) : (
                <>
                    <div className="flex flex-wrap justify-between gap-y-[30px]">
                        {studies.map((study) => (
                            <StudyListCard
                                key={study.id}
                                status={study.status}
                                location={study.location}
                                category={study.category}
                                difficulty={study.difficulty}
                                title={study.title}
                                currentCount={study.currentCount}
                                onClick={() => { }}
                            />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    )
}

// ─── 알림 탭 ──────────────────────────────────────────────────────────────────

function NotificationTab() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

    const remove = (id) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id))

    return (
        <div className="flex flex-col gap-5 p-[40px] w-full">
            <h2 className="text-2xl font-bold text-text font-sans">
                확인하지 않은 알림 {notifications.length}개
            </h2>
            {notifications.length === 0 ? (
                <p className="text-base text-text-disabled mt-4">알림이 없습니다.</p>
            ) : (
                <ul className="flex flex-col gap-3 mt-2">
                    {notifications.map((n) => (
                        <NotificationItem key={n.id} text={n.text} time={n.time} onClose={() => remove(n.id)} />
                    ))}
                </ul>
            )}
        </div>
    )
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile')
    const profile = MOCK_PROFILE

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <GNB isLoggedIn={true} />

            <main className="flex flex-row gap-[30px]  w-[1190px] max-w-[1560px] mx-auto pt-[200px] pb-10">
                <MypageSideNav activeTab={activeTab} onTabChange={setActiveTab} />

                <section className="w-[990px] border border-border rounded-xl ">
                    {activeTab === 'profile' && <ProfileTab profile={profile} />}
                    {activeTab === 'study' && <StudyTab />}
                    {activeTab === 'notification' && <NotificationTab />}
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default ProfilePage
