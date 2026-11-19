// GTA 6 trophy tracker: checklist saved in localStorage, with export/import,
// kind and grade filters, a spoiler setting, and a guide panel beside the list.
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoiler-v1';
const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const earnedEl = document.getElementById('earned');
const spoilerEl = document.getElementById('spoiler');
const countLine = document.getElementById('countLine');
const earnedCount = document.getElementById('earnedCount');
const barFill = document.getElementById('barFill');
const progressNote = document.getElementById('progressNote');

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
spoilerEl.checked = localStorage.getItem(SPOILER_KEY) !== 'off';
let selected = null;

// Deep links: ?kind=story&grade=silver&spoiler=off&select=28&search=meditate
// lets a reader — and a screenshot — open the guide already filtered to one view.
const params = new URLSearchParams(location.search);
if (params.get('kind') && [...kindEl.options].some((o) => o.value === params.get('kind'))) kindEl.value = params.get('kind');
if (params.get('grade') && [...gradeEl.options].some((o) => o.value === params.get('grade'))) gradeEl.value = params.get('grade');
if (params.get('spoiler') === 'off') spoilerEl.checked = false;
if (params.get('spoiler') === 'on') spoilerEl.checked = true;
if (params.get('search')) searchEl.value = params.get('search');
const selectId = Number(params.get('select'));

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

function isStory(t) { return t.kind === 'story' || t.hidden === true; }
function hiddenBySpoiler(t) {
  return spoilerEl.checked && isStory(t) && !earned.has(t.name);
}
function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoilerEl.checked ? 'on' : 'off');
}
function sourceLinks(t) {
  return (t.sources || []).map((s) => {
    if (s.url) return `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`;
    return `<span>${s.name}</span>`;
  }).join(' · ');
}
function showDetail(t) {
  selected = t.name;
  if (hiddenBySpoiler(t)) {
    detailEl.innerHTML = `<h2>Hidden story trophy</h2>
      <p class="muted">This is a story trophy. Turn off “Hide story spoilers until earned”, or earn it in the game, to read its name, description and guide.</p>
      <p class="guide">Its grade is ${t.grade}. It is ${t.missable ? 'flagged as possibly missable' : 'not missable'}.</p>`;
    return;
  }
  detailEl.innerHTML = `<h2>${t.name}</h2>
    <p><span class="badge ${t.grade}">${t.grade}</span> <span class="badge">${t.kind}</span>${t.missable ? ' <span class="badge missable">Possibly missable</span>' : ''}</p>
    <p class="muted">${t.description}</p>
    <p class="guide">${t.guide}</p>
    <p class="sources"><strong>Sources:</strong> ${sourceLinks(t)}</p>
    <p><button id="detailToggle" type="button">${earned.has(t.name) ? 'Mark as not earned' : 'Mark as earned'}</button></p>`;
  document.getElementById('detailToggle').addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    save(); render();
  });
}
function render() {
  const q = searchEl.value.trim().toLowerCase();
  const shown = trophies.filter((t) => {
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (earnedEl.value === 'earned' && !earned.has(t.name)) return false;
    if (earnedEl.value === 'todo' && earned.has(t.name)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  countLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies.`;
  earnedCount.textContent = String(earned.size);
  barFill.style.width = `${Math.round((earned.size / trophies.length) * 100)}%`;
  progressNote.textContent = earned.size === trophies.length
    ? 'All 55 earned — Vice Got a Price! is yours.'
    : `${trophies.length - earned.size} to go. Progress is saved in this browser only.`;
  listEl.replaceChildren();
  if (!shown.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match these filters. Try clearing the search or choosing All kinds.';
    listEl.append(p);
    return;
  }
  for (const t of shown) {
    const card = document.createElement('article');
    card.className = 'card' + (earned.has(t.name) ? ' earned' : '') + (selected === t.name ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      save(); render();
    });
    const body = document.createElement('div');
    const hidden = hiddenBySpoiler(t);
    const title = document.createElement('h3');
    title.textContent = hidden ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Hidden until earned — turn off the spoiler setting to reveal it.' : t.description;
    const badges = document.createElement('p');
    badges.className = 'badges';
    badges.innerHTML = `<span class="badge ${t.grade}">${t.grade}</span> <span class="badge">${t.kind}</span>${t.missable ? ' <span class="badge missable">Possibly missable</span>' : ''}`;
    const preview = document.createElement('p');
    preview.className = 'preview';
    preview.textContent = hidden ? '' : t.guide;
    body.append(title, desc, badges, preview);
    card.append(box, body);
    card.addEventListener('click', () => { showDetail(t); render(); });
    listEl.append(card);
  }
}
document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set((names || []).filter((n) => known.has(n)));
    save(); render();
  } catch {
    countLine.textContent = 'That file could not be imported: it is not a progress file from this guide.';
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  earned = new Set();
  save(); render();
});
spoilerEl.addEventListener('change', () => { saveSpoiler(); render(); });
for (const el of [searchEl, kindEl, gradeEl, earnedEl]) el.addEventListener('input', render);
render();
const selectedTrophy = trophies.find((t) => t.id === selectId) || trophies[0];
if (selectedTrophy) showDetail(selectedTrophy);
