(function () {
  const form = document.querySelector('[data-administrator-form]');
  if (!form) return;

  const administrators = {
    alexey: { name: 'Алексей Морозов', email: 'alexey@shopra.store', active: true },
    maria: { name: 'Мария Коваленко', email: 'maria@shopra.store', active: true },
    irina: { name: 'Ирина Бондаренко', email: 'irina@shopra.store', active: false },
    oleg: { name: 'Олег Шевченко', email: 'oleg@shopra.store', active: true },
    natalia: { name: 'Наталья Иванова', email: 'natalia@shopra.store', active: false }
  };
  const id = new URLSearchParams(window.location.search).get('id') || 'alexey';
  const storageKey = `shopra-administrator-${id}`;
  const storedAdministrator = window.localStorage.getItem(storageKey);
  let administrator = administrators[id] || administrators.alexey;

  if (storedAdministrator) {
    try {
      administrator = JSON.parse(storedAdministrator);
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }
  }
  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const active = form.querySelector('[name="active"]');
  const password = form.querySelector('[name="password"]');
  const passwordConfirmation = form.querySelector('[name="password_confirmation"]');
  const alert = document.querySelector('[data-form-alert]');

  name.value = administrator.name;
  email.value = administrator.email;
  active.checked = administrator.active;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    passwordConfirmation.setCustomValidity(
      password.value === passwordConfirmation.value
        ? ''
        : passwordConfirmation.dataset.mismatchMessage
    );

    if (!form.reportValidity()) return;

    window.localStorage.setItem(storageKey, JSON.stringify({
      name: name.value.trim(),
      email: email.value.trim(),
      active: active.checked
    }));
    password.value = '';
    passwordConfirmation.value = '';

    if (alert) {
      alert.hidden = false;
      alert.querySelector('[data-alert-text]').textContent = alert.dataset.successMessage;
    }
  });

  passwordConfirmation.addEventListener('input', () => {
    passwordConfirmation.setCustomValidity('');
  });
})();
