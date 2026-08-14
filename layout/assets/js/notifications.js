(function () {
  const notifications = document.querySelector('[data-notifications]');
  const triggers = Array.from(document.querySelectorAll('[data-notifications-trigger]'));

  if (!notifications || triggers.length === 0) {
    return;
  }

  const dropdown = notifications.querySelector('[data-notifications-dropdown]');
  let activeTrigger = null;

  if (!dropdown) {
    return;
  }

  function setOpen(isOpen, trigger = activeTrigger) {
    triggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));

    if (isOpen && trigger) {
      activeTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true');

      if (trigger.dataset.notificationsPlacement === 'mobile') {
        document.body.append(dropdown);
      } else {
        notifications.append(dropdown);
      }
    }

    dropdown.hidden = !isOpen;
    dropdown.classList.toggle('!hidden', !isOpen);

    if (!isOpen) {
      activeTrigger = null;
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(trigger.getAttribute('aria-expanded') !== 'true', trigger);
    });
  });

  dropdown.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', (event) => {
    const clickedTrigger = triggers.some((trigger) => trigger.contains(event.target));

    if (!clickedTrigger && !dropdown.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeTrigger) {
      const trigger = activeTrigger;
      setOpen(false);
      trigger.focus();
    }
  });

  window.addEventListener('resize', () => setOpen(false));
})();
