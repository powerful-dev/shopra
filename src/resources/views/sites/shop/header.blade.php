@php($shopCatalogUrl = isset($category) ? route('catalog.show', ['slug' => $category->slug]) : 'catalog.html')
<header class="uk-background-default uk-box-shadow-small" uk-sticky="start: 0; animation: uk-animation-slide-top">
      <div class="uk-container uk-container-expand">
        <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
          <div class="uk-navbar-left">
            <a class="uk-navbar-toggle uk-text-emphasis uk-hidden@m" href="#mobile-menu" aria-label="Открыть меню" uk-toggle>
              <span uk-navbar-toggle-icon></span>
            </a>
            <a class="uk-navbar-item uk-logo uk-flex uk-flex-column uk-flex-middle" href="{{ route('home') }}">
              <strong>VERA</strong>
              <small class="uk-text-meta uk-text-uppercase">modern uniform</small>
            </a>
            <ul class="uk-navbar-nav uk-visible@m">
              <li @class(['uk-active' => isset($category)])>
                <a href="{{ $shopCatalogUrl }}">Каталог <span uk-navbar-parent-icon></span></a>
                <div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
                  <div class="uk-drop-grid uk-child-width-1-2" uk-grid>
                    <div>
                      <ul class="uk-nav uk-navbar-dropdown-nav uk-nav-parent-icon" uk-nav="multiple: true">
                        <li class="uk-nav-header">Коллекции</li>
                        <li class="uk-parent uk-open">
                          <a href="#">Новая коллекция <span uk-nav-parent-icon></span></a>
                          <ul class="uk-nav-sub">
                            <li><a href="{{ $shopCatalogUrl }}?category=0">Смотреть всё</a></li>
                            <li><a href="{{ $shopCatalogUrl }}?category=1">Жакеты Form</a></li>
                            <li><a href="{{ $shopCatalogUrl }}?category=2">Мягкий трикотаж</a></li>
                          </ul>
                        </li>
                        <li class="uk-parent">
                          <a href="#">Капсула Cobalt <span uk-nav-parent-icon></span></a>
                          <ul class="uk-nav-sub">
                            <li><a href="{{ route('home') }}#capsule">О капсуле</a></li>
                            <li><a href="{{ $shopCatalogUrl }}">Все сочетания</a></li>
                          </ul>
                        </li>
                        <li class="uk-nav-divider"></li>
                        <li><a href="{{ $shopCatalogUrl }}">Все товары</a></li>
                      </ul>
                    </div>
                    <div>
                      <ul class="uk-nav uk-navbar-dropdown-nav uk-nav-parent-icon" uk-nav="multiple: true">
                        <li class="uk-nav-header">Категории</li>
                        <li class="uk-parent">
                          <a href="#">Одежда <span uk-nav-parent-icon></span></a>
                          <ul class="uk-nav-sub"><li><a href="{{ $shopCatalogUrl }}?category=1">Жакеты</a></li><li><a href="{{ $shopCatalogUrl }}">Брюки</a></li><li><a href="{{ $shopCatalogUrl }}">Юбки</a></li></ul>
                        </li>
                        <li class="uk-parent">
                          <a href="#">Трикотаж <span uk-nav-parent-icon></span></a>
                          <ul class="uk-nav-sub"><li><a href="{{ $shopCatalogUrl }}?category=2">Топы</a></li><li><a href="{{ $shopCatalogUrl }}?category=2">Кардиганы</a></li><li><a href="{{ $shopCatalogUrl }}?category=2">Гольфы</a></li></ul>
                        </li>
                        <li class="uk-parent">
                          <a href="#">Аксессуары <span uk-nav-parent-icon></span></a>
                          <ul class="uk-nav-sub"><li><a href="{{ $shopCatalogUrl }}?category=3">Сумки</a></li><li><a href="{{ $shopCatalogUrl }}?category=3">ONE SIZE</a></li></ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <a href="{{ $shopCatalogUrl }}?category=0">Новинки <span uk-navbar-parent-icon></span></a>
                <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav uk-nav-parent-icon" uk-nav="multiple: true">
                    <li class="uk-nav-header">Подборки</li>
                    <li class="uk-parent uk-open"><a href="#">Новая коллекция <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="{{ $shopCatalogUrl }}?category=0">Новые модели</a></li><li><a href="{{ $shopCatalogUrl }}?category=1">Жакеты Form</a></li></ul></li>
                    <li class="uk-parent"><a href="#">Выбор редакции <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="{{ $shopCatalogUrl }}">Бестселлеры</a></li><li><a href="{{ route('home') }}#capsule">Лимитированный выпуск</a></li></ul></li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="#footer">Покупателям <span uk-navbar-parent-icon></span></a>
                <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav uk-nav-parent-icon" uk-nav="multiple: true">
                    <li class="uk-nav-header">Помощь и сервис</li>
                    <li class="uk-parent"><a href="#">Доставка и оплата <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="#footer">Условия доставки</a></li><li><a href="#footer">Способы оплаты</a></li></ul></li>
                    <li class="uk-parent"><a href="#">Возврат и обмен <span uk-nav-parent-icon></span></a><ul class="uk-nav-sub"><li><a href="#footer">Оформить возврат</a></li><li><a href="#footer">Обмен размера</a></li></ul></li>
                    <li><a href="#footer">Частые вопросы</a></li>
                  </ul>
                </div>
              </li>
              <li><a href="{{ route('home') }}#about">О бренде</a></li>
            </ul>
            <a class="uk-navbar-item uk-link-muted uk-visible@xl" href="tel:+380671234567">+380 67 123 45 67</a>
          </div>

          <div class="uk-navbar-right">
            <a class="uk-navbar-toggle uk-text-emphasis" href="#search-modal" aria-label="Поиск" uk-toggle>
              <span uk-icon="icon: search"></span>
            </a>
            <a id="{{ isset($category) ? 'catalog-favorite' : 'header-favorite' }}" class="uk-navbar-toggle uk-text-emphasis" href="#{{ isset($category) ? 'catalog-favorite' : 'header-favorite' }}" role="button" aria-label="Избранное" uk-toggle="target: #{{ isset($category) ? 'catalog-favorite' : 'header-favorite' }}; cls: uk-text-primary">
              <span uk-icon="icon: heart"></span>
            </a>
            <a class="uk-navbar-toggle uk-text-emphasis" href="#footer" aria-label="Профиль" uk-tooltip="Профиль покупателя">
              <span uk-icon="icon: user"></span>
            </a>
            <a class="uk-navbar-toggle uk-text-emphasis" href="#cart-modal" aria-label="Корзина" uk-toggle>
              <span uk-icon="icon: cart"></span>
              <span class="uk-badge" data-cart-count>0</span>
            </a>
          </div>
        </nav>
      </div>
    </header>

