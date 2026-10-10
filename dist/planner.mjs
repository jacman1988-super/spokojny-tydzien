export const TIME_FIELDS = ['availableStart', 'availableEnd', 'workoutStart', 'workoutEnd', 'careStart', 'careEnd'];
export function parseTime(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(':').map(Number);
  return h < 24 && m < 60 ? h * 60 + m : null;
}
export function formatTime(value) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}
export function fingerprint(day) {
  return JSON.stringify([...TIME_FIELDS.map(key => day?.[key]), day?.transitionMinutes, day?.fixedWorkout]);
}
export function validateDay(day) {
  const errors = [];
  const values = {};
  for (const key of TIME_FIELDS) {
    values[key] = parseTime(day?.[key]);
    if (values[key] === null) errors.push({ field: key, text: 'Wpisz poprawną godzinę.' });
  }
  const raw = day?.transitionMinutes;
  values.transitionMinutes = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isSafeInteger(values.transitionMinutes) || values.transitionMinutes < 0) {
    errors.push({ field: 'transitionMinutes', text: 'Zapas czasu musi być pełną liczbą minut, od zera.' });
  }
  if (typeof day?.fixedWorkout !== 'boolean') errors.push({ field: 'fixedWorkout', text: 'Wybierz rodzaj treningu.' });
  for (const [start, end, text] of [
    ['availableStart', 'availableEnd', 'Koniec wieczoru musi być później niż początek.'],
    ['workoutStart', 'workoutEnd', 'Trening musi kończyć się później niż zaczyna.'],
    ['careStart', 'careEnd', 'Usypianie musi kończyć się później niż zaczyna.']
  ]) {
    if (values[start] !== null && values[end] !== null && values[end] <= values[start]) errors.push({ field: end, text });
  }
  if (!errors.length && (values.careStart < values.availableStart || values.careEnd > values.availableEnd)) {
    errors.push({ field: 'availableEnd', text: 'Okno wieczoru musi obejmować całe usypianie.' });
  }
  return { errors, values: { ...values, fixedWorkout: day?.fixedWorkout } };
}
function fits(values, start = values.workoutStart) {
  const duration = values.workoutEnd - values.workoutStart;
  const reservedEnd = start + duration + values.transitionMinutes;
  return start >= values.availableStart && reservedEnd <= values.availableEnd
    && (reservedEnd <= values.careStart || start >= values.careEnd);
}
function proposals(day, v) {
  const duration = v.workoutEnd - v.workoutStart;
  const reserved = duration + v.transitionMinutes;
  const ranges = [
    [v.availableStart, Math.min(v.availableEnd - reserved, v.careStart - reserved), 'przed usypianiem'],
    [Math.max(v.availableStart, v.careEnd), v.availableEnd - reserved, 'po usypianiu']
  ];
  const seen = new Set();
  return ranges.filter(([min, max]) => min <= max).map(([min, max, label]) => {
    const start = Math.max(min, Math.min(max, v.workoutStart));
    return { start, end: start + duration, label };
  }).filter(item => fits(v, item.start) && item.start !== v.workoutStart && !seen.has(item.start) && seen.add(item.start))
    .sort((a, b) => Math.abs(a.start - v.workoutStart) - Math.abs(b.start - v.workoutStart))
    .map(item => ({ start: formatTime(item.start), end: formatTime(item.end), label: item.label, source: fingerprint(day) }));
}
export function checkDay(day) {
  const { errors, values: v } = validateDay(day);
  const source = fingerprint(day);
  if (errors.length) return { status: 'invalid', errors, reasons: [], suggestions: [], source };
  if (fits(v)) return { status: 'fits', errors: [], reasons: [], suggestions: [], source };
  const reasons = [];
  const add = (code, minutes, text) => reasons.push({ code, minutes, text });
  if (v.workoutStart < v.availableStart) add('early', v.availableStart - v.workoutStart, 'Trening zaczyna się przed dostępnym oknem wieczoru.');
  if (v.workoutEnd + v.transitionMinutes > v.availableEnd) {
    const missing = v.workoutEnd + v.transitionMinutes - v.availableEnd;
    add('late', missing, `Trening i zapas czasu wykraczają poza wieczór o ${missing} min.`);
  }
  const overlap = Math.min(v.workoutEnd, v.careEnd) - Math.max(v.workoutStart, v.careStart);
  if (overlap > 0) add('overlap', overlap, `Trening i usypianie nakładają się przez ${overlap} min.`);
  else if (v.workoutStart < v.careEnd && v.workoutEnd + v.transitionMinutes > v.careStart) {
    const missing = v.workoutEnd + v.transitionMinutes - v.careStart;
    add('transition', missing, `Przed usypianiem brakuje ${missing} min na przejście po treningu.`);
  }
  const suggestions = day.fixedWorkout ? [] : proposals(day, v);
  return { status: day.fixedWorkout ? 'fixed-conflict' : suggestions.length ? 'movable-conflict' : 'no-slot', errors: [], reasons, suggestions, source };
}
export function acceptSuggestion(day, suggestion) {
  if (!suggestion || suggestion.source !== fingerprint(day) || day.fixedWorkout) return null;
  const result = checkDay(day);
  if (!result.suggestions.some(item => item.start === suggestion.start && item.end === suggestion.end)) return null;
  const next = { ...day, workoutStart: suggestion.start, workoutEnd: suggestion.end };
  return checkDay(next).status === 'fits' ? next : null;
}
