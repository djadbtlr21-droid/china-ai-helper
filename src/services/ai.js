const SYSTEM_PROMPT = `너는 중국 이우(义乌)에 거주하는 한국인을 위한 중국 생활 전문 AI 도우미다.
반드시 한국어로만 답변하라.
마크다운 형식(###, **, -, 등) 절대 사용 금지. 일반 텍스트로만 답변하라.
중국 현지 음식, 의약품, 표지판, 마트 제품, 생활 정보에 대해 깊이 이해하고 있다.
이우(义乌) 지역 특화 정보를 우선적으로 제공하라.
장소,위치,업체 관련 질문은 amap 데이터를 적극 활용하여 정보를 제공하라.
답변은 구체적이고 실용적으로, 최소 200자 이상 작성하라.
모를 경우 솔직하게 말하고 대안을 제시하라.`;

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
        generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
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
