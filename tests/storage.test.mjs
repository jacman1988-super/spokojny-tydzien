import test from 'node:test';
import assert from 'node:assert/strict';
import { loadWeek, saveWeek, createExampleWeek, STORAGE_KEY } from '../dist/storage.mjs';
const memory = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }; };
test('New visitor gets independent fictional day records', () => {
  const { week, status } = loadWeek(memory());
  assert.equal(status, 'example'); assert.equal(week.days.length, 7);
  week.days[0].workoutStart = '16:10'; assert.equal(week.days[1].workoutStart, '17:00');
});
test('Week and selected day persist without overwriting other days', () => {
  const storage = memory(); const week = createExampleWeek();
  week.days[3].workoutStart = '16:05'; week.selectedDay = 3;
  assert.equal(saveWeek(storage, week), true);
  const result = loadWeek(storage); assert.equal(result.status, 'restored'); assert.deepEqual(result.week, week);
});
test('Temporary invalid edits remain editable after reopening', () => {
  const storage = memory(); const week = createExampleWeek(); week.days[0].workoutStart = '';
  assert.equal(saveWeek(storage, week), true); assert.equal(loadWeek(storage).week.days[0].workoutStart, '');
});
test('Corrupt, unsupported and wrongly shaped records recover honestly', () => {
  const storage = memory();
  for (const raw of ['{bad', JSON.stringify({ version: 2 }), JSON.stringify({ ...createExampleWeek(), selectedDay: 7 }), JSON.stringify({ ...createExampleWeek(), days: [] })]) {
    storage.setItem(STORAGE_KEY, raw); const result = loadWeek(storage);
    assert.equal(result.status, 'recovery'); assert.equal(result.week.days.length, 7);
  }
});
test('Blocked storage does not throw or claim a successful save', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(loadWeek(blocked).status, 'recovery'); assert.equal(saveWeek(blocked, createExampleWeek()), false);
  assert.equal(saveWeek(null, createExampleWeek()), false);
});
