@extends('sites.shop.layout')

@php
    $catalogUrl = route('catalog.show', ['slug' => $category->slug]);
@endphp

@section('title', ($category->seo_title ?: $category->name).' — VERA')
@section('description', $category->seo_description ?: ($category->description ?: 'Каталог VERA: категории, цены и фильтры.'))

@section('before-header')
    <div class="uk-background-primary uk-light uk-text-center uk-padding-small" data-shipping-banner>
      Бесплатная доставка по Украине от 3 000 ₴
    </div>
@endsection

@section('content')
<main>
      <section class="uk-cover-container uk-height-medium uk-light">
        <img src="{{ $shopAssetBase.'/images/fashion-cta-banner.webp' }}" alt="Коллекция VERA 2026" uk-cover>
        <div class="uk-position-cover shopra-gradient--left"></div>
        <div class="uk-position-center-left uk-position-large uk-width-2-3 uk-width-1-2@m">
          <ul class="uk-breadcrumb">
            <li><a href="{{ route('home') }}">Главная</a></li>
            @foreach ($breadcrumbs as $breadcrumb)
              <li><a href="{{ route('catalog.show', ['slug' => $breadcrumb->slug]) }}">{{ $breadcrumb->name }}</a></li>
            @endforeach
            <li><span>{{ $category->name }}</span></li>
          </ul>
          <p class="uk-text-uppercase uk-text-bold">Коллекция 2026</p>
          <h1 class="uk-heading-medium uk-margin-small-top">{{ $category->name }}</h1>
          <p class="uk-text-lead uk-width-xlarge">Чистые линии, выразительный цвет и вещи, которые остаются актуальными дольше сезона.</p>
        </div>
      </section>

      <section class="uk-section uk-section-small">
        <div class="uk-container uk-container-expand">
          <div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
            <div class="uk-flex uk-flex-middle">
              <a class="uk-button uk-button-default" href="#filter-modal" uk-toggle><span class="uk-margin-small-right" uk-icon="icon: settings"></span>Фильтры</a>
              <span class="uk-margin-left"><b data-catalog-count>{{ $products->total() }}</b> товаров</span>
            </div>
            <label class="uk-flex uk-flex-middle uk-margin-small-top uk-margin-remove-top@m">
              <span class="uk-margin-small-right uk-visible@s">Сортировать</span>
              <select class="uk-select uk-form-width-medium" data-catalog-sort>
                <option value="popular">По популярности</option>
                <option value="new">Сначала новинки</option>
                <option value="low">Цена: по возрастанию</option>
                <option value="high">Цена: по убыванию</option>
              </select>
            </label>
          </div>

          <hr>

          <div class="uk-grid-large" uk-grid>
            <aside class="uk-width-1-4@m uk-visible@m">
              <form class="uk-card uk-card-default uk-card-body">
                <div class="uk-flex uk-flex-between uk-flex-middle">
                  <h2 class="uk-card-title uk-margin-remove">Фильтры</h2>
                  <button class="uk-button uk-button-text" type="button" data-filter-reset>Сбросить</button>
                </div>
                <hr>
                @include('sites.shop.partials.catalog-filters', ['name' => 'desktop-category'])
                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-medium-top" type="button" data-filter-apply>Показать {{ $products->total() }} товаров</button>
              </form>
            </aside>

            <div class="uk-width-expand">
              <div id="products" class="uk-grid-medium uk-child-width-1-2@s uk-child-width-1-3@l" data-catalog-grid uk-grid>
                @forelse ($products as $product)
                  <div>
                    <article class="uk-card uk-card-default">
                      <div class="uk-card-media-top uk-inline uk-width-1-1">
                        <a href="{{ route('product.show', ['url' => $product['url']]) }}">
                          @if ($product['image_url'])
                            <img src="{{ $product['image_url'] }}" alt="{{ $product['name'] }}" width="720" height="960">
                          @else
                            <svg class="uk-width-1-1 uk-background-muted uk-text-muted" viewBox="0 0 720 960" role="img" aria-label="Изображение товара отсутствует">
                              <rect width="720" height="960" fill="currentColor" opacity=".08"></rect>
                              <g fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
                                <rect x="230" y="330" width="260" height="220" rx="12"></rect><circle cx="315" cy="410" r="28"></circle><path d="m250 520 95-90 65 60 45-40 35 35"></path>
                              </g>
                              <text x="360" y="610" text-anchor="middle" fill="currentColor" font-size="28">Нет изображения</text>
                            </svg>
                          @endif
                        </a>
                        <button id="catalog-wish-{{ $product['id'] }}" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить {{ $product['name'] }} в избранное" uk-toggle="target: #catalog-wish-{{ $product['id'] }}; cls: uk-button-primary" uk-icon="heart"></button>
                        <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавление в корзину пока недоступно" uk-icon="cart"></button>
                      </div>
                      <div class="uk-card-body uk-padding-small">
                        <h3 class="uk-card-title uk-margin-remove-bottom"><a class="uk-link-reset" href="{{ route('product.show', ['url' => $product['url']]) }}">{{ $product['name'] }}</a></h3>
                        @if ($product['formatted_price'])
                          <p class="uk-margin-small">
                            @if ($product['formatted_old_price'])<del class="uk-text-muted">{{ $product['formatted_old_price'] }}</del>@endif
                            <strong>{{ $product['formatted_price'] }}</strong>
                          </p>
                        @else
                          <p class="uk-margin-small uk-text-muted">Цена недоступна</p>
                        @endif
                      </div>
                    </article>
                  </div>
                @empty
                  <div class="uk-width-1-1">
                    <div class="uk-card uk-card-default uk-card-body uk-text-center uk-padding-large">
                      <span class="uk-text-muted" uk-icon="icon: cart; ratio: 2"></span>
                      <h2 class="uk-h3 uk-margin-small-top">В этой категории пока нет товаров</h2>
                      <p class="uk-text-muted uk-margin-remove-bottom">Загляните позже или выберите другую категорию.</p>
                    </div>
                  </div>
                @endforelse
              </div>

              {{ $products->links('sites.shop.partials.pagination') }}
            </div>
          </div>
        </div>
      </section>
    </main>
