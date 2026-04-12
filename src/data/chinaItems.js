export const categories = [
  { id: 'medicine',   label: '의약품',    emoji: '💊', color: '#C41E3A' },
  { id: 'food',       label: '음식',      emoji: '🍜', color: '#D4AF37' },
  { id: 'mart',       label: '마트식품',  emoji: '🛒', color: '#2E8B57' },
  { id: 'drink',      label: '음료',      emoji: '🧋', color: '#4682B4' },
  { id: 'snack',      label: '과자/간식', emoji: '🍪', color: '#D2691E' },
  { id: 'condiment',  label: '조미료',    emoji: '🧂', color: '#8B4513' },
  { id: 'daily',      label: '생활용품',  emoji: '🧴', color: '#6A5ACD' },
];

export const chinaItems = [
  { id:1, category:'medicine', subcategory:'감기/해열', emoji:'💊',
    nameKo:'판란근 (板蓝根)', nameZh:'板蓝根冲剂',
    description:'중국 국민 감기약. 항바이러스 한방 성분. 인후통·발열·감기 초기에 복용.',
    howToUse:'1포씩 하루 3회, 따뜻한 물에 타서 복용.',
    warning:'임산부 주의.',
    tags:['감기','열','목아픔','한방'] },
  { id:2, category:'food', subcategory:'면류', emoji:'🍜',
    nameKo:'란저우 라면 (兰州拉面)', nameZh:'兰州拉面',
    description:'중국 3대 면 요리. 쇠고기 육수에 수타면. 이우 어디서나 볼 수 있는 서민 음식.',
    howToUse:null, warning:'할랄 식당 많음.',
    tags:['면','쇠고기','서민','저렴'] },
  { id:3, category:'drink', subcategory:'탄산음료', emoji:'🧋',
    nameKo:'위안치썬린 (元气森林)', nameZh:'元气森林',
    description:'중국판 탄산수. 0kcal 0당. 다양한 과일맛. MZ세대 인기.',
    howToUse:null, warning:null,
    tags:['탄산수','무설탕','건강'] },
];

export default chinaItems;
