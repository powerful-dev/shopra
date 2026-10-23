<div id="search-modal" class="uk-flex-top" uk-modal>
  <div class="uk-modal-dialog uk-width-xlarge uk-height-1-1 uk-flex uk-flex-column uk-overflow-hidden">
    <button class="uk-modal-close-default uk-icon-button uk-close-large uk-position-small" type="button" aria-label="Закрыть поиск" uk-close></button>
    <header class="uk-modal-header">
      <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">VERA</p>
      <h2 class="uk-modal-title uk-margin-small-top">Поиск</h2>
    </header>
    <div class="uk-modal-body uk-background-muted uk-flex uk-flex-column uk-flex-1 uk-overflow-hidden">
      <form class="uk-search uk-search-default uk-width-1-1" data-search-form>
        <span class="uk-search-icon-flip" uk-search-icon></span>
        <input class="uk-search-input uk-form-large" type="search" placeholder="Поиск товаров" aria-label="Поиск товаров" autocomplete="off" data-search-input>
      </form>
      <h3 class="uk-h5 uk-text-meta uk-text-uppercase uk-text-bold uk-margin-top" data-search-title>Популярные товары</h3>
      <div class="uk-overflow-auto uk-flex-1"><ul class="uk-list uk-list-divider uk-margin-remove-bottom" data-search-results></ul></div>
    </div>
  </div>
</div>
