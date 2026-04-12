const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '01cd2af677cc41c3cc14e03973279fc3';

// Detect if question is location-related
export function isLocationQuery(text) {
  const keywords = ['어디','찾아줘','위치','주소','근처','맛집',
    '식당','병원','약국','마트','카페','호텔','숙소','가게',
    '있어','알려줘','추천','찾기','어떻게 가','가까운','검색',
    '지도','찾고싶어','알고싶어','어떤곳','한국식당','한식',
    '이우','베이위안','단시로','초솔로','푸텐','커피','빵집',
    '편의점','세탁','미용실','네일','마사지'];
  return keywords.some(k => text.includes(k));
}

// Search Amap places
export async function searchAmapPlaces(keyword, city = '义乌') {
  try {
    const res = await fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&keywords=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}&output=JSON&offset=8&extensions=all`
    );
    const data = await res.json();
    if (data.status === '1' && data.pois?.length > 0) {
      return data.pois.map(p => ({
        name: p.name,
        address: p.address,
        tel: p.tel,
        rating: p.biz_ext?.rating || '',
        opentime: p.biz_ext?.open_time || '',
        location: p.location,
        type: p.type,
      }));
    }
    return [];
  } catch (e) {
    return [];
  }
}

// Format results for AI prompt
export function formatAmapForPrompt(places) {
  if (!places.length) return '';
  return `\n\n[고덕지도(Amap) 실시간 검색 결과]\n` +
    places.map((p, i) =>
      `${i+1}. ${p.name} | 주소: ${p.address} | 전화: ${p.tel || '없음'} | 평점: ${p.rating || '정보없음'} | 영업시간: ${p.opentime || '정보없음'}`
    ).join('\n');
}

// Open Amap navigation
export function openAmapNavi(name, location) {
  const [lng, lat] = location.split(',');
  const webUrl = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&src=china-ai-helper&callnative=1`;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const appUrl = isIOS
    ? `iosamap://navi?sourceApplication=중국AI&lat=${lat}&lon=${lng}&dev=0&style=2`
    : `androidamap://navi?sourceApplication=중국AI&lat=${lat}&lon=${lng}&dev=0&style=2`;
  window.location.href = appUrl;
  setTimeout(() => window.open(webUrl, '_blank'), 1500);
}
