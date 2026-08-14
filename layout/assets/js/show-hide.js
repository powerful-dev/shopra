(function () {
  function setPanelState(trigger, panel, isOpen) {
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.hidden = !isOpen;
    panel.classList.toggle('!hidden', !isOpen);

    if (isOpen) {
      panel.querySelector('input, select, textarea, button')?.focus();
    } else {
      trigger.focus();
    }
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-show-hide-trigger]');

    if (trigger) {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      setPanelState(trigger, panel, trigger.getAttribute('aria-expanded') !== 'true');
      return;
    }

    const close = event.target.closest('[data-show-hide-close]');
    if (!close) return;

    const panel = close.closest('[data-show-hide-panel]');
    const panelTrigger = panel && document.querySelector(`[data-show-hide-trigger][aria-controls="${panel.id}"]`);
    if (panel && panelTrigger) setPanelState(panelTrigger, panel, false);
  });

  document.addEventListener('submit', function (event) {
    if (event.target.closest('[data-show-hide-panel]')) event.preventDefault();
  });
})();
