import { TIME_FIELDS } from './planner.mjs';
export const STORAGE_KEY = 'spokojny-tydzien.week.v1';
export const DAY_NAMES = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
export function createExampleWeek() {
  return {
    version: 1, selectedDay: 0,
    days: DAY_NAMES.map((_, i) => ({
      availableStart: '16:00', availableEnd: '21:00', workoutStart: i === 2 ? '16:30' : '17:00',
      workoutEnd: i === 2 ? '17:30' : '18:00', careStart: '18:00', careEnd: '18:30',
      transitionMinutes: '15', fixedWorkout: i !== 1
    }))
  };
}
export function validWeek(week) {
  return week?.version === 1 && Number.isInteger(week.selectedDay) && week.selectedDay >= 0 && week.selectedDay < 7
    && Array.isArray(week.days) && week.days.length === 7 && week.days.every(day =>
      day && typeof day.fixedWorkout === 'boolean' && [...TIME_FIELDS, 'transitionMinutes'].every(key =>
        typeof day[key] === 'string' && day[key].length <= 32));
}
export function loadWeek(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { week: createExampleWeek(), status: 'example' };
    const parsed = JSON.parse(raw);
    if (!validWeek(parsed)) throw new Error('Unsupported saved week');
    // Copy only the fields this app owns; never trust extra stored properties.
    const week = { version: 1, selectedDay: parsed.selectedDay, days: parsed.days.map(day =>
      Object.fromEntries([...TIME_FIELDS, 'transitionMinutes', 'fixedWorkout'].map(key => [key, day[key]]))) };
    return { week, status: 'restored' };
  } catch {
    return { week: createExampleWeek(), status: 'recovery' };
  }
}
export function saveWeek(storage, week) {
  try {
    if (!validWeek(week)) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(week));
    return true;
  } catch { return false; }
}
