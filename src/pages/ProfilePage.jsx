import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import GNB from '../shared/components/Header/GNB';
import Footer from '../shared/components/Footer/Footer';
import MypageSideNav from '../shared/components/MypageSideNav';
import MypageProfileCard from '../atoms/Card/MypageProfileCard';
import MypageProfileInfoBox from '../atoms/Card/MypageProfileInfoBox';
import Button from '../atoms/Button/Button';
import Icon from '../atoms/Icon/Common/Icon';
import { TagSize } from '../atoms/Tag';
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder';
import StudyListCard from '../shared/components/Cards/StudyListCard';
import NoContents from '../shared/components/NoContents/NoContents';
import NotificationItem from '../atoms/NotificationItem/NotificationItem';
import TagInputField from '../shared/components/TagInputField/TagInputField';
import GitHubContributions from '../shared/components/GitHub/GitHubContributions';

import useNotificationStore from '../stores/notificationStore';
import { ALL_TAGS, STUDY_TABS } from '../constants/tags';
import useUserData from '../features/profile/hooks/useUserData';
import useGeoLocation from '../features/location/hooks/useGeoLocation';
import {
  getProfile,
  saveProfile,
  checkNicknameAvailability,
  checkPhoneAvailability,
} from '../features/profile/api';
import { MEDIA_URL } from '../constants/api';
import { uploadImage } from '../features/file/api';
import {
  getMyStudies,
  getMyParticipatingStudies,
  getLikedStudies,
} from '../features/study/api';

