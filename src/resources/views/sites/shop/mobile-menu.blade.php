<div id="mobile-menu" uk-offcanvas="overlay: true">
      <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <a class="uk-logo" href="{{ route('home') }}">VERA</a>
        <ul class="uk-nav uk-nav-default uk-nav-parent-icon uk-margin-large-top" uk-nav="multiple: false">
          <li class="uk-nav-header">Магазин</li>
          <li class="uk-parent">
            <a href="#">Каталог <span uk-nav-parent-icon></span></a>
            <ul class="uk-nav-sub" uk-nav="multiple: false">
              <li><a href="catalog.html">Все товары</a></li>
              <li class="uk-parent"><a href="#">Коллекции <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="catalog.html?category=0">Новая коллекция</a></li><li><a href="#capsule">Капсула Cobalt</a></li></ul></li>
              <li class="uk-parent"><a href="#">Категории <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="catalog.html?category=1">Жакеты</a></li><li><a href="catalog.html?category=2">Трикотаж</a></li><li><a href="catalog.html?category=3">Аксессуары</a></li></ul></li>
            </ul>
          </li>
          <li class="uk-parent"><a href="#">Новинки <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="catalog.html?category=0">Новые модели</a></li><li><a href="catalog.html">Бестселлеры</a></li></ul></li>
          <li class="uk-parent"><a href="#">Покупателям <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="#footer">Доставка и оплата</a></li><li><a href="#footer">Возврат и обмен</a></li><li><a href="#footer">Частые вопросы</a></li></ul></li>
          <li><a href="#about">О бренде</a></li>
          <li class="uk-nav-divider"></li>
          <li><a href="tel:+380671234567"><span class="uk-margin-small-right" uk-icon="receiver"></span>+380 67 123 45 67</a></li>
        </ul>
      </div>
    </div>

