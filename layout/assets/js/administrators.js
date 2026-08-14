(function () {
  document.querySelectorAll('a[href*="administrators_edit.html?id="]').forEach((editLink) => {
    const id = new URL(editLink.href).searchParams.get('id');
    const storedAdministrator = window.localStorage.getItem(`shopra-administrator-${id}`);
    const row = editLink.closest('[role="listitem"]');

    if (!storedAdministrator || !row) return;

    try {
      const administrator = JSON.parse(storedAdministrator);
      const name = row.querySelector('strong');
      const email = Array.from(row.querySelectorAll('span')).find((item) => item.textContent.includes('@'));
      const active = row.querySelector('.switch__input');

      if (name) name.textContent = administrator.name;
      if (email) email.textContent = administrator.email;
      if (active) active.checked = administrator.active;
    } catch (error) {
      window.localStorage.removeItem(`shopra-administrator-${id}`);
    }
  });
})();