@endsection

@section('footer')
    <footer id="footer" class="uk-section uk-section-secondary">
      <div class="uk-container uk-container-expand">
        <div class="uk-grid-large uk-child-width-1-2 uk-child-width-1-4@m" uk-grid>
          <div><h2 class="uk-logo">VERA</h2><p>Витрина, каталог и сервисные страницы в одном визуальном стиле.</p></div>
          <div><h3 class="uk-h5 uk-text-uppercase">Магазин</h3><ul class="uk-list"><li><a href="{{ $catalogUrl }}?category=0">Новинки</a></li><li><a href="{{ $catalogUrl }}">Одежда</a></li><li><a href="{{ $catalogUrl }}?category=2">Трикотаж</a></li><li><a href="{{ $catalogUrl }}?category=3">Аксессуары</a></li></ul></div>
          <div><h3 class="uk-h5 uk-text-uppercase">Покупателям</h3><ul class="uk-list"><li><a href="{{ route('home') }}#footer">Доставка и оплата</a></li><li><a href="{{ route('home') }}#footer">Возврат</a></li><li><a href="{{ route('home') }}#footer">Контакты</a></li><li><a href="{{ route('home') }}#footer">FAQ</a></li></ul></div>
          <div><h3 class="uk-h5 uk-text-uppercase">Страницы</h3><ul class="uk-list"><li><a href="{{ route('home') }}">Главная</a></li><li><a href="{{ $catalogUrl }}">Каталог</a></li><li><a href="#cart-modal" uk-toggle>Корзина</a></li><li><a href="{{ route('home') }}#about">О бренде</a></li></ul></div>
        </div>
        <hr class="uk-margin-large-top">
        <small>© 2026 VERA · Магазин работает на Shopra</small>
      </div>
    </footer>
