// Enhance an already-readable page. Content never depends on JavaScript to exist.
const body = document.body;
const sections = [...document.querySelectorAll('.window section')];
const folders = [...document.querySelectorAll('.folders a')];
const windowTitle = document.querySelector('#window-title');
const closeButton = document.querySelector('.close-button');
const readingButton = document.querySelector('#reading-toggle');
const lightButton = document.querySelector('#light-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let reading = false;
let lastLauncher = folders[0];

function currentSection() {
  return sections.find(section => `#${section.id}` === location.hash) || sections[0];
}

// URL fragments make each window shareable and keep browser Back/Forward useful.
function showSection(moveFocus = false) {
  const selected = currentSection();
  sections.forEach(section => { section.hidden = !reading && section !== selected; });
  folders.forEach(link => {
    if (link.hash === `#${selected.id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  windowTitle.textContent = folders.find(link => link.hash === `#${selected.id}`).textContent;
  closeButton.hidden = reading || selected.id === 'about';
  document.querySelector('.window-body').scrollTop = 0;
  if (moveFocus) selected.querySelector('h1, h2').focus({ preventScroll: !reading });
}

// Preserve old CV bookmarks; the retired Experience window returns to the bio.
if (location.hash === '#cv') history.replaceState(null, '', '#resume');
if (location.hash === '#experience') {
  history.replaceState(null, '', '#about');
}
body.classList.add('enhanced');
showSection();
lastLauncher = folders.find(link => link.hash === `#${currentSection().id}`);
addEventListener('hashchange', () => showSection(true));

// Let real links keep their normal modified-click and copy-link behavior.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  // Skip navigation without replacing the selected window’s URL fragment.
  if (link?.hash === '#content') {
    event.preventDefault();
    document.querySelector('#content').focus();
    return;
  }
  if (!link || !sections.some(section => link.hash === `#${section.id}`)) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  lastLauncher = link;
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  showSection(true);
});

closeButton.addEventListener('click', () => {
  history.pushState(null, '', '#about');
  showSection();
  // A link in the closed section is hidden; use that section’s folder instead.
  const returnTarget = lastLauncher.closest('section')
    ? folders.find(link => link.hash === `#${lastLauncher.closest('section').id}`)
    : lastLauncher;
  returnTarget.focus();
});

readingButton.addEventListener('click', () => {
  reading = !reading;
  body.classList.toggle('reading', reading);
  readingButton.setAttribute('aria-pressed', String(reading));
  readingButton.textContent = reading ? 'Desktop mode' : 'Reading mode';
  showSection();
});

function setMotion(paused) {
  body.classList.toggle('paused', paused);
  body.classList.toggle('motion-allowed', !paused);
}
setMotion(reducedMotion.matches);
reducedMotion.addEventListener('change', event => setMotion(event.matches));

lightButton.addEventListener('click', () => {
  const isOn = lightButton.getAttribute('aria-pressed') !== 'true';
  lightButton.setAttribute('aria-pressed', String(isOn));
  document.querySelector('.aquarium').classList.toggle('is-dark', !isOn);
});

// Map the HTML plane onto the four measured corners of the painted monitor.
// Plate coordinates: (222,120), (1050,131), (1064,657), (210,670).
// Only the perspective terms change with image scale; text remains real HTML.
const room = document.querySelector('.room');
new ResizeObserver(() => {
  const scale = room.clientWidth / 1586;
  room.style.setProperty('--screen-perspective', `matrix3d(
    1.017813, .013522, 0, ${.00005277266 / scale},
    -.021138, .968820, 0, ${-.00005669149 / scale},
    0, 0, 1, 0, 0, 0, 0, 1)`);
}).observe(room);
