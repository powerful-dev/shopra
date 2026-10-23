<div id="cart-modal" uk-modal>
  <aside class="uk-modal-dialog uk-position-top-right uk-width-1-1 uk-width-large@s uk-height-viewport uk-flex uk-flex-column">
    <button class="uk-modal-close-default" type="button" aria-label="Закрыть корзину" uk-close></button>
    <header class="uk-card-header">
      <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">VERA</p>
      <h2 class="uk-card-title uk-margin-small-top">Корзина <span class="uk-badge" data-cart-count>0</span></h2>
    </header>
    <section class="uk-card-header uk-background-muted">
      <p class="uk-margin-small-bottom" data-cart-shipping></p>
      <progress class="uk-progress uk-margin-remove" value="0" max="3000" data-cart-progress></progress>
    </section>
    <div class="uk-card-body uk-height-max-large uk-overflow-auto uk-flex-1" data-cart-items></div>
    <footer class="uk-card-footer">
      <div class="uk-grid-small uk-child-width-1-2 uk-flex-middle" uk-grid>
        <div><strong>Предварительный итог</strong></div>
        <div class="uk-text-right"><strong class="uk-h3 uk-margin-remove" data-cart-subtotal>0 ₴</strong></div>
      </div>
      <p class="uk-text-meta">Доставка и скидки рассчитываются при оформлении.</p>
      <button class="uk-button uk-button-primary uk-button-large uk-width-1-1" type="button" data-cart-checkout>Оформить заказ <span uk-icon="icon: arrow-right"></span></button>
      <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-top uk-modal-close" type="button" data-cart-continue>Продолжить покупки</button>
    </footer>
  </aside>
</div>
