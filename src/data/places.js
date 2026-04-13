export const placeCategories = [
  { id: 'restaurant', label: '식당', emoji: '🍽️' },
  { id: 'exercise',   label: '운동',  emoji: '💪' },
  { id: 'massage',    label: '마사지', emoji: '💆' },
  { id: 'shopping',   label: '쇼핑',  emoji: '🛍️' },
  { id: 'homeoffice', label: '집/회사', emoji: '🏠' },
  { id: 'myplace',    label: '내 장소', emoji: '⭐' },
];

export const places = [
  // ─── 식당 ───────────────────────────────────────
  {
    id: 1, category: 'restaurant', emoji: '🍽️',
    nameKo: '한미소', nameZh: '韩美笑',
    address: '浙江省义乌市稠州北路与新马路交叉口',
    addressKo: '저우저우베이루-신마루 교차로 인근',
    tel: '', tags: ['한식','된장찌개','삼겹살'],
    description: '이우 한인 대표 한식당. 된장찌개·삼겹살 전문.',
    location: '120.075,29.315',
    image: null,
  },
  {
    id: 2, category: 'restaurant', emoji: '🍽️',
    nameKo: '백청', nameZh: '百清',
    address: '浙江省义乌市稠州北路',
    addressKo: '저우저우베이루',
    tel: '', tags: ['한식','냉면','갈비'],
    description: '냉면·갈비 전문 한식당.',
    location: '120.074,29.317',
    image: null,
  },
  {
    id: 3, category: 'restaurant', emoji: '🍽️',
    nameKo: '광명식당', nameZh: '光明食堂',
    address: '浙江省义乌市稠州北路',
    addressKo: '저우저우베이루',
    tel: '', tags: ['한식','백반','가정식'],
    description: '가정식 백반 전문. 저렴하고 푸짐.',
    location: '120.073,29.316',
    image: null,
  },

  // ─── 운동 ───────────────────────────────────────
  {
    id: 101, category: 'exercise', emoji: '💪',
    nameKo: '빅짐 피트니스', nameZh: '大健身房',
    address: '浙江省义乌市江东街道',
    addressKo: '장동가도',
    tel: '', tags: ['헬스','피트니스','운동'],
    description: '대형 피트니스 센터. 한국인 이용 많음.',
    location: '120.082,29.308',
    image: null,
  },

  // ─── 마사지 ─────────────────────────────────────
  {
    id: 201, category: 'massage', emoji: '💆',
    nameKo: '황실 마사지', nameZh: '皇室按摩',
    address: '浙江省义乌市稠州北路',
    addressKo: '저우저우베이루',
    tel: '', tags: ['마사지','발마사지','전신'],
    description: '발마사지·전신마사지. 한국어 가능.',
    location: '120.076,29.314',
    image: null,
  },

  // ─── 쇼핑 ───────────────────────────────────────
  {
    id: 301, category: 'shopping', emoji: '🛍️',
    nameKo: '이우 국제상품성', nameZh: '义乌国际商贸城',
    address: '浙江省义乌市国际商贸城',
    addressKo: '이우 국제상무청',
    tel: '', tags: ['도매','쇼핑','상품성'],
    description: '세계 최대 도매시장. 1구~5구 구역.',
    location: '120.087,29.324',
    image: null,
  },
  {
    id: 302, category: 'shopping', emoji: '🛍️',
    nameKo: '빈왕 야시장', nameZh: '宾王夜市',
    address: '浙江省义乌市宾王路',
    addressKo: '빈왕루',
    tel: '', tags: ['야시장','야식','쇼핑'],
    description: '이우 대표 야시장. 음식·잡화 다양.',
    location: '120.071,29.306',
    image: null,
  },

  // ─── 집/회사 ────────────────────────────────────
  {
    id: 401, category: 'homeoffice', emoji: '🏠',
    nameKo: '우리 회사 (EOM)', nameZh: '我们公司',
    address: '浙江省义乌市',
    addressKo: '이우시',
    tel: '', tags: ['회사','사무실'],
    description: '회사 위치.',
    location: '120.075,29.312',
    image: null,
  },
];
