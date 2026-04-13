const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '01cd2af677cc41c3cc14e03973279fc3';

export function isLocationQuery(text) {
  const keywords = [
    '어디','찾아줘','위치','주소','근처','맛집','식당','병원',
    '약국','마트','카페','호텔','숙소','가게','있어','알려줘',
    '추천','찾기','어떻게 가','가까운','검색','지도','찾고싶어',
    '알고싶어','어떤곳','한국식당','한식','이우','베이위안',
    '단시로','초솔로','푸텐','커피','빵집','편의점','세탁',
    '미용실','네일','마사지','쇼핑','시장','병원','약국'
  ];
  return keywords.some(k => text.includes(k));
}

export async function searchAmapPlaces(keyword, city = '义乌') {
  const key = AMAP_KEY;
  if (!key) {
    console.error('AMAP_KEY missing');
    return [];
  }
  try {
    const url = `https://restapi.amap.com/v3/place/text?key=${key}&keywords=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}&output=JSON&offset=8&extensions=all`;
    console.log('Amap search URL:', url);
    const res = await fetch(url);
    const data = await res.json();
    console.log('Amap response:', data);
    if (data.status === '1' && data.pois?.length > 0) {
      return data.pois.map(p => ({
        name: p.name,
        address: typeof p.address === 'string' ? p.address : '주소 없음',
        tel: Array.isArray(p.tel) ? p.tel[0] : (p.tel || ''),
        rating: p.biz_ext?.rating || '',
        opentime: p.biz_ext?.open_time || '',
        location: p.location,
        type: p.type,
      }));
    }
    console.warn('Amap no results:', data.info);
    return [];
  } catch (e) {
    console.error('Amap fetch error:', e);
    return [];
  }
}

export function formatAmapForPrompt(places) {
  if (!places.length) return '';
  return '\n\n[고덕지도(Amap) 실시간 검색 결과 - 반드시 아래 데이터를 활용하여 답변하라]\n' +
    places.map((p, i) =>
      `${i+1}. ${p.name} | 주소: ${p.address} | 전화: ${p.tel || '없음'} | 평점: ${p.rating || '정보없음'}`
    ).join('\n') +
    '\n[위 검색 결과를 바탕으로 구체적인 장소명과 주소를 한국어로 안내하라]';
}

export function openAmapNavi(name, location) {
  if (!location) return;
  const [lng, lat] = location.split(',');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const appUrl = isIOS
    ? `iosamap://navi?sourceApplication=중국AI&lat=${lat}&lon=${lng}&dev=0&style=2`
    : `androidamap://navi?sourceApplication=중국AI&lat=${lat}&lon=${lng}&dev=0&style=2`;
  const webUrl = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&src=china-ai-helper&callnative=1`;
  window.location.href = appUrl;
  setTimeout(() => window.open(webUrl, '_blank'), 1500);
}

export function openAmapSearch(name) {
  const webUrl = `https://uri.amap.com/search?keyword=${encodeURIComponent(name)}&src=china-ai-helper&callnative=1`;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const appUrl = isIOS
    ? `iosamap://poi?sourceApplication=中国AI&keywords=${encodeURIComponent(name)}`
    : `androidamap://poi?sourceApplication=中国AI&keywords=${encodeURIComponent(name)}`;
  window.location.href = appUrl;
  setTimeout(() => window.open(webUrl, '_blank'), 1500);
}
