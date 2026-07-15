const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');

if (header && navToggle) {
  navToggle.addEventListener('click', () => {
    const open = header.dataset.menuOpen === 'true';
    header.dataset.menuOpen = String(!open);
    navToggle.setAttribute('aria-expanded', String(!open));
  });
}

navLinks.forEach((link) => link.addEventListener('click', () => {
  if (header && navToggle) {
    header.dataset.menuOpen = 'false';
    navToggle.setAttribute('aria-expanded', 'false');
  }
}));
