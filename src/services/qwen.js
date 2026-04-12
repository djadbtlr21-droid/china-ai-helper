const SYSTEM_PROMPT = `너는 중국 이우(义乌)에 거주하는 한국인을 위한 중국 생활 전문 AI 도우미다.
반드시 한국어로만 답변하라.
중국 현지 음식, 의약품, 표지판, 마트 제품, 생활 정보에 대해 깊이 이해하고 있다.

사진이 주어지면:
- 음식: 요리명, 주재료, 맛 설명, 먹는 방법, 주의사항(알레르기·향신료)
- 약품: 효능, 복용법, 주의사항, 한국 유사 제품명
- 표지판/글자: 번역 + 의미 + 필요한 행동
- 영수증/메뉴판: 항목별 번역과 금액 설명
- 제품: 용도, 사용법, 주요 성분
- 위치나 지역: amap 데이터를 참고해 장소 설명

모든 답변은 구체적이고 실용적으로, 최소 200자 이상 작성하라.
모를 경우 솔직하게 말하고 대안을 제시하라.`;

export async function callQwen(question, base64Image = null, amapContext = '') {
  const key = localStorage.getItem('qwenApiKey');
  if (!key) throw new Error('설정에서 Qwen API 키를 먼저 입력해주세요 🔑');

  const content = [];
  if (base64Image) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${base64Image}` }
    });
  }
  content.push({
    type: 'text',
    text: SYSTEM_PROMPT + amapContext + '\n\n질문: ' + (question || '이 사진에 대해 자세히 설명해주세요.')
  });

  const res = await fetch(
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-vl-plus',
        messages: [{ role: 'user', content }],
        max_tokens: 1500
      })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || '응답을 받지 못했습니다.';
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
