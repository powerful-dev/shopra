(function () {
  const selector = '[data-popover]';
  const placementGap = 10;
  const viewportPadding = 8;
  let activePopover = null;

  function updatePopoverPlacement(popover, trigger, content) {
    const currentPlacement = popover.dataset.popoverPlacement || 'bottom';
    const alignment = currentPlacement.endsWith('-end')
      ? '-end'
      : currentPlacement.endsWith('-start')
        ? '-start'
        : '';
    const triggerRect = trigger.getBoundingClientRect();
    const availableBelow = Math.max(0, window.innerHeight - triggerRect.bottom - placementGap - viewportPadding);
    const availableAbove = Math.max(0, triggerRect.top - placementGap - viewportPadding);

    content.style.visibility = 'hidden';
    content.style.maxHeight = '';
    content.style.overflowY = '';
    content.removeAttribute('hidden');

    const contentHeight = content.getBoundingClientRect().height;
    const prefersTop = currentPlacement.startsWith('top');
    const prefersBottom = currentPlacement.startsWith('bottom');
    const opensBelow = prefersBottom || (!prefersTop && contentHeight <= availableBelow);
    const availableSpace = opensBelow ? availableBelow : availableAbove;

    popover.dataset.popoverPlacement = `${opensBelow ? 'bottom' : 'top'}${alignment}`;

    if (contentHeight > availableSpace) {
      content.style.maxHeight = `${availableSpace}px`;
      content.style.overflowY = 'auto';
    }

    content.style.visibility = '';
  }

  function closePopover(popover) {
    if (!popover) return;

    popover.classList.remove('is-open');
    const trigger = popover.querySelector('[data-popover-trigger]');
    const content = popover.querySelector('[data-popover-content]');

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (content) {
      content.setAttribute('hidden', '');
    }
  }

  function openPopover(popover) {
    if (!popover) return;

    if (activePopover && activePopover !== popover) {
      closePopover(activePopover);
    }

    const trigger = popover.querySelector('[data-popover-trigger]');
    const content = popover.querySelector('[data-popover-content]');

    if (!trigger || !content) return;

    updatePopoverPlacement(popover, trigger, content);
    activePopover = popover;
    popover.classList.add('is-open');

    trigger.setAttribute('aria-expanded', 'true');
  }

  function togglePopover(popover) {
    if (!popover) return;

    const isOpen = popover.classList.contains('is-open');

    if (isOpen) {
      closePopover(popover);
      if (activePopover === popover) {
        activePopover = null;
      }
    } else {
      openPopover(popover);
    }
  }

  function initPopover(popover) {
    const trigger = popover.querySelector('[data-popover-trigger]');
    const content = popover.querySelector('[data-popover-content]');

    if (!trigger || !content) {
      return;
    }

    if (!trigger.hasAttribute('aria-controls')) {
      const generatedId = `popover-${Math.random().toString(36).slice(2, 9)}`;
      trigger.setAttribute('aria-controls', generatedId);
      content.id = generatedId;
    }

    trigger.setAttribute('aria-haspopup', 'menu');
    content.setAttribute('role', 'menu');

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      togglePopover(popover);
    });

    content.addEventListener('click', (event) => {
      const closeTarget = event.target.closest('[data-popover-close]');
      if (closeTarget) {
        const isNavigableLink = closeTarget.matches('a[href]') && closeTarget.getAttribute('href') !== '#';
        const isFormSubmit = closeTarget.matches('button[type="submit"]') &&
          (closeTarget.hasAttribute('form') || closeTarget.closest('form'));
        if (!isNavigableLink && !isFormSubmit) {
          event.preventDefault();
        }
        closePopover(popover);
        activePopover = null;
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!activePopover) return;

    const popover = activePopover;
    const trigger = popover.querySelector('[data-popover-trigger]');
    const content = popover.querySelector('[data-popover-content]');

    if (trigger && content) {
      const clickedInside = popover.contains(event.target);
      if (!clickedInside) {
        closePopover(popover);
        activePopover = null;
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !activePopover) return;

    const trigger = activePopover.querySelector('[data-popover-trigger]');
    closePopover(activePopover);
    activePopover = null;

    if (trigger) {
      trigger.focus();
    }
  });

  document.querySelectorAll(selector).forEach(initPopover);
})();
