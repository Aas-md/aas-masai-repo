// simple localStorage store for daily logs and mentor comments
const KEY = "mindtrack_data_v1";

/*
Data model:
{
  logs: {
    "2025-12-01": { studyHours: 3, breakMinutes: 30, sleepHours: 7, stress: "low", focus: "medium", reflection: "...", optedIn: true, mentorComments: [] },
    ...
  }
}
*/

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { logs: {} };
  } catch {
    return { logs: {} };
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadAll() {
  return read();
}

export function saveLog(dateKey, logObj) {
  const data = read();
  data.logs[dateKey] = { ...(data.logs[dateKey] || {}), ...logObj };
  if (!data.logs[dateKey].mentorComments) data.logs[dateKey].mentorComments = data.logs[dateKey].mentorComments || [];
  write(data);
  return data.logs[dateKey];
}

export function deleteLog(dateKey) {
  const data = read();
  delete data.logs[dateKey];
  write(data);
}

export function addMentorComment(dateKey, comment) {
  const data = read();
  if (!data.logs[dateKey]) return null;
  data.logs[dateKey].mentorComments = data.logs[dateKey].mentorComments || [];
  data.logs[dateKey].mentorComments.push({ id: Date.now(), text: comment, createdAt: Date.now() });
  write(data);
  return data.logs[dateKey];
}

export function toggleOptIn(dateKey, opted) {
  const data = read();
  if (!data.logs[dateKey]) data.logs[dateKey] = { mentorComments: [] };
  data.logs[dateKey].optedIn = !!opted;
  write(data);
  return data.logs[dateKey];
}
