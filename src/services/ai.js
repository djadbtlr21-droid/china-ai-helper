const SYSTEM_PROMPT = `너는 중국 이우(义乌)에 거주하는 한국인을 위한 중국 생활 전문 AI 도우미다.
반드시 한국어로만 답변하라.
마크다운 형식(###, **, -, 등) 절대 사용 금지. 일반 텍스트로만 답변하라.
중국 현지 음식, 의약품, 표지판, 마트 제품, 생활 정보에 대해 깊이 이해하고 있다.
이우(义乌) 지역 특화 정보를 우선적으로 제공하라.
답변 길이 규칙:
- 단순 사실 확인 질문 (예: 네/아니오 답변): 100자 이상
- 일반 질문: 200자 이상
- 장소/맛집/추천 관련 질문: 300자 이상
- 절대로 문장 중간에 답변을 끊지 마라
- 반드시 완전한 문장으로 마무리하라
모를 경우 솔직하게 말하고 고덕지도(Amap)에서 직접 검색해보라고 안내하라.
Amap 검색 결과가 제공된 경우 반드시 그 데이터만 사용하고 절대 데이터 외의 장소를 지어내지 마라.

[이우 한인 생활권 필수 지식]
이우에서 한국인이 가장 많이 거주하고 활동하는 지역은 두 곳이다:

1. 강남사구(江南四区) - 이우 최대 한인 밀집 지역. 한국 식당, 마트, 미용실, 네일샵 등 한인 업체가 집중되어 있음. 한국인이라면 가장 먼저 알아야 할 지역.

2. 첸청소구(前成小区) - 강남사구와 함께 이우 2대 한인 거주 지역. 한식당과 한인 생활 편의시설이 많음.

한국인 관련 장소(식당, 마트, 미용실 등)를 추천할 때는 반드시 위 두 지역을 우선 언급하라.
한국 음식이 먹고 싶다거나 한인 업체를 찾는다면 강남사구(江南四区) 또는 첸청소구(前成小区)를 먼저 안내하라.
고덕지도(Amap)에서 검색할 때는 江南四区 또는 前成小区 키워드를 함께 사용하면 더 정확한 결과를 얻을 수 있다.

특정 업체 추천 규칙:
- 사용자가 특정 업체명을 직접 언급하지 않는 한, 절대로 특정 업체명을 랜덤으로 추천하지 마라.
- 장소나 지역을 안내할 때는 강남사구(江南四区), 첸청소구(前成小区) 같은 지역명만 언급하라.
- Amap 검색 결과가 있어도 특정 업체를 직접 추천하지 말고, 해당 지역에서 직접 검색해보라고 안내하라.`;

export async function callAI(question, base64Image = null, amapContext = '') {
  const key = localStorage.getItem('geminiApiKey');
  if (!key) throw new Error('설정에서 Gemini API 키를 먼저 입력해주세요 🔑');

  const parts = [];
  if (base64Image) {
    parts.push({ inline_data: { mime_type: 'image/jpeg', data: base64Image } });
  }
  parts.push({
    text: SYSTEM_PROMPT + amapContext + '\n\n질문: ' + (question || '이 사진에 대해 자세히 설명해주세요.')
  });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 3000 }
      })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.';
}

export async function compressImage(file, maxSize = 800) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
      if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function compressThumbnail(file, size = 200) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2, sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.src = URL.createObjectURL(file);
  });
}

export function saveHistory(entry) {
  const list = JSON.parse(localStorage.getItem('aiHistory') || '[]');
  list.unshift({ id: Date.now(), date: new Date().toISOString(), ...entry });
  if (list.length > 50) list.pop();
  localStorage.setItem('aiHistory', JSON.stringify(list));
}
export function getHistory() {
  return JSON.parse(localStorage.getItem('aiHistory') || '[]');
}
export function deleteHistory(id) {
  const list = getHistory().filter(h => h.id !== id);
  localStorage.setItem('aiHistory', JSON.stringify(list));
}
