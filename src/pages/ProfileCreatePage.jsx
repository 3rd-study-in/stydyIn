import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useUserData from '../features/profile/hooks/useUserData';
import { saveProfile } from '../features/profile/api';
import { uploadImage } from '../features/file/api';
import TagInputField from '../shared/components/TagInputField/TagInputField';
import UserProfileLPlaceholder from '../shared/components/UserProfile/UserProfileLPlaceholder';
import Button from '../atoms/Button/Button';
import useGeoLocation from '../features/location/hooks/useGeoLocation';
import { ALL_TAGS } from '../constants/tags';

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
  'flex-1 h-10 px-3 border border-border rounded-lg text-sm text-text placeholder:text-text-disabled outline-none focus:border-2 focus:border-info bg-white';

export default function ProfileCreatePage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const { form, handleField, selectedTags, toggleTag, removeTag } =
    useUserData(EMPTY_PROFILE);
  const { detectRegion, setConsent, consent, isDetecting, geoError } = useGeoLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [regionLabel, setRegionLabel] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const isValid = form.name.trim() && form.nickname.trim() && form.phone.trim();

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
        <div className="flex justify-center">
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => handleField('nickname')(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full max-w-80 border-b-2 border-border focus:border-info outline-none text-base text-text text-center pb-2 placeholder:text-text-disabled bg-transparent"
          />
        </div>

        {/* 소개 */}
        <div className="items-center flex flex-col">
          <textarea
            value={form.introduction}
            onChange={(e) => handleField('introduction')(e.target.value)}
            placeholder="소개를 입력해 주세요."
            maxLength={80}
            rows={3}
            className="w-[600px] border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-disabled outline-none focus:border-info resize-none"
          />
          <p className="text-right text-xs text-text-muted">
            {form.introduction?.length ?? 0}/80
          </p>
        </div>

        <hr className="border-border" />

        {/* 이름 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-text w-24 shrink-0">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-text w-24 shrink-0">
            전화번호 <span className="text-error">*</span>
          </span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleField('phone')(e.target.value)}
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </div>

        {/* 내 지역 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-text w-24 shrink-0">내 지역</span>
          <input
            type="text"
            readOnly
            value={regionLabel}
            placeholder="인증 버튼을 눌러 위치를 감지하세요"
            className="flex-1 h-10 px-3 border border-border rounded-lg text-sm text-text placeholder:text-text-disabled bg-bg-muted cursor-default outline-none"
          />
          <button
            type="button"
            onClick={handleDetectRegion}
            disabled={isDetecting}
            className="h-10 px-5 border border-border rounded-lg text-sm text-text bg-white hover:bg-bg-muted disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isDetecting ? '감지 중...' : '인증'}
          </button>
        </div>
        <div className="flex items-center gap-2 ml-28">
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
          <span className="text-xs text-text-muted">{consent ? '동의' : '미동의'}</span>
        </div>
        {geoError && (
          <p className="text-xs text-error -mt-3 ml-28">{geoError}</p>
        )}

        {/* GitHub */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-text w-24 shrink-0">GitHub</span>
          <input
            type="text"
            value={form.github}
            onChange={(e) => handleField('github')(e.target.value)}
            placeholder="GitHub 사용자명"
            className={inputClass}
          />
        </div>

        <hr className="border-border" />

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
  );
}
