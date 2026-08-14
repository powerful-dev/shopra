document.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-chip-toggle]');
  if (chip) {
    const active = chip.getAttribute('aria-pressed') !== 'true';
    chip.setAttribute('aria-pressed', String(active));
    chip.classList.toggle('border-[#d39a78]', active);
    chip.classList.toggle('bg-[#fff3eb]', active);
    chip.classList.toggle('text-[color:var(--color-accent)]', active);
    chip.querySelector('[data-chip-check]')?.classList.toggle('hidden', !active);
    return;
  }

  const option = event.target.closest('[data-selection-option]');
  if (!option) return;

  const group = option.closest('[data-selection-group]');
  if (!group) return;

  const value = option.dataset.selectionOption;

  group.querySelectorAll('[data-selection-option]').forEach((item) => {
    const active = item === option;
    item.setAttribute('aria-pressed', String(active));
    if (group.dataset.selectionStyle === 'tabs') {
      item.classList.toggle('bg-white', active);
      item.classList.toggle('text-[color:var(--color-accent)]', active);
      item.classList.toggle('shadow-[0_2px_7px_rgba(59,40,28,.08)]', active);
    } else {
      item.classList.toggle('border-[#d39a78]', active);
      item.classList.toggle('bg-[#fff3eb]', active);
      item.classList.toggle('text-[color:var(--color-accent)]', active);
    }
    item.querySelector('[data-selection-check]')?.classList.toggle('hidden', !active);
  });

  group.querySelectorAll('[data-selection-panel]').forEach((panel) => {
    const active = panel.dataset.selectionPanel === value;
    panel.hidden = !active;
    panel.classList.toggle('!hidden', !active);
  });
});
