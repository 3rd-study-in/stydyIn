import { useState } from 'react';
import { getRegions } from '../../auth/api';


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
          if (!window.kakao?.maps?.load) {
            setIsDetecting(false);
            setGeoError('카카오 지도 서비스를 불러올 수 없습니다. 페이지를 새로고침해 주세요.');
            reject(new Error('KAKAO_NOT_LOADED'));
            return;
          }
          const { latitude: lat, longitude: lng } = pos.coords;

          window.kakao.maps.load(() => {
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
              const fullName = area?.region_1depth_name;

              try {
                const regions = await getRegions().then((r) => r.data);
                const matched = regions.find((r) => r.location === fullName);
                setIsDetecting(false);
                if (matched) {
                  const detailLocation =
                    area?.region_3depth_name ||
                    area?.region_2depth_name ||
                    shortName;
                  resolve({ ...matched, detailLocation });
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
