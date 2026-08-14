(function () {
  const toggle = document.querySelector('[data-setup-toggle]');

  if (!toggle) {
    return;
  }

  const label = toggle.querySelector('[data-setup-toggle-label]');
  const expandedSteps = document.querySelectorAll('[data-setup-expanded-only]');
  const expandedLabel = toggle.dataset.labelExpanded;
  const collapsedLabel = toggle.dataset.labelCollapsed;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isOpen;

    toggle.setAttribute('aria-expanded', String(nextState));
    toggle.dataset.state = nextState ? 'open' : 'closed';

    expandedSteps.forEach((step) => {
      step.hidden = !nextState;
      step.classList.toggle('!hidden', !nextState);
    });

    if (label) {
      label.textContent = nextState ? expandedLabel : collapsedLabel;
    }
  });
})();