@endsection

@push('modals')
    <div id="filter-modal" uk-modal>
      <aside class="uk-modal-dialog uk-position-top-left uk-width-1-1 uk-width-medium@s uk-height-viewport uk-flex uk-flex-column">
        <button class="uk-modal-close-default" type="button" aria-label="Закрыть фильтры" uk-close></button>
        <header class="uk-modal-header"><h2 class="uk-modal-title">Фильтры</h2></header>
        <div class="uk-modal-body uk-overflow-auto uk-flex-1">
          <form>
            <button class="uk-button uk-button-text" type="button" data-filter-reset>Сбросить всё</button>
            <hr>
            @include('sites.shop.partials.catalog-filters', ['name' => 'mobile-category'])
          </form>
        </div>
        <footer class="uk-modal-footer"><button class="uk-button uk-button-primary uk-width-1-1 uk-modal-close" type="button" data-filter-apply>Показать {{ $products->total() }} товаров</button></footer>
      </aside>
    </div>

    @include('sites.shop.partials.search-modal')

    <div id="variant-modal" uk-modal>
      <div class="uk-modal-dialog uk-width-xlarge uk-margin-auto-vertical">
        <button class="uk-modal-close-default uk-icon-button uk-close-large uk-position-small" type="button" aria-label="Закрыть выбор модификации" uk-close></button>
        <header class="uk-modal-header"><p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Выберите модификацию</p><h2 class="uk-modal-title uk-margin-small-top" data-variant-name>Жакет Form 02</h2></header>
        <section class="uk-modal-body uk-background-muted uk-padding-small"><div class="uk-grid-small uk-flex-middle" uk-grid><div class="uk-width-auto"><img src="{{ $shopAssetBase.'/products/fashion-00.webp' }}" alt="Жакет Form 02" width="80" height="107" data-variant-image></div><div class="uk-width-expand"><p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">VERA</p><p class="uk-h3 uk-margin-small-top uk-margin-small-bottom" data-variant-price>4 900 ₴</p><p class="uk-text-meta uk-margin-remove">Выбранные параметры попадут в корзину отдельной строкой.</p></div></div></section>
        <form data-variant-form>
          <div class="uk-modal-body">
            <fieldset class="uk-fieldset"><div class="uk-flex uk-flex-between uk-flex-middle"><legend class="uk-legend">Цвет</legend><strong data-variant-color-current>Кобальт</strong></div><div class="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid><div><label class="uk-button uk-button-primary uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Кобальт" checked><span class="uk-icon-button uk-background-primary uk-margin-small-right uk-flex-none"></span>Кобальт</label></div><div><label class="uk-button uk-button-default uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Чернильный"><span class="uk-icon-button uk-background-secondary uk-margin-small-right uk-flex-none"></span>Чернильный</label></div><div><label class="uk-button uk-button-default uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Молочный"><span class="uk-icon-button uk-background-muted uk-margin-small-right uk-flex-none"></span>Молочный</label></div></div></fieldset>
            <fieldset class="uk-fieldset uk-margin-top"><div class="uk-flex uk-flex-between uk-flex-middle"><legend class="uk-legend">Размер</legend><strong data-variant-size-current>XS</strong></div><div class="uk-grid-small uk-child-width-auto" uk-grid><div><label class="uk-button uk-button-primary uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="XS" checked>XS</label></div><div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="S">S</label></div><div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="M">M</label></div><div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="L">L</label></div></div></fieldset>
          </div>
          <footer class="uk-modal-footer"><button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-flex uk-flex-between uk-flex-middle" type="button" data-cart-confirm><span>Добавить выбранное</span><span uk-icon="icon: arrow-right"></span></button></footer>
        </form>
      </div>
    </div>

    @include('sites.shop.partials.cart-modal')
@endpush
