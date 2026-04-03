function pad(n) { return String(n).padStart(2, '0'); }

function getGreeting(h) {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function tick() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  document.getElementById('clock').textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  document.getElementById('greeting').textContent = getGreeting(h);
}

tick();
setInterval(tick, 1000);

const toggle = document.getElementById('country-toggle');
const dropdown = document.getElementById('country-dropdown');
const wrapper = toggle.closest('.country-wrapper');
const label = document.getElementById('country-label');

toggle.addEventListener('click', (e) => {
  e.stopPropagation();
  wrapper.classList.toggle('open');
});

dropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    label.textContent = link.dataset.country;
    dropdown.querySelectorAll('a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    wrapper.classList.remove('open');
  });
});

document.addEventListener('click', () => {
  wrapper.classList.remove('open');
});
