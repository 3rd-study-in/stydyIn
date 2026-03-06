import { useState } from 'react';
import { getRegions } from '../../auth/api';

// 카카오 지도 coord2RegionCode 응답의 시/도명 → 백엔드 지역명 매핑
const KAKAO_REGION_MAP = {
  '서울특별시': '서울',
  '경기도': '경기',
  '인천광역시': '인천',
  '부산광역시': '부산',
  '대구광역시': '대구',
  '광주광역시': '광주',
  '대전광역시': '대전',
  '울산광역시': '울산',
  '세종특별자치시': '세종',
  '강원특별자치도': '강원',
  '강원도': '강원',
  '충청북도': '충북',
  '충청남도': '충남',
  '전북특별자치도': '전북',
  '전라북도': '전북',
  '전라남도': '전남',
  '경상북도': '경북',
  '경상남도': '경남',
  '제주특별자치도': '제주',
};

function useGeoLocation() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [consent, setConsentState] = useState(
    () => localStorage.getItem('geo_consent') === 'true',
  );

  const setConsent = (value) => {
    localStorage.setItem('geo_consent', value ? 'true' : 'false');
    setConsentState(value);
  };

  // Promise<{ id, location }> 반환. 실패 시 reject
  const detectRegion = () =>
    new Promise((resolve, reject) => {
      if (!consent) {
        setGeoError('프로필에서 위치 정보 공개에 동의해주세요.');
        reject(new Error('NO_CONSENT'));
        return;
      }
      if (!navigator.geolocation) {
        setGeoError('이 브라우저는 위치 정보를 지원하지 않습니다.');
        reject(new Error('NOT_SUPPORTED'));
        return;
      }

      setIsDetecting(true);
      setGeoError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.coord2RegionCode(lng, lat, async (result, status) => {
            if (status !== window.kakao.maps.services.Status.OK) {
              setIsDetecting(false);
              setGeoError('위치를 지역으로 변환하는데 실패했습니다.');
              reject(new Error('GEOCODE_FAILED'));
              return;
            }

            const area =
              result.find((r) => r.region_type === 'H') ?? result[0];
            const shortName =
              KAKAO_REGION_MAP[area?.region_1depth_name] ??
              area?.region_1depth_name;

            try {
              const regions = await getRegions().then((r) => r.data);
              const matched = regions.find((r) => r.location === shortName);
              setIsDetecting(false);
              if (matched) {
                resolve(matched);
              } else {
                setGeoError('현재 위치의 지역을 찾을 수 없습니다.');
                reject(new Error('NO_MATCH'));
              }
            } catch {
              setIsDetecting(false);
              setGeoError('지역 정보를 가져오는데 실패했습니다.');
              reject(new Error('REGIONS_FETCH_FAILED'));
            }
          });
        },
        () => {
          setIsDetecting(false);
          setGeoError('위치 접근이 거부되었습니다.');
          reject(new Error('PERMISSION_DENIED'));
        },
      );
    });

  return { detectRegion, consent, setConsent, isDetecting, geoError };
}

export default useGeoLocation;
