import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import GNB from '../shared/components/Header/GNB';
import Footer from '../shared/components/Footer/Footer';
import MypageSideNav from '../shared/components/MypageSideNav';
import MypageProfileCard from '../atoms/Card/MypageProfileCard';
import MypageProfileInfoBox from '../atoms/Card/MypageProfileInfoBox';
import Button from '../atoms/Button/Button';
import EditProfileInputBox from '../atoms/Input/EditProfileInputBox';
import InputBox from '../atoms/Input/InputBox';
import { TagSize, TagM2 } from '../atoms/Tag';
import Dropdown from '../atoms/DropdownSelect/Dropdown';
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder';
import StudyListCard from '../shared/components/Cards/StudyListCard';
import NoContents from '../shared/components/NoContents/NoContents';
import NotificationItem from '../atoms/NotificationItem/NotificationItem';

import useNotificationStore from '../stores/notificationStore';
import useGeoLocation from '../features/location/hooks/useGeoLocation';
import { REGION_OPTIONS } from '../constants/regions';
import { ALL_TAGS, STUDY_TABS } from '../constants/tags';
import useUserData from '../features/profile/hooks/useUserData';
import { getProfile, saveProfile } from '../features/profile/api';
import { MEDIA_URL } from '../constants/api';
import { uploadImage } from '../features/file/api';
import {
  getMyStudies,
  getMyParticipatingStudies,
  getLikedStudies,
} from '../features/study/api';

const STUDY_STATUS_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  '모집 완료': 'completed',
  종료: 'closed',
};

// ─── 내 프로필 탭 ─────────────────────────────────────────────────────────────

