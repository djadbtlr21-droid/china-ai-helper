/**
 * Returns real-time business status based on Beijing time (UTC+8)
 * @param {string} hoursStr - e.g. "11:00~22:00" or "10:00~14:00 / 16:00~21:00"
 * @returns {{ status: 'open'|'closed'|'unknown', label: string, color: string, bg: string }}
 */
export function getBusinessStatus(hoursStr) {
  if (!hoursStr || hoursStr === '미정' || hoursStr === '문의' || hoursStr === '홈' || hoursStr === '사무실') {
    return { status: 'unknown', label: '영업시간 정보없음', color: '#999', bg: 'rgba(153,153,153,0.15)' };
  }

  // Get current Beijing time (UTC+8)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const beijing = new Date(utc + 8 * 3600000);
  const currentMinutes = beijing.getHours() * 60 + beijing.getMinutes();

  // Parse time string "HH:MM" to total minutes
  function toMinutes(timeStr) {
    const [h, m] = timeStr.trim().split(':').map(Number);
    return h * 60 + (m || 0);
  }

  // Parse a single range "HH:MM~HH:MM"
  function parseRange(rangeStr) {
    const parts = rangeStr.trim().split('~');
    if (parts.length !== 2) return null;
    const open = toMinutes(parts[0]);
    let close = toMinutes(parts[1]);
    if (close < open) close += 24 * 60;
    return { open, close };
  }

  // Handle "24시간" case
  if (hoursStr.includes('24시간')) {
    return { status: 'open', label: '영업 중', color: '#34C759', bg: 'rgba(52,199,89,0.15)' };
  }

  // Split multiple ranges by "/" or newline
  const rawRanges = hoursStr.split(/\/|\n/).map(s => s.trim()).filter(Boolean);

  for (const raw of rawRanges) {
    const cleaned = raw.replace(/[가-힣]+\s*/g, '').trim();
    if (!cleaned.includes('~') && !cleaned.includes(':')) continue;
    const range = parseRange(cleaned);
    if (!range) continue;
    const check = currentMinutes >= range.open && currentMinutes < range.close;
    const checkOvernight = range.close > 24 * 60
      ? currentMinutes >= range.open || currentMinutes < (range.close - 24 * 60)
      : check;
    if (checkOvernight) {
      return { status: 'open', label: '영업 중', color: '#34C759', bg: 'rgba(52,199,89,0.15)' };
    }
  }

  return { status: 'closed', label: '영업 종료', color: '#FF3B30', bg: 'rgba(255,59,48,0.15)' };
}
