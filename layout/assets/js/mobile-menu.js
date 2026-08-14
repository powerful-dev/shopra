(function () {
  const trigger = document.querySelector('[data-mobile-menu-trigger]');
  const closeButton = document.querySelector('[data-mobile-menu-close]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  const overlay = document.querySelector('[data-mobile-overlay]');
  const navigation = drawer?.querySelector('[data-mobile-menu-nav]');

  if (!trigger || !closeButton || !drawer || !overlay) {
    return;
  }

  function setOpen(isOpen) {
    trigger.setAttribute('aria-expanded', String(isOpen));
    drawer.classList.toggle('max-lg:!-translate-x-full', !isOpen);
    overlay.hidden = !isOpen;
    overlay.classList.toggle('!hidden', !isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  }

  trigger.addEventListener('click', () => {
    setOpen(trigger.getAttribute('aria-expanded') !== 'true');
  });

  closeButton.addEventListener('click', () => setOpen(false));
  overlay.addEventListener('click', () => setOpen(false));

  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      trigger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      setOpen(false);
    }
  });
})();