function ProfileTab({ profile, userId, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const { form, handleField, selectedTags, toggleTag, removeTag } =
    useUserData(profile);
  const { consent, setConsent } = useGeoLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      let imageUrl = null;
      if (profileImage) {
        const { data: imgData } = await uploadImage(profileImage);
        imageUrl = imgData.image_url;
      }

      const body = {
        name: form.name,
        nickname: form.nickname,
        phone: form.phone,
      };
      if (form.introduction) body.introduction = form.introduction;
      if (form.github) body.github_username = form.github;
      if (imageUrl) body.profile_img = imageUrl;
      if (form.region) body.preferred_region = { id: form.region };
      if (selectedTags.length > 0)
        body.tag = selectedTags.map((t) => ({ id: t.id, name: t.name }));

      const { data } = await saveProfile(userId, body);
      onProfileUpdated(data);
      setIsEditing(false);
      setProfileImage(null);
      setPreviewUrl(null);
    } catch (err) {
      setSaveError(err.response?.data?.error || '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 수정 모드
  if (isEditing) {
    return (
      <div className="flex flex-col gap-[30px] p-[40px] w-full">
        {/* 프로필 이미지 */}
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {previewUrl || profile.profile_img ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-[130px] h-[130px] rounded-full overflow-hidden border border-border"
            >
              <img
                src={previewUrl ?? (profile.profile_img ? (profile.profile_img.startsWith('http') ? profile.profile_img : `${MEDIA_URL}${profile.profile_img}`) : undefined)}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <UserProfileLPlaceholder
              onClick={() => fileInputRef.current?.click()}
            />
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
            <span
              className="text-sm text-text shrink-0"
              style={{ minWidth: '52px' }}
            >
              선호 지역
            </span>
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
            <span
              className="text-sm text-text shrink-0 pt-2"
              style={{ minWidth: '52px' }}
            >
              소개
            </span>
            <InputBox
              value={form.introduction}
              onChange={handleField('introduction')}
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
                const selected = selectedTags.some((t) => t.id === tag.id);
                return (
                  <TagSize
                    key={tag.id}
                    size="M"
                    variant={selected ? 'blue' : 'lightgray'}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </TagSize>
                );
              })}
            </div>
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

        {saveError && <p className="text-sm text-error">{saveError}</p>}

        {/* 버튼 */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="white"
            size="M"
            onClick={() => {
              setIsEditing(false);
              setSaveError('');
            }}
          >
            취소
          </Button>
          <Button
            variant="blue"
            size="M"
            disabled={isSaving}
            onClick={handleSave}
          >
            저장하기
          </Button>
        </div>
      </div>
    );
  }

  // 뷰 모드
  return (
    <div className="flex flex-col items-center gap-[30px] p-[40px] w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">위치 공유</span>
          <button
            type="button"
            onClick={() => setConsent(!consent)}
            className={`relative w-10 h-5 rounded-full transition-colors ${consent ? 'bg-primary' : 'bg-border'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${consent ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-xs text-text-muted">
            {consent ? '동의' : '미동의'}
          </span>
        </div>
        <Button variant="white" size="S" onClick={() => setIsEditing(true)}>
          수정하기
        </Button>
      </div>

      <MypageProfileCard
        hasUser={profile.is_associate_member}
        profileImage={profile.profile_img ? (profile.profile_img.startsWith('http') ? profile.profile_img : `${MEDIA_URL}${profile.profile_img}`) : undefined}
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
        interestSlot={profile.tag?.map((t) => (
          <TagSize key={t.id} size="M">
            {t.name}
          </TagSize>
        ))}
      >
        {profile.introduction}
      </MypageProfileInfoBox>
    </div>
  );
}

// ─── 내 스터디 탭 ─────────────────────────────────────────────────────────────

function StudyTab() {
  const navigate = useNavigate();
  const [activeStudyTab, setActiveStudyTab] = useState('created');
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetcher =
      activeStudyTab === 'created'
        ? getMyStudies
        : activeStudyTab === 'joined'
          ? getMyParticipatingStudies
          : getLikedStudies;

    fetcher()
      .then((res) => setStudies(Array.isArray(res.data) ? res.data : []))
      .catch(() => setStudies([]))
      .finally(() => setLoading(false));
  }, [activeStudyTab]);

  return (
    <div className="flex flex-col px-[55px] w-full">
      {/* 탭 필터 */}
      <div className="flex gap-[14px] my-[30px]">
        {STUDY_TABS.map(({ key, label }) => (
          <TagSize
            key={key}
            size="L"
            variant={activeStudyTab === key ? 'blue' : 'lightgray'}
            onClick={() => setActiveStudyTab(key)}
          >
            {label}
          </TagSize>
        ))}
      </div>

      {loading ? (
        <div className="py-5xl flex justify-center">
          <span className="text-text-muted text-sm">불러오는 중...</span>
        </div>
      ) : studies.length === 0 ? (
        <NoContents
          title="스터디가 없습니다"
          description="아직 등록된 스터디가 없어요."
          buttonText="스터디 만들기"
          onButtonClick={() => navigate('/study/create')}
        />
      ) : (
        <div className="flex flex-wrap justify-between gap-y-[30px]">
          {studies.map((study) => (
            <StudyListCard
              key={study.id}
              status={
                STUDY_STATUS_MAP[study.study_status?.name] ?? 'recruiting'
              }
              location={
                study.is_offline ? study.study_location?.location : null
              }
              category={study.subject?.name}
              difficulty={study.difficulty?.name}
              title={study.title}
              currentCount={study.participant_count}
              isLiked={study.user_liked}
              onClick={() => navigate(`/study/${study.id}`)}
            >
              {study.thumbnail ? (
                <img
                  src={study.thumbnail}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bg-muted" />
              )}
            </StudyListCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 알림 탭 ──────────────────────────────────────────────────────────────────

function NotificationTab() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const deleteOne = useNotificationStore((s) => s.deleteOne);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const unreadCount = notifications.filter((n) => !n.checked).length;

  return (
    <div className="flex flex-col gap-5 p-[40px] w-full">
      <h2 className="text-2xl font-bold text-text font-sans">
        확인하지 않은 알림 {unreadCount}개
      </h2>
      {notifications.length === 0 ? (
        <p className="text-base text-text-disabled mt-4">알림이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3 mt-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.notification_id}
              text={n.content}
              time={n.created}
              onClose={() => deleteOne(n.notification_id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

function ProfilePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getProfile(userId)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <main className="flex flex-row gap-[30px] w-[1190px] max-w-[1560px] mx-auto mt-[40px] pb-10">
      <MypageSideNav activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="w-[990px] border border-border rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-text-muted text-sm">불러오는 중...</span>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && profile && (
              <ProfileTab
                profile={profile}
                userId={userId}
                onProfileUpdated={setProfile}
              />
            )}
            {activeTab === 'study' && <StudyTab />}
            {activeTab === 'notification' && <NotificationTab />}
          </>
        )}
      </section>
    </main>

  );
}

export default ProfilePage;
