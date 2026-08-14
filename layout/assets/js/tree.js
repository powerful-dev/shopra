(function () {
  document.querySelectorAll('.category-tree-row').forEach(function (row) {
    const trigger = row.querySelector(':scope > button:last-of-type');
    if (!trigger || trigger.matches('[data-tree-toggle]')) return;

    row.classList.add('popover');
    row.dataset.popover = '';
    row.dataset.popoverPlacement = 'bottom-end';
    trigger.classList.add('popover__trigger');
    trigger.dataset.popoverTrigger = '';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Действия с категорией');
    trigger.insertAdjacentHTML('afterend', `
      <div class="popover__content !min-w-[145px] !rounded-[9px] !p-[5px]" data-popover-content hidden>
        <button class="popover__item min-h-8 border-0 bg-transparent !px-2 !py-0 text-left !text-[12px]" type="button" data-popover-close>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
          Переименовать
        </button>
        <button class="popover__item min-h-8 border-0 bg-transparent !px-2 !py-0 text-left !text-[12px]" type="button" data-popover-close>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><path d="M10 11v6M14 11v6"></path></svg>
          Удалить
        </button>
      </div>
    `);
  });

  document.addEventListener('click', function (event) {
    const toggle = event.target.closest('[data-tree-toggle]');
    if (!toggle) return;

    const tree = toggle.closest('[role="tree"]');
    const branch = toggle.dataset.treeToggle;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.closest('[role="treeitem"]')?.setAttribute('aria-expanded', String(!expanded));

    function setBranchVisibility(parent, visible) {
      tree?.querySelectorAll(`[data-tree-parent="${parent}"]`).forEach(function (item) {
        item.hidden = !visible;
        const childToggle = item.querySelector(':scope > [data-tree-toggle]');
        if (childToggle) {
          const childVisible = visible && childToggle.getAttribute('aria-expanded') === 'true';
          setBranchVisibility(childToggle.dataset.treeToggle, childVisible);
        }
      });
    }

    setBranchVisibility(branch, expanded === false);
  });
})();
