import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDay, acceptSuggestion, parseTime } from '../dist/planner.mjs';
import { createExampleWeek } from '../dist/storage.mjs';
const sample = overrides => ({ ...createExampleWeek().days[0], ...overrides });
test('Touching fixed appointments need the full transition, and never move', () => {
  const day = sample({ transitionMinutes: '20' });
  const before = structuredClone(day);
  const result = checkDay(day);
  assert.equal(result.status, 'fixed-conflict');
  assert.equal(result.reasons[0].minutes, 20);
  assert.deepEqual(result.suggestions, []);
  assert.deepEqual(day, before);
});
test('Zero transition permits touching endpoints', () => assert.equal(checkDay(sample({ transitionMinutes: '0' })).status, 'fits'));
test('Movable proposals preserve duration and really fit, before and after care', () => {
  const day = sample({ fixedWorkout: false });
  const result = checkDay(day);
  assert.equal(result.status, 'movable-conflict');
  assert.deepEqual(result.suggestions.map(x => [x.start, x.end]), [['16:45', '17:45'], ['18:30', '19:30']]);
  for (const proposal of result.suggestions) {
    const next = acceptSuggestion(day, proposal);
    assert.ok(next); assert.equal(checkDay(next).status, 'fits');
    assert.equal(parseTime(next.workoutEnd) - parseTime(next.workoutStart), 60);
    assert.equal(next.careStart, day.careStart); assert.equal(next.careEnd, day.careEnd);
  }
});
test('No room returns no slot, without a fake proposal', () => {
  const result = checkDay(sample({ fixedWorkout: false, availableStart: '17:00', availableEnd: '18:30' }));
  assert.equal(result.status, 'no-slot'); assert.deepEqual(result.suggestions, []);
});
test('A later workout also reserves transition within the availability window', () => {
  const result = checkDay(sample({ workoutStart: '20:00', workoutEnd: '21:00', fixedWorkout: false }));
  assert.equal(result.status, 'movable-conflict');
  assert.equal(result.reasons[0].minutes, 15);
  assert.ok(result.suggestions.some(x => x.start === '19:45'));
});
test('Invalid, missing, reversed and cross-day inputs cannot produce proposals', () => {
  for (const changes of [{ workoutStart: '' }, { careStart: '25:00' }, { workoutEnd: '16:00' }, { transitionMinutes: '-1' }, { transitionMinutes: '1.5' }, { transitionMinutes: '' }, { availableStart: '19:00' }, { fixedWorkout: 'false' }, { careEnd: '17:00' }]) {
    const result = checkDay(sample(changes));
    assert.equal(result.status, 'invalid', JSON.stringify(changes)); assert.deepEqual(result.suggestions, []);
  }
});
test('Stale, forged and fixed proposals are rejected', () => {
  const day = sample({ fixedWorkout: false });
  const suggestion = checkDay(day).suggestions[0];
  assert.equal(acceptSuggestion({ ...day, transitionMinutes: '20' }, suggestion), null);
  assert.equal(acceptSuggestion({ ...day, fixedWorkout: true }, suggestion), null);
  assert.equal(acceptSuggestion(day, { ...suggestion, start: '17:30' }), null);
});
test('Actual activity overlap gets a concrete reason', () => {
  const result = checkDay(sample({ workoutStart: '17:30', workoutEnd: '18:30' }));
  assert.equal(result.status, 'fixed-conflict'); assert.equal(result.reasons[0].code, 'overlap'); assert.equal(result.reasons[0].minutes, 30);
});
test('All proposed slots satisfy the kernel across many boundary arrangements', () => {
  for (const duration of [1, 30, 60, 120, 240]) for (const buffer of [0, 1, 15, 60, 300]) for (const start of [900, 960, 1020, 1080, 1140]) {
    const toTime = min => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
    const day = sample({ fixedWorkout: false, workoutStart: toTime(start), workoutEnd: toTime(start + duration), transitionMinutes: String(buffer) });
    const result = checkDay(day);
    for (const suggestion of result.suggestions) {
      const next = acceptSuggestion(day, suggestion);
      assert.ok(next); assert.equal(checkDay(next).status, 'fits');
      assert.equal(parseTime(next.workoutEnd) - parseTime(next.workoutStart), duration);
    }
  }
});
