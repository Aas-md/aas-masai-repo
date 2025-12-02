// small helpers (no external libs)
export function dateKey(d = new Date()) {
  const dd = new Date(d);
  return dd.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function pastNDates(n = 14) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(dateKey(d));
  }
  return arr;
}

export function calcStreak(logs) {
  // logs: object with dateKey keys; calculates consecutive recent days streak
  const today = new Date();
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    if (logs[key]) streak++;
    else break;
  }
  return streak;
}

export function simpleMarkdownToHtml(text = "") {
  // very small support: **bold**, *italic*, line breaks
  let out = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(/\n/g, "<br/>");
  return out;
}

export function computeInsights(logsObj) {
  // simple insights after 7 entries
  const keys = Object.keys(logsObj);
  if (keys.length < 7) return [];
  const arr = keys.map(k => ({ k, ...logsObj[k] }));
  // insight 1: average focus when sleep >=8 vs <8
  const highSleep = arr.filter(a => a.sleepHours >= 8);
  const lowSleep = arr.filter(a => a.sleepHours < 8);
  const avgFocus = list => {
    if (!list.length) return null;
    const map = { low: 1, medium: 2, high: 3 };
    return list.reduce((s, x) => s + (map[x.focus] || 2), 0) / list.length;
  };
  const h = avgFocus(highSleep), l = avgFocus(lowSleep);
  const insights = [];
  if (h && l && h - l >= 0.4) insights.push("You tend to focus better after 8+ hours of sleep.");
  // insight 2: long breaks vs stress
  const mapStress = { low: 1, medium: 2, high: 3 };
  const corrBreaks = arr.reduce((acc, x) => {
    acc.hours += (x.breakMinutes || 0);
    acc.stress += (mapStress[x.stress] || 2);
    acc.count++;
    return acc;
  }, { hours: 0, stress: 0, count: 0 });
  if (corrBreaks.count >= 7) {
    const avgBreak = corrBreaks.hours / corrBreaks.count;
    const avgStress = corrBreaks.stress / corrBreaks.count;
    if (avgBreak > 30 && avgStress <= 1.8) insights.push("Longer breaks appear to be associated with lower stress for you.");
  }
  return insights;
}
