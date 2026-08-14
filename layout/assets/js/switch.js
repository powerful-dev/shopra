(function () {
  function update(control) {
    const enabled = control.getAttribute('aria-checked') === 'true';
    const target = document.getElementById(control.getAttribute('aria-controls'));
    if (!target) return;
    target.dataset.enabled = String(enabled);
    target.querySelectorAll('[data-switch-field]').forEach((field) => { field.disabled = !enabled; });
  }

  document.addEventListener('click', function (event) {
    const control = event.target.closest('[data-switch-control]');
    if (!control) return;
    control.setAttribute('aria-checked', String(control.getAttribute('aria-checked') !== 'true'));
    update(control);
  });

  document.querySelectorAll('[data-switch-control]').forEach(update);
})();
