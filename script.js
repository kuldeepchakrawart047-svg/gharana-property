document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
  }));

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  const cards = [...document.querySelectorAll('.property-card')];
  const filters = document.querySelectorAll('.filter');
  let activePurpose = 'all';
  function filterCards() {
    const type = document.querySelector('#type').value;
    const purpose = document.querySelector('#purpose').value;
    const location = document.querySelector('#location').value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const purposeMatch = (activePurpose === 'all' || card.dataset.purpose === activePurpose) &&
        (purpose === 'all' || card.dataset.purpose === purpose);
      const typeMatch = type === 'all' || card.dataset.type === type;
      const locationMatch = !location || card.dataset.location.includes(location);
      const show = purposeMatch && typeMatch && locationMatch;
      card.hidden = !show;
      if (show) shown++;
    });
    document.querySelector('#noResults').hidden = shown !== 0;
    document.querySelector('.filter[data-filter="all"] span').textContent = String(shown).padStart(2, '0');
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    activePurpose = button.dataset.filter;
    document.querySelector('#purpose').value = 'all';
    filterCards();
  }));
  document.querySelector('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    activePurpose = 'all';
    filters.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
    filterCards();
    document.querySelector('#properties').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('#type').addEventListener('change', filterCards);

  // Save / favourite buttons.
  const toast = document.querySelector('#toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  document.querySelectorAll('.heart').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('saved');
    button.textContent = button.classList.contains('saved') ? '♥' : '♡';
    showToast(button.classList.contains('saved') ? 'Property saved to your favourites.' : 'Removed from your favourites.');
  }));

  // Property details modal.
  const modal = document.querySelector('#propertyModal');
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  document.querySelectorAll('.details-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#modalTitle').textContent = button.dataset.name;
    document.querySelector('#modalType').textContent = button.dataset.type;
    document.querySelector('#modalPrice').textContent = button.dataset.price;
    document.querySelector('#modalLocation').textContent = '⌖ ' + button.dataset.location;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }));
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  document.querySelector('.modal-contact').addEventListener('click', closeModal);

  // Demo form: no backend is connected; clearly report that the UI worked.
  document.querySelector('#contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get('name').trim();
    document.querySelector('#formFeedback').textContent = `Thanks${name ? ', ' + name : ''}! This demo form is ready to connect to your email or CRM.`;
    document.querySelector('#formFeedback').style.color = '#667c27';
    event.currentTarget.reset();
  });
});