const inputClass =
  'h-10 px-3 border border-border rounded-md text-sm text-text w-[282px] placeholder:text-text-disabled outline-none focus:border-2 focus:border-info bg-white';

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
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // 닉네임 중복 확인
  const [nicknameStatus, setNicknameStatus] = useState('idle');
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const originalNickname = profile?.nickname ?? '';

  useEffect(() => {
    if (!isEditing) return;
    if (!form.nickname.trim()) {
      setNicknameStatus('idle');
      return;
    }
    // 원래 닉네임과 동일하면 체크 불필요
    if (form.nickname.trim() === originalNickname) {
      setNicknameStatus('available');
      return;
    }
    setNicknameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        await checkNicknameAvailability(form.nickname.trim());
        setNicknameStatus('available');
      } catch (err) {
        const status = err.response?.status;
        if (status === 409) {
          setNicknameStatus('taken');
        } else {
          setNicknameStatus('idle');
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.nickname, isEditing]);

  // 전화번호 인증
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneVerify = async () => {
    setPhoneError('');
    setIsPhoneChecking(true);
    try {
      await checkPhoneAvailability(form.phone);
      setIsPhoneVerified(true);
    } catch (err) {
      const status = err.response?.status;
      if (status === 409 || status === 400) {
        setPhoneError('이미 사용 중인 전화번호입니다.');
      } else {
        setIsPhoneVerified(true);
      }
    } finally {
      setIsPhoneChecking(false);
    }
  };

  // 선호 지역
  const [regionLabel, setRegionLabel] = useState(
    profile?.preferred_region?.location ?? '',
  );
  const { detectRegion, setConsent, consent, isDetecting } = useGeoLocation();

  const handleDetectRegion = async () => {
    setConsent(true);
    try {
      const region = await detectRegion();
      handleField('region')(region.id);
      setRegionLabel(region.location);
    } catch {
      // geoError는 훅 내부에서 세팅됨
    }
  };

  // GitHub 잔디
  const [connectedGithub, setConnectedGithub] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const enterEditMode = () => {
    setIsEditing(true);
    setNicknameStatus('available'); // 현재 닉네임은 사용 가능 상태로 시작
    setNicknameTouched(false);
    // 전화번호가 원래 값과 동일하면 인증 완료 상태로 시작
    setIsPhoneVerified(true);
    setPhoneError('');
    setConnectedGithub(profile?.github_username ?? '');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveError('');
    setNicknameStatus('idle');
    setNicknameTouched(false);
    setIsPhoneVerified(false);
    setPhoneError('');
    setConnectedGithub('');
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
      <div className="flex flex-col gap-6 p-[40px] w-full">
        {/* 프로필 이미지 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="flex justify-center">
          {previewUrl || profile.profile_img ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32.5 h-32.5 rounded-full overflow-hidden border border-border cursor-pointer"
            >
              <img
                src={
                  previewUrl ??
                  (profile.profile_img
                    ? profile.profile_img.startsWith('http')
                      ? profile.profile_img
                      : `${MEDIA_URL}${profile.profile_img}`
                    : undefined)
                }
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

        {/* 닉네임 */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-full max-w-80">
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => handleField('nickname')(e.target.value)}
              onBlur={() => setNicknameTouched(true)}
              placeholder="별명을 입력해 주세요."
              className={`w-full border-b-2 outline-none text-lg text-text text-center pb-1 placeholder:text-secondary bg-transparent ${
                nicknameTouched && !form.nickname.trim()
                  ? 'border-error'
                  : nicknameStatus === 'taken'
                    ? 'border-error'
                    : nicknameStatus === 'available'
                      ? 'border-primary'
                      : 'border-border focus:border-info'
              }`}
            />
            <span className="absolute right-0 pb-1 bottom-1.5">
              <Icon
                name={nicknameStatus === 'available' ? 'CheckFill' : 'Check'}
                size={20}
                color={
                  nicknameStatus === 'available'
                    ? 'var(--color-primary)'
                    : 'var(--color-secondary-light)'
                }
              />
            </span>
          </div>
          {nicknameTouched && !form.nickname.trim() ? (
            <p className="text-sm text-error">*별명은 필수 입력 항목입니다.</p>
          ) : nicknameStatus === 'taken' ? (
            <p className="text-sm text-error">
              *이미 존재하는 별명입니다. 다른 별명을 입력해주세요.
            </p>
          ) : null}
        </div>

        {/* 소개 */}
        <div className="items-center flex flex-col">
          <textarea
            value={form.introduction}
            onChange={(e) => handleField('introduction')(e.target.value)}
            placeholder="소개를 입력해 주세요."
            maxLength={80}
            rows={3}
            className="w-150 h-18 border border-border rounded-md p-4 text-sm text-text placeholder:text-text-disabled outline-none focus:border-info resize-none"
          />
          <p className="w-150 text-right text-xs mt-md text-text-muted">
            {form.introduction?.length ?? 0}/80
          </p>
        </div>

        <hr className="border-border" />

        {/* 이메일 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text font-bold w-24 shrink-0">
            이메일(ID)
          </span>
          <span className="flex-1 h-10 flex items-center text-sm text-secondary-dark">
            {profile.email}
          </span>
        </div>

        {/* 이름 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text font-bold w-24 shrink-0">
            이름 <span className="text-error">*</span>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleField('name')(e.target.value)}
            placeholder="이름을 입력하세요"
            className={inputClass}
          />
        </div>

        {/* 전화번호 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text font-bold w-24 shrink-0">
              전화번호 <span className="text-error">*</span>
            </span>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => {
                handleField('phone')(e.target.value);
                setIsPhoneVerified(false);
                setPhoneError('');
              }}
              disabled={isPhoneVerified}
              className="w-70.5 h-10 px-3 border border-border rounded-md text-sm text-text placeholder:text-text-disabled outline-none focus:border-2 focus:border-info bg-white disabled:bg-bg-muted disabled:text-text-muted disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handlePhoneVerify}
              disabled={
                !form.phone.trim() || isPhoneVerified || isPhoneChecking
              }
              className="h-10 px-5 w-30 border border-border rounded-md text-sm text-white bg-secondary-light disabled:cursor-not-allowed shrink-0"
            >
              {isPhoneChecking
                ? '확인 중...'
                : isPhoneVerified
                  ? '인증완료'
                  : '인증'}
            </button>
          </div>
          {phoneError && (
            <p className="text-xs text-error ml-28">{phoneError}</p>
          )}
        </div>

        {/* 선호 지역 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text font-bold w-24 shrink-0">
            내 지역
          </span>
          <input
            type="text"
            readOnly
            value={regionLabel}
            className="w-71 h-10 px-3 border border-border rounded-md text-sm text-text bg-bg-muted cursor-default outline-none"
          />
          <button
            type="button"
            onClick={handleDetectRegion}
            disabled={isDetecting}
            className="h-10 px-5 w-30 border border-border rounded-md text-sm text-text bg-white hover:bg-bg-muted disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isDetecting ? '인증 중...' : '인증'}
          </button>
        </div>
        <div className="flex items-center gap-2 ml-28">
          <span className="text-sm text-text-muted">위치 공유</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="locationConsent"
              checked={consent === true}
              onChange={() => setConsent(true)}
              className="accent-primary"
            />
            <span className="text-sm text-text">동의</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="locationConsent"
              checked={consent === false}
              onChange={() => setConsent(false)}
              className="accent-primary"
            />
            <span className="text-sm text-text">미동의</span>
          </label>
        </div>

        {/* GitHub */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text font-bold w-24 shrink-0">
              GitHub
              <br />
              User Name
            </span>
            <input
              type="text"
              value={form.github}
              onChange={(e) => {
                handleField('github')(e.target.value);
                setConnectedGithub('');
              }}
              placeholder="GitHub 사용자명"
              className="w-70.5 h-10 px-3 border border-border rounded-md text-sm text-text placeholder:text-text-disabled outline-none focus:border-2 focus:border-info bg-white"
            />
            <button
              type="button"
              onClick={() => setConnectedGithub(form.github.trim())}
              disabled={!form.github.trim()}
              className={`h-10 px-5 w-30 border rounded-md text-sm text-white shrink-0 disabled:cursor-not-allowed ${
                form.github.trim()
                  ? 'bg-primary border-primary'
                  : 'bg-secondary-light border-border'
              }`}
            >
              잔디 연동
            </button>
          </div>
          <div className="ml-26">
            <GitHubContributions username={connectedGithub} />
          </div>
        </div>

        {/* 관심 태그 */}
        <div>
          <span className="text-sm font-bold text-text block mb-3">
            관심 분야 태그
          </span>
          <TagInputField
            options={ALL_TAGS}
            selectedTags={selectedTags}
            onAdd={toggleTag}
            onRemove={removeTag}
          />
        </div>

        {saveError && <p className="text-sm text-error">{saveError}</p>}

        {/* 버튼 */}
        <div className="flex gap-3 justify-end">
          <Button variant="white" size="M" onClick={cancelEdit}>
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
      <div className="flex justify-end w-full">
        <Button variant="white" size="S" onClick={enterEditMode}>
          수정하기
        </Button>
      </div>

      <MypageProfileCard
        hasUser={profile.is_associate_member}
        profileImage={
          profile.profile_img
            ? profile.profile_img.startsWith('http')
              ? profile.profile_img
              : `${MEDIA_URL}${profile.profile_img}`
            : undefined
        }
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
                  src={
                    study.thumbnail.startsWith('http')
                      ? study.thumbnail
                      : `${MEDIA_URL}${study.thumbnail}`
                  }
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
