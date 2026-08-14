(function () {
  const modalStack = [];
  const footerPageContents = new Map();
  let footerPageEditor = null;
  let footerPageEditorPromise = null;
  let activeFooterPageTitle = null;

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    const index = modalStack.findIndex((entry) => entry.modal === modal);
    const [entry] = index === -1 ? [] : modalStack.splice(index, 1);
    document.body.classList.toggle('modal-open', modalStack.length > 0);
    entry?.trigger?.focus();
  }

  function openModal(modal, trigger) {
    if (!modal) return;
    const existing = modalStack.findIndex((entry) => entry.modal === modal);
    if (existing !== -1) modalStack.splice(existing, 1);
    modalStack.push({ modal, trigger });
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function syncFooterPageHtml() {
    if (!footerPageEditor) return;
    const html = footerPageEditor.getContent();
    footerPageEditor.targetElm.value = html;
    footerPageEditor.targetElm.dispatchEvent(new CustomEvent('editor:change', {
      bubbles: true,
      detail: { html },
    }));
  }

  function ensureFooterPageEditor() {
    if (footerPageEditor) return Promise.resolve(footerPageEditor);
    if (footerPageEditorPromise) return footerPageEditorPromise;
    const textarea = document.querySelector('#footer-page-modal [data-page-editor]');
    if (!textarea || typeof window.tinymce?.init !== 'function') return Promise.resolve(null);

    footerPageEditorPromise = window.tinymce.init({
      target: textarea,
      license_key: 'gpl',
      plugins: 'advlist autolink lists link image code',
      toolbar: 'undo redo | blocks | bold italic underline strikethrough forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image | blockquote hr | removeformat code',
      block_formats: 'Обычный текст=p; Заголовок 2=h2; Заголовок 3=h3; Заголовок 4=h4',
      toolbar_mode: 'sliding',
      menubar: false,
      statusbar: true,
      branding: false,
      promotion: false,
      height: 460,
      min_height: 420,
      resize: true,
      image_advtab: true,
      file_picker_types: 'image',
      content_style: 'body { font-family: Inter, Arial, sans-serif; font-size: 14px; line-height: 1.55; color: #2f2925; padding: 10px 12px; }',
      setup(editor) {
        editor.on('change input undo redo', syncFooterPageHtml);
      },
    }).then(([editor]) => {
      footerPageEditor = editor || null;
      footerPageEditorPromise = null;
      return footerPageEditor;
    }).catch((error) => {
      footerPageEditorPromise = null;
      console.error('TinyMCE initialization failed:', error);
      return null;
    });

    return footerPageEditorPromise;
  }

  async function preparePageModal(modal, trigger) {
    if (modal?.id !== 'footer-page-modal') return;
    activeFooterPageTitle = trigger.dataset.pageTitle || 'Страница магазина';
    const input = modal.querySelector('[data-page-title-input]');
    const heading = modal.querySelector('[data-page-modal-heading]');
    if (input) input.value = activeFooterPageTitle;
    if (heading) heading.textContent = activeFooterPageTitle;

    const editor = await ensureFooterPageEditor();
    if (!editor || modal.hidden) return;
    editor.setContent(footerPageContents.get(activeFooterPageTitle) || '');
    syncFooterPageHtml();
  }

  function saveFooterPage() {
    if (!footerPageEditor || !activeFooterPageTitle) return;
    footerPageContents.set(activeFooterPageTitle, footerPageEditor.getContent());
    syncFooterPageHtml();
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-modal-trigger]');
    if (trigger) {
      const modal = document.getElementById(trigger.getAttribute('aria-controls'));
      openModal(modal, trigger);
      preparePageModal(modal, trigger);
      return;
    }

    if (event.target.closest('[data-page-editor-save]')) saveFooterPage();

    const activeModal = modalStack.at(-1)?.modal;
    if (!activeModal) return;
    if (event.target.closest('[data-modal-close]') || event.target === activeModal) {
      closeModal(activeModal);
    }
  });

  document.addEventListener('keydown', function (event) {
    const activeModal = modalStack.at(-1)?.modal;
    if (event.key === 'Escape' && activeModal) closeModal(activeModal);
  });

  window.getFooterPageEditorHtml = function () {
    return footerPageEditor?.getContent() || '';
  };
})();
