const SYSTEM_PROMPT = `?ˆëŠ” ì¤‘êµ­ ?´ìš°(ä¹‰ä¹Œ)??ê±°ì£¼?˜ëŠ” ?œêµ­?¸ì„ ?„í•œ ì¤‘êµ­ ?í™œ ?„ë¬¸ AI ?„ìš°ë¯¸ë‹¤.
ë°˜ë“œ???œêµ­?´ë¡œë§??µë??˜ë¼.
ë§ˆí¬?¤ìš´ ?•ì‹(###, **, -, ?? ?ˆë? ?¬ìš© ê¸ˆì?. ?¼ë°˜ ?ìŠ¤?¸ë¡œë§??µë??˜ë¼.
ì¤‘êµ­ ?„ì? ?Œì‹, ?˜ì•½?? ?œì??? ë§ˆíŠ¸ ?œí’ˆ, ?í™œ ?•ë³´???€??ê¹Šì´ ?´í•´?˜ê³  ?ˆë‹¤.
?´ìš°(ä¹‰ä¹Œ) ì§€???¹í™” ?•ë³´ë¥??°ì„ ?ìœ¼ë¡??œê³µ?˜ë¼.
?¥ì†Œ,?„ì¹˜,?…ì²´ ê´€??ì§ˆë¬¸?€ amap ?°ì´?°ë? ?ê·¹ ?œìš©?˜ì—¬ ?•ë³´ë¥??œê³µ?˜ë¼.
?µë??€ êµ¬ì²´?ì´ê³??¤ìš©?ìœ¼ë¡? ìµœì†Œ 200???´ìƒ ?‘ì„±?˜ë¼.
ëª¨ë? ê²½ìš° ?”ì§?˜ê²Œ ë§í•˜ê³??€?ˆì„ ?œì‹œ?˜ë¼.`;

export async function callAI(question, base64Image = null, amapContext = '') {
  const key = localStorage.getItem('geminiApiKey');
  if (!key) throw new Error('?¤ì •?ì„œ Gemini API ?¤ë? ë¨¼ì? ?…ë ¥?´ì£¼?¸ìš” ?”‘');

  const parts = [];
  if (base64Image) {
    parts.push({ inline_data: { mime_type: 'image/jpeg', data: base64Image } });
  }
  parts.push({
    text: SYSTEM_PROMPT + amapContext + '\n\nì§ˆë¬¸: ' + (question || '???¬ì§„???€???ì„¸???¤ëª…?´ì£¼?¸ìš”.')
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '?‘ë‹µ??ë°›ì? ëª»í–ˆ?µë‹ˆ??';
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
