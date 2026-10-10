import { checkDay, validateDay, parseTime, formatTime, TIME_FIELDS, acceptSuggestion } from './planner.mjs';
import { loadWeek, saveWeek, DAY_NAMES } from './storage.mjs';

const $ = selector => document.querySelector(selector);
const form = $('#plan-form');
let storage;
try { storage = window.localStorage; } catch { storage = null; }
const loaded = loadWeek(storage);
const week = loaded.week;
let checked = null;
const fieldLabels = { availableStart: 'Początek wieczoru', availableEnd: 'Koniec wieczoru', workoutStart: 'Początek treningu', workoutEnd: 'Koniec treningu', careStart: 'Początek usypiania', careEnd: 'Koniec usypiania', transitionMinutes: 'Zapas czasu', fixedWorkout: 'Rodzaj treningu' };
const currentDay = () => week.days[week.selectedDay];
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function save() {
  const ok = saveWeek(storage, week);
  $('#storage-status').textContent = ok ? 'Plan zapisany w tej przeglądarce. Bez konta.' : 'Zapis jest niedostępny. Plan działa tylko do zamknięcia tej strony.';
}
function renderDays() {
  const nav = $('#days');
  const focusedDay = document.activeElement?.dataset.day;
  nav.replaceChildren(...week.days.map((day, index) => {
    const outcome = checkDay(day);
    const label = outcome.status === 'fits' ? 'Jest zapas' : outcome.status === 'invalid' ? 'Uzupełnij plan' : 'Potrzebuje uwagi';
    const button = element('button', 'day-button');
    button.type = 'button'; button.dataset.day = String(index);
    button.setAttribute('aria-pressed', String(index === week.selectedDay));
    button.append(element('span', 'day-name', DAY_NAMES[index]));
    const status = element('span', 'day-status');
    status.append(element('i', `status-dot ${outcome.status === 'fits' ? '' : outcome.status === 'invalid' ? 'invalid' : 'conflict'}`), element('span', '', label));
    button.append(status);
    button.addEventListener('click', () => selectDay(index));
    return button;
  }));
  if (focusedDay !== undefined) nav.querySelector(`[data-day="${focusedDay}"]`)?.focus();
}
function populateForm() {
  const day = currentDay();
  for (const key of [...TIME_FIELDS, 'transitionMinutes']) form.elements.namedItem(key).value = day[key];
  form.elements.namedItem('fixedWorkout').checked = day.fixedWorkout;
  $('#evening-title').textContent = DAY_NAMES[week.selectedDay];
  $('.number-tag').textContent = String(week.selectedDay + 1).padStart(2, '0');
}
function clearErrors() {
  $('#form-errors').replaceChildren();
  for (const key of [...TIME_FIELDS, 'transitionMinutes', 'fixedWorkout']) form.elements.namedItem(key).removeAttribute('aria-invalid');
}
function renderTimeline() {
  const day = currentDay();
  const { errors, values: v } = validateDay(day);
  const timeline = $('#timeline');
  timeline.replaceChildren();
  if (errors.length) {
    timeline.append(element('p', 'no-timeline', 'Uzupełnij poprawne godziny, aby zobaczyć przebieg wieczoru.'));
    $('#timeline-summary').textContent = 'Wszystkie wydarzenia dotyczą tego samego dnia.';
    return;
  }
  const items = [
    { at: v.workoutStart, end: v.workoutEnd, title: 'Czas na trening', detail: day.fixedWorkout ? 'Stały termin · godzina pozostaje bez zmian' : 'Elastyczny trening · można szukać innej pory', type: 'workout' },
    { at: v.workoutEnd, end: v.workoutEnd + v.transitionMinutes, title: 'Chwila na przejście', detail: 'Powrót i przygotowanie do kolejnego zajęcia', type: 'buffer' },
    { at: v.careStart, end: v.careEnd, title: 'Spokojne usypianie', detail: 'Stały punkt wieczoru', type: 'care' }
  ].sort((a, b) => a.at - b.at || ({ workout: 0, buffer: 1, care: 2 }[a.type] - { workout: 0, buffer: 1, care: 2 }[b.type]));
  const displayEnd = value => value >= 1440 ? 'po północy' : formatTime(value);
  for (const item of items) {
    const row = element('div', 'timeline-item');
    const time = element('div', 'timeline-time', formatTime(item.at));
    const node = element('span', 'timeline-node'); node.setAttribute('aria-hidden', 'true');
    const card = element('div', `timeline-event ${item.type}`);
    const top = element('div', 'event-top');
    top.append(element('span', '', item.title), element('span', 'event-duration', `${item.end - item.at} min`));
    card.append(top, element('p', 'event-detail', `${formatTime(item.at)}–${displayEnd(item.end)} · ${item.detail}`));
    row.append(time, node, card); timeline.append(row);
  }
  $('#timeline-summary').textContent = `Dostępny wieczór: ${day.availableStart}–${day.availableEnd}. Zapas po treningu: ${day.transitionMinutes} min. Karty są uporządkowane według początku — mogą pokazywać konflikt.`;
}
function renderResult(outcome = null, accepted = false) {
  const region = $('#result');
  region.replaceChildren();
  region.className = 'result card';
  const head = element('div', 'result-head');
  const icon = element('span', 'result-icon', outcome?.status === 'fits' ? '✓' : outcome ? '!' : '✧');
  icon.setAttribute('aria-hidden', 'true');
  let title = 'Sprawdź, zanim ruszysz';
  if (outcome?.status === 'fits') title = accepted ? 'Zmiana przyjęta. Jest miejsce na oddech.' : 'Ten wieczór się mieści';
  else if (outcome?.status === 'invalid') title = 'Jeszcze kilka szczegółów';
  else if (outcome?.status === 'fixed-conflict') title = 'Stałe terminy potrzebują uwagi';
  else if (outcome?.status === 'no-slot') title = 'Brakuje miejsca w tym wieczorze';
  else if (outcome) title = 'Można ułożyć to spokojniej';
  head.append(icon, element('h3', '', title)); region.append(head);
  if (!outcome) {
    region.append(element('p', '', 'Godziny mogą stykać się na papierze, ale między nimi potrzebujesz czasu. Sprawdź wieczór, żeby zobaczyć pełny obraz.'));
    return;
  }
  if (outcome.status === 'invalid') {
    region.classList.add('invalid');
    region.append(element('p', '', 'Popraw pola zaznaczone w formularzu. Plan pozostaje bez zmian.'));
    return;
  }
  if (outcome.status === 'fits') {
    region.append(element('p', '', `Trening i ${currentDay().transitionMinutes} min zapasu mieszczą się obok usypiania. Wszystko pozostaje w dostępnym oknie wieczoru.`));
    return;
  }
  region.classList.add('conflict');
  const list = element('ul');
  outcome.reasons.forEach(reason => list.append(element('li', '', reason.text)));
  region.append(list);
  if (outcome.status === 'fixed-conflict') {
    region.append(element('p', 'result-note', 'Trening z trenerem i usypianie pozostają na swoich miejscach. Uzgodnij inną godzinę treningu, a potem wpisz ją tutaj i sprawdź ponownie.'));
  } else if (outcome.status === 'no-slot') {
    region.append(element('p', 'result-note', 'W podanym oknie nie ma dozwolonej pory na cały trening i zapas czasu. Możesz sprawdzić inne dostępne godziny. Żaden termin nie został przesunięty.'));
  } else {
    region.append(element('p', 'result-note', 'Te propozycje zachowują długość treningu, zapas po nim i porę usypiania. Wybierz zmianę, która Ci odpowiada.'));
    const suggestions = element('div', 'suggestions');
    outcome.suggestions.forEach(suggestion => {
      const row = element('div', 'suggestion');
      const text = element('div');
      text.append(element('strong', '', `${suggestion.start}–${suggestion.end}`), element('small', '', `Trening ${suggestion.label} · zapas ${currentDay().transitionMinutes} min`));
      const button = element('button', '', 'Wybierz'); button.type = 'button';
      button.setAttribute('aria-label', `Wybierz trening ${suggestion.start}–${suggestion.end}`);
      button.addEventListener('click', () => {
        const next = acceptSuggestion(currentDay(), suggestion);
        if (!next) { checked = null; renderResult(); return; }
        week.days[week.selectedDay] = next;
        populateForm(); clearErrors(); renderDays(); renderTimeline(); save();
        checked = checkDay(next); renderResult(checked, true);
        region.setAttribute('tabindex', '-1'); region.focus();
      });
      row.append(text, button); suggestions.append(row);
    });
    region.append(suggestions);
  }
}
function selectDay(index) {
  week.selectedDay = index; checked = null;
  populateForm(); clearErrors(); renderDays(); renderTimeline(); renderResult(); save();
}
form.addEventListener('input', () => {
  const day = currentDay();
  for (const key of [...TIME_FIELDS, 'transitionMinutes']) day[key] = form.elements.namedItem(key).value;
  day.fixedWorkout = form.elements.namedItem('fixedWorkout').checked;
  checked = null; clearErrors(); renderDays(); renderTimeline(); renderResult(); save();
});
form.addEventListener('submit', event => {
  event.preventDefault(); clearErrors();
  checked = checkDay(currentDay());
  if (checked.errors.length) {
    for (const error of checked.errors) {
      form.elements.namedItem(error.field).setAttribute('aria-invalid', 'true');
      $('#form-errors').append(element('p', '', `${fieldLabels[error.field]}: ${error.text}`));
    }
    form.elements.namedItem(checked.errors[0].field).focus();
  }
  renderResult(checked); renderTimeline();
});
populateForm(); renderDays(); renderTimeline(); renderResult();
$('#storage-status').textContent = loaded.status === 'restored' ? 'Twój zapisany tydzień został przywrócony w tej przeglądarce.'
  : loaded.status === 'recovery' ? 'Nie udało się odczytać zapisu. Pokazujemy fikcyjny przykład; sprawdzimy zapis przy pierwszej zmianie.'
  : 'Fikcyjny przykład na start. Twoje zmiany zapiszą się w tej przeglądarce.';
