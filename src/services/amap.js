const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '01cd2af677cc41c3cc14e03973279fc3';

const keywordMap = {
  '한국식당': '韩国料理', '한식': '韩国料理', '식당': '餐厅',
  '맛집': '餐厅', '음식점': '餐厅', '고기': '烤肉',
  '삼겹살': '五花肉烤肉', '치킨': '炸鸡', '족발': '猪蹄',
  '병원': '医院', '약국': '药店', '마트': '超市',
  '편의점': '便利店', '카페': '咖啡', '커피': '咖啡',
  '미용실': '美发', '네일': '美甲', '마사지': '按摩',
  '헬스': '健身房', '당구': '台球', '골프': '高尔夫',
  '쇼핑몰': '购物中心', '시장': '市场', '은행': '银行',
  '학교': '学校', '공원': '公园', '지하철': '地铁',
  '훠궈': '火锅', '마라탕': '麻辣烫', '꼬치': '烤串',
};

export function translateKeyword(text) {
  for (const [ko, zh] of Object.entries(keywordMap)) {
    if (text.includes(ko)) return zh;
  }
  return text;
}

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
  const zhKeyword = translateKeyword(keyword);
  console.log('Searching Amap with Chinese keyword:', zhKeyword);
  try {
    const url = `https://restapi.amap.com/v3/place/text?key=${key}&keywords=${encodeURIComponent(zhKeyword)}&city=${encodeURIComponent(city)}&output=JSON&offset=8&extensions=all`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Amap response:', data);
    if (data.status === '1' && data.pois?.length > 0) {
      return data.pois.map(p => ({
        name: p.name,
        address: typeof p.address === 'string' ? p.address : '주소 없음',
        tel: Array.isArray(p.tel) ? p.tel[0] : (p.tel || ''),
        rating: p.biz_ext?.rating || '',
        location: p.location,
        type: p.type,
      }));
    }
    console.warn('Amap no results for:', zhKeyword);
    return [];
  } catch (e) {
    console.error('Amap error:', e);
    return [];
  }
}

export function formatAmapForPrompt(places) {
  if (!places.length) {
    return '\n\n[Amap 검색 결과 없음 - 이 경우 모른다고 솔직하게 말하고 고덕지도에서 직접 검색해보라고 안내하라]';
  }
  return '\n\n[고덕지도(Amap) 실시간 검색 결과 - 반드시 이 데이터만 사용하여 답변하고 절대 데이터 외의 장소를 지어내지 마라]\n' +
    places.map((p, i) =>
      `${i+1}. ${p.name} | 주소: ${p.address} | 전화: ${p.tel || '없음'} | 평점: ${p.rating || '없음'}`
    ).join('\n') +
    '\n[위 목록에 없는 장소는 절대 언급하지 말 것]';
}

export const yiwuAreas = [
  { nameKo: '강남사구 (한인 밀집)', nameZh: '江南四区' },
  { nameKo: '첸청소구 (한인 거주)', nameZh: '前成小区' },
  { nameKo: '푸텐 시장', nameZh: '义乌国际商贸城' },
  { nameKo: '신광휘 쇼핑몰', nameZh: '新光汇购物中心' },
  { nameKo: '이우천지', nameZh: '义乌天地' },
  { nameKo: '빈왕 야시장', nameZh: '宾王夜市' },
];

export function getRelevantAreas(query) {
  if (!query) return yiwuAreas.slice(0, 4);
  if (query.includes('한식') || query.includes('한국') || query.includes('식당') || query.includes('맛집')) {
    return yiwuAreas.filter(a => ['江南四区','前成小区'].includes(a.nameZh));
  }
  if (query.includes('쇼핑') || query.includes('마트') || query.includes('시장')) {
    return yiwuAreas.filter(a => ['义乌国际商贸城','新光汇购物中心','义乌天地'].includes(a.nameZh));
  }
  if (query.includes('야식') || query.includes('꼬치') || query.includes('야시장')) {
    return yiwuAreas.filter(a => ['宾王夜市'].includes(a.nameZh));
  }
  return yiwuAreas.slice(0, 4);
}

export function openAmapSearch(keyword) {
  const encoded = encodeURIComponent(keyword);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    window.location.href = `iosamap://poi?sourceApplication=china-ai-helper&keywords=${encoded}&dev=0`;
  } else {
    window.location.href = `androidamap://poi?sourceApplication=china-ai-helper&keywords=${encoded}&dev=0`;
  }
}

export function openAmapNavi(name) {
  openAmapSearch(name);
}
