const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');

if (header && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.getAttribute('data-menu-open') === 'true';
    header.setAttribute('data-menu-open', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (header) {
      header.setAttribute('data-menu-open', 'false');
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});
