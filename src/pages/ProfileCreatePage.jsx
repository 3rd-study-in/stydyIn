import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useUserData from '../features/profile/hooks/useUserData';
import {
  saveProfile,
  checkPhoneAvailability,
  checkNicknameAvailability,
} from '../features/profile/api';
import { uploadImage } from '../features/file/api';
import TagInputField from '../shared/components/TagInputField/TagInputField';
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder';
import Button from '../atoms/Button/Button';
import useGeoLocation from '../features/location/hooks/useGeoLocation';
import { ALL_TAGS } from '../constants/tags';
import { REGION_OPTIONS } from '../constants/regions';
import GitHubContributions from '../shared/components/GitHub/GitHubContributions';
import Icon from '../atoms/Icon/Common/Icon';

const EMPTY_PROFILE = {
  nickname: '',
  name: '',
  phone: '',
  github_username: '',
  preferred_region: null,
  introduction: '',
  tag: [],
};

const inputClass =
  'h-10 px-3 border border-border rounded-md text-sm text-text w-[282px] placeholder:text-text-disabled outline-none focus:border-2 focus:border-info bg-white';

export default function ProfileCreatePage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const email = useAuthStore((s) => s.email);
  const { form, handleField, selectedTags, toggleTag, removeTag } =
    useUserData(EMPTY_PROFILE);
  const { detectRegion, setConsent, consent, isDetecting, geoError } =
    useGeoLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [regionLabel, setRegionLabel] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [connectedGithub, setConnectedGithub] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'taken'
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!form.nickname.trim()) {
      setNicknameStatus('idle');
      return;
    }
    setNicknameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        // 200: {"data": "사용 가능한 닉네임입니다."}
        await checkNicknameAvailability(form.nickname.trim());
        setNicknameStatus('available');
      } catch (err) {
        const status = err.response?.status;
        if (status === 409) {
          // 이미 존재하는 닉네임
          setNicknameStatus('taken');
        } else {
          // 400(빈 값 등) 또는 네트워크 오류 — 판별 불가
          setNicknameStatus('idle');
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.nickname]);

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
        // 체크 엔드포인트 없는 경우 등 — 일단 통과
        setIsPhoneVerified(true);
      }
    } finally {
      setIsPhoneChecking(false);
    }
  };

  const isValid =
    form.name.trim() &&
    form.nickname.trim() &&
    nicknameStatus === 'available' &&
    form.phone.trim() &&
    isPhoneVerified &&
    form.region &&
    form.github?.trim();

  const handleDetectRegion = async () => {
    try {
      const region = await detectRegion();
      const matched = REGION_OPTIONS.find((o) => o.label === region.location);
      if (matched) {
        handleField('region')(matched.value);
        setRegionLabel(matched.label);
      }
    } catch {
      // geoError는 훅 내부에서 세팅됨
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsLoading(true);
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

      await saveProfile(userId, body);
      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        setSubmitError(
          data?.error || '닉네임 또는 전화번호가 이미 사용 중입니다.',
        );
      } else {
        setSubmitError(data?.error || '프로필 저장에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[990px] mx-auto py-6xl px-6">
      <h1 className="text-3xl font-bold text-center text-text mb-2">
        프로필 설정
      </h1>

      <div className="mt-3xl border border-border p-8 flex flex-col gap-6">
        {/* 프로필 이미지 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="flex justify-center">
          {previewUrl ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32.5 h-32.5 rounded-full overflow-hidden border border-border cursor-pointer"
            >
              <img
                src={previewUrl}
                alt="프로필 미리보기"
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
        <div className="flex flex-col mt-xl items-center gap-1">
          <div className="relative w-full max-w-80">
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => handleField('nickname')(e.target.value)}
              onBlur={() => setNicknameTouched(true)}
              placeholder="별명을 입력해 주세요."
              className={`w-full border-b-2 outline-none text-regular text-lg text-text text-center pb-1 placeholder:text-secondary bg-transparent ${
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
            <p className="text-sm pt-xxs text-error">
              *별명은 필수 입력 항목입니다.
            </p>
          ) : nicknameStatus === 'taken' ? (
            <p className="text-sm pt-xxs text-error">
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
            className="w-[600px] h-[72px] border border-border rounded-md p-4 text-sm text-text placeholder:text-text-disabled outline-none focus:border-info resize-none"
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
            {email}
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
              className={`h-10 px-5 w-30 border rounded-md text-sm text-white shrink-0 disabled:cursor-not-allowed ${
                isPhoneVerified
                  ? 'bg-success border-success'
                  : form.phone.trim() && !isPhoneChecking
                    ? 'bg-primary border-primary'
                    : 'bg-secondary-light border-border'
              }`}
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

        {/* 내 지역 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text font-bold w-24 shrink-0">
              내 지역 <span className="text-error">*</span>
            </span>
            {consent === true ? (
              /* 동의: GPS 자동 감지 */
              <>
                <input
                  type="text"
                  readOnly
                  value={regionLabel}
                  placeholder="인증 버튼을 눌러 지역을 감지하세요"
                  className="w-70.5 h-10 px-3 border border-border rounded-md text-sm text-text placeholder:text-text-disabled bg-bg-muted cursor-default outline-none"
                />
                <button
                  type="button"
                  onClick={handleDetectRegion}
                  disabled={isDetecting}
                  className="h-10 px-5 w-30 border border-border rounded-md text-sm text-text bg-white hover:bg-bg-muted disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isDetecting ? '감지 중...' : '인증'}
                </button>
              </>
            ) : (
              /* 미동의: 수동 드롭다운 */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRegionDropdownOpen((o) => !o)}
                  className="w-70.5 h-10 px-3 border border-border rounded-md text-sm text-left bg-white outline-none focus:border-2 focus:border-info flex items-center justify-between"
                >
                  <span className={regionLabel ? 'text-text' : 'text-text-disabled'}>
                    {regionLabel || '지역을 선택하세요'}
                  </span>
                  <Icon name="DownArrow" size={16} color="var(--color-secondary)" />
                </button>
                {regionDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-70.5 bg-white border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {REGION_OPTIONS.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          handleField('region')(option.value);
                          setRegionLabel(option.label);
                          setRegionDropdownOpen(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-bg-muted ${
                          form.region === option.value ? 'text-primary font-medium' : 'text-text'
                        }`}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-28">
            <span className="text-sm text-text-muted">위치 공유</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="locationConsent"
                checked={consent === true}
                onChange={() => {
                  setConsent(true);
                  setRegionDropdownOpen(false);
                  handleField('region')(null);
                  setRegionLabel('');
                }}
                className="accent-primary"
              />
              <span className="text-sm text-text">동의</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="locationConsent"
                checked={consent === false}
                onChange={() => {
                  setConsent(false);
                  handleField('region')(null);
                  setRegionLabel('');
                }}
                className="accent-primary"
              />
              <span className="text-sm text-text">미동의</span>
            </label>
          </div>
          {geoError && (
            <p className="text-xs text-error ml-28">{geoError}</p>
          )}
        </div>

        {/* GitHub */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text font-bold w-24 shrink-0">
              GitHub <br />
              User Name <span className="text-error">*</span>
            </span>
            <input
              type="text"
              value={form.github}
              onChange={(e) => {
                handleField('github')(e.target.value);
                setConnectedGithub('');
              }}
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

        {submitError && <p className="text-sm text-error">{submitError}</p>}
      </div>

      <div className="flex mt-[40px] justify-center">
        <Button
          variant="blue"
          size="L"
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
