@extends('sites.shop.layout')

@php
    $gallery = [
        ['src' => 'products/fashion-01.webp', 'alt' => 'Пальто Axis, фото 1'],
        ['src' => 'products/fashion-00.webp', 'alt' => 'Образ коллекции, фото 2'],
        ['src' => 'products/fashion-02.webp', 'alt' => 'Образ коллекции, фото 3'],
        ['src' => 'products/fashion-03.webp', 'alt' => 'Образ коллекции, фото 4'],
        ['src' => 'products/fashion-04.webp', 'alt' => 'Образ коллекции, фото 5'],
        ['src' => 'products/fashion-05.webp', 'alt' => 'Образ коллекции, фото 6'],
        ['src' => 'products/fashion-06.webp', 'alt' => 'Образ коллекции, фото 7'],
        ['src' => 'products/fashion-07.webp', 'alt' => 'Образ коллекции, фото 8'],
        ['src' => 'images/fashion-combo-banner.webp', 'alt' => 'Образ коллекции, фото 9'],
        ['src' => 'images/fashion-cta-banner.webp', 'alt' => 'Образ коллекции, фото 10'],
        ['src' => 'images/fashion-hero.png', 'alt' => 'Превью видео', 'video' => 'video/fashion-loop-v2.mp4'],
    ];
    $recommendations = [
        ['id' => 0, 'name' => 'Жакет Form 02', 'oldPrice' => '5 600 ₴', 'price' => '4 900 ₴', 'sizes' => 'XS · S · M · L', 'badge' => 'NEW'],
        ['id' => 2, 'name' => 'Топ Line Wine', 'oldPrice' => '2 200 ₴', 'price' => '1 850 ₴', 'sizes' => 'XS · S · M · L', 'badge' => null],
        ['id' => 3, 'name' => 'Брюки Wide', 'oldPrice' => '3 400 ₴', 'price' => '2 950 ₴', 'sizes' => 'S · M · L · XL', 'badge' => null],
        ['id' => 4, 'name' => 'Сумка Mini Fold', 'oldPrice' => '2 700 ₴', 'price' => '2 300 ₴', 'sizes' => 'ONE SIZE', 'badge' => 'BEST'],
    ];
@endphp

@section('title', 'Пальто Axis — VERA')
@section('description', 'Пальто Axis за 6 800 ₴. Доставка, оплата и характеристики в магазине VERA.')

@section('before-header')
    <div class="uk-background-primary uk-light uk-text-center uk-padding-small" data-shipping-banner>Бесплатная доставка по Украине от 3 000 ₴</div>
@endsection

@section('content')
<main>
  <section class="uk-section uk-padding-remove">
    <div class="uk-grid-collapse uk-flex-stretch" uk-grid>
      <div class="uk-width-1-1 uk-width-expand@l">
        <div class="uk-padding-small">
          <div>
            <div data-product-gallery uk-slider="finite: true">
              <div class="uk-position-relative uk-visible-toggle" tabindex="-1">
                <div class="uk-slider-container">
                  <ul class="uk-slider-items uk-grid uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" data-product-main-track>
                    @foreach ($gallery as $media)
                      <li>
                        <div class="uk-cover-container uk-height-viewport">
                          @if (isset($media['video']))
                            <video autoplay muted loop playsinline poster="{{ $shopAssetBase.'/'.$media['src'] }}" uk-cover><source src="{{ $shopAssetBase.'/'.$media['video'] }}" type="video/mp4"></video>
                          @else
                            <img src="{{ $shopAssetBase.'/'.$media['src'] }}" alt="{{ $media['alt'] }}" uk-cover @if ($loop->first) data-variant-image @endif>
                            @if ($loop->first)<span class="uk-label uk-border-pill uk-position-top-left uk-position-small">LIMITED</span>@endif
                          @endif
                        </div>
                      </li>
                    @endforeach
                  </ul>
                </div>
                <span class="uk-label uk-border-pill uk-position-top-right uk-position-small" data-product-media-count>1–2 / 11</span>
                <a class="uk-icon-button uk-position-center-left uk-position-small" href uk-icon="arrow-left" uk-slider-item="previous" aria-label="Предыдущие медиа"></a>
                <a class="uk-icon-button uk-position-center-right uk-position-small" href uk-icon="arrow-right" uk-slider-item="next" aria-label="Следующие медиа"></a>
              </div>
            </div>

            <div class="uk-width-1-1 uk-background-default uk-padding-small" aria-label="Превью галереи" uk-slider="finite: true">
              <div class="uk-position-relative uk-visible-toggle" tabindex="-1">
                <div class="uk-slider-container uk-margin-medium-left uk-margin-medium-right">
                  <ul class="uk-slider-items uk-thumbnav uk-grid uk-grid-small uk-margin-remove">
                    @foreach ($gallery as $media)
                      <li @class(['uk-width-small', 'uk-active' => $loop->index < 2]) data-product-media-index="{{ $loop->index }}">
                        <a @class(['uk-width-1-1', 'uk-inline' => isset($media['video'])]) href="#" @if (isset($media['video'])) aria-label="Смотреть видео" @endif>
                          <img class="uk-width-1-1" src="{{ $shopAssetBase.'/'.$media['src'] }}" width="150" height="150" alt="{{ isset($media['video']) ? 'Превью видео' : 'Превью фото '.$loop->iteration }}">
                          @if (isset($media['video']))<span class="uk-position-cover uk-overlay-primary uk-flex uk-flex-center uk-flex-middle"><span uk-icon="icon: play-circle; ratio: 1.5"></span></span>@endif
                        </a>
                      </li>
                    @endforeach
                  </ul>
                </div>
                <a class="uk-position-center-left uk-position-small uk-icon-button" href uk-slidenav-previous uk-slider-item="previous" aria-label="Предыдущие превью"></a>
                <a class="uk-position-center-right uk-position-small uk-icon-button" href uk-slidenav-next uk-slider-item="next" aria-label="Следующие превью"></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article class="uk-width-1-1 uk-width-xlarge@l uk-padding-large uk-padding-remove-top">
        <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-top" data-variant-category>Жакеты</p>
        <h1 class="uk-heading-small uk-margin-small-top" data-variant-name>Пальто Axis</h1>
        <div class="uk-flex uk-flex-middle uk-flex-wrap">
          <del class="uk-text-muted uk-margin-small-right" data-variant-old-price>7 600 ₴</del>
          <strong class="uk-h3 uk-text-primary uk-margin-remove" data-variant-price>6 800 ₴</strong>
        </div>
        <p class="uk-margin-medium-top">Выверенная посадка, чистая линия плеча и материал, который хорошо держит форму.<br>Вещь легко сочетается с основной капсулой.</p>

        <hr class="uk-margin-top uk-margin-bottom">

        <form data-variant-form data-product-id="fashion-1">
          <fieldset class="uk-fieldset">
            <legend class="uk-legend uk-text-small">Цвет</legend>
            <div class="uk-grid-small uk-child-width-auto uk-margin-small-top" uk-grid>
              <div><label class="uk-button uk-button-primary uk-border-circle uk-padding-remove uk-flex uk-flex-center uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Песочный" checked><span class="uk-icon-button uk-background-muted" aria-hidden="true"></span><span class="uk-hidden">Песочный</span></label></div>
              <div><label class="uk-button uk-button-default uk-border-circle uk-padding-remove uk-flex uk-flex-center uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Чернильный"><span class="uk-icon-button uk-background-secondary" aria-hidden="true"></span><span class="uk-hidden">Чернильный</span></label></div>
            </div>
          </fieldset>

          <hr class="uk-margin-top uk-margin-bottom">

          <fieldset class="uk-fieldset" data-product-size-picker>
            <div class="uk-flex uk-flex-between uk-flex-middle">
              <div class="uk-flex uk-flex-middle"><span class="uk-text-small">Размер</span><strong class="uk-margin-small-left" data-variant-size-current>S</strong></div>
              <a class="uk-link-text uk-text-small uk-text-nowrap" href="#size-modal" data-size-guide-link uk-toggle>Таблица размеров</a>
            </div>
            <div class="uk-grid-small uk-child-width-auto uk-margin-small-top" data-product-size-grid uk-grid>
              <div><label class="uk-button uk-button-default uk-disabled" data-variant-option data-variant-unavailable aria-disabled="true"><input class="uk-hidden" type="radio" name="size" value="XS" disabled><span>XS</span><span uk-icon="icon: lock; ratio: 0.7"></span></label></div>
              <div><label class="uk-button uk-button-primary" data-variant-option><input class="uk-hidden" type="radio" name="size" value="S" checked>S</label></div>
              <div><label class="uk-button uk-button-default" data-variant-option><input class="uk-hidden" type="radio" name="size" value="M">M</label></div>
              <div><label class="uk-button uk-button-default" data-variant-option><input class="uk-hidden" type="radio" name="size" value="L">L</label></div>
              <div><label class="uk-button uk-button-default uk-disabled" data-variant-option data-variant-unavailable aria-disabled="true"><input class="uk-hidden" type="radio" name="size" value="XL" disabled><span>XL</span><span uk-icon="icon: lock; ratio: 0.7"></span></label></div>
              <div><label class="uk-button uk-button-default uk-disabled" data-variant-option data-variant-unavailable aria-disabled="true"><input class="uk-hidden" type="radio" name="size" value="XXL" disabled><span>XXL</span><span uk-icon="icon: lock; ratio: 0.7"></span></label></div>
            </div>
          </fieldset>

          <div class="uk-background-muted uk-padding-small uk-margin-top" data-variant-summary>
            <div class="uk-flex uk-flex-middle uk-flex-wrap">
              <span class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-small-right">Будет добавлено:</span>
              <span class="uk-label uk-border-pill uk-background-default uk-text-emphasis uk-margin-small-right" data-variant-summary-option><b>Цвет</b><span data-variant-color-current>Песочный</span></span>
              <span class="uk-label uk-border-pill uk-background-default uk-text-emphasis" data-variant-summary-option><b>Размер</b><span data-variant-size-current>S</span></span>
            </div>
          </div>

          <div class="uk-grid-small uk-child-width-1-1 uk-flex-middle uk-margin-top" uk-grid>
            <div class="uk-width-1-3@s">
              <div class="uk-button-group uk-width-1-1" aria-label="Количество">
                <button class="uk-button uk-button-default uk-button-large uk-width-1-3 uk-padding-remove-horizontal" type="button" data-product-quantity-action="decrease" aria-label="Уменьшить количество">−</button>
                <span class="uk-button uk-button-default uk-button-large uk-width-1-3 uk-padding-remove-horizontal" data-product-quantity>1</span>
                <button class="uk-button uk-button-default uk-button-large uk-width-1-3 uk-padding-remove-horizontal" type="button" data-product-quantity-action="increase" aria-label="Увеличить количество">+</button>
              </div>
            </div>
            <div class="uk-width-2-3@s"><button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-text-nowrap" type="button" data-cart-confirm><span class="uk-margin-small-right" uk-icon="icon: cart"></span>В корзину</button></div>
          </div>
          <button class="uk-button uk-button-default uk-button-large uk-width-1-1 uk-margin-small-top uk-flex uk-flex-between uk-flex-middle" type="button" data-quick-order-open><span>Быстрый заказ</span><span uk-icon="icon: arrow-right"></span></button>
        </form>

        <hr class="uk-margin-top uk-margin-bottom">

        <div class="uk-grid-small uk-child-width-1-2" uk-grid>
          <div><b>Бесплатно</b><br><small class="uk-text-muted">от 3 000 ₴</small></div>
          <div><b>14 дней</b><br><small class="uk-text-muted">на возврат</small></div>
        </div>

        <hr class="uk-margin-top uk-margin-bottom">

        <ul class="uk-list uk-list-divider uk-margin-remove" uk-accordion="multiple: true; animation: true">
          <li class="uk-open uk-padding-small uk-padding-remove-horizontal">
            <a class="uk-accordion-title uk-text-bold" href>Описание</a>
            <div class="uk-accordion-content"><p class="uk-text-muted uk-margin-small-top uk-margin-remove-bottom">Свободное пальто с мягкой линией плеча и поясом. Лаконичный силуэт легко дополняет повседневные и деловые образы.</p></div>
          </li>
          <li class="uk-padding-small uk-padding-remove-horizontal">
            <a class="uk-accordion-title uk-text-bold" href>Состав и уход</a>
            <div class="uk-accordion-content">
              <ul class="uk-list uk-list-bullet uk-text-muted uk-margin-small-top uk-margin-remove-bottom">
                <li>Плотная костюмная ткань, подкладка — вискоза.</li>
                <li>Рекомендована деликатная химчистка.</li>
                <li>Хранить на широких плечиках.</li>
              </ul>
            </div>
          </li>
          <li class="uk-padding-small uk-padding-remove-horizontal">
            <a class="uk-accordion-title uk-text-bold" href>Доставка и оплата</a>
            <div class="uk-accordion-content">
              <dl class="uk-description-list uk-description-list-divider uk-margin-small-top uk-margin-remove-bottom">
                <dt>Доставка</dt><dd>По Украине в течение 1–3 рабочих дней.</dd>
                <dt>Оплата</dt><dd>Банковской картой или при получении заказа.</dd>
                <dt>Возврат</dt><dd>В течение 14 дней после получения.</dd>
              </dl>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>

  <section id="products" class="uk-section uk-section-muted">
    <div class="uk-container uk-container-expand">
      <p class="uk-text-meta uk-text-uppercase uk-text-bold">Может понравиться</p>
      <h2 class="uk-heading-small uk-margin-small-top">Дополните выбор</h2>
      <div class="uk-grid-medium uk-child-width-1-2@s uk-child-width-1-4@l" uk-grid>
        @foreach ($recommendations as $recommendation)
          <div>
            <article class="uk-card uk-card-default">
              <div class="uk-card-media-top uk-inline uk-width-1-1">
                <a href="{{ route('product.show', ['url' => $product->url, 'demo' => $recommendation['id']]) }}"><img src="{{ $shopAssetBase.'/products/fashion-0'.$recommendation['id'].'.webp' }}" alt="{{ $recommendation['name'] }}" width="720" height="960"></a>
                @if ($recommendation['badge'])<span class="uk-label uk-border-pill uk-position-top-left uk-position-small">{{ $recommendation['badge'] }}</span>@endif
                <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" data-cart-add="fashion-{{ $recommendation['id'] }}" aria-label="Добавить {{ $recommendation['name'] }}" uk-icon="cart"></button>
              </div>
              <div class="uk-card-body uk-padding-small">
                <h3 class="uk-card-title uk-margin-remove-bottom"><a class="uk-link-reset" href="{{ route('product.show', ['url' => $product->url, 'demo' => $recommendation['id']]) }}">{{ $recommendation['name'] }}</a></h3>
                <p class="uk-margin-small"><del class="uk-text-muted">{{ $recommendation['oldPrice'] }}</del> <strong>{{ $recommendation['price'] }}</strong></p>
                <small>{{ $recommendation['sizes'] }}</small>
              </div>
            </article>
          </div>
        @endforeach
      </div>
    </div>
  </section>
</main>
@endsection

@push('modals')
  <div id="size-modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <button class="uk-modal-close-default" type="button" aria-label="Закрыть таблицу размеров" uk-close></button>
      <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">VERA</p>
      <h2 class="uk-modal-title uk-margin-small-top">Таблица размеров</h2>
      <div class="uk-overflow-auto">
        <table class="uk-table uk-table-divider uk-table-striped uk-table-middle">
          <thead><tr><th>Параметр, см</th><th>S</th><th>M</th><th>L</th></tr></thead>
          <tbody>
            <tr><th>Обхват груди</th><td>84–88</td><td>88–92</td><td>92–96</td></tr>
            <tr><th>Обхват талии</th><td>64–68</td><td>68–72</td><td>72–76</td></tr>
            <tr><th>Обхват бёдер</th><td>90–94</td><td>94–98</td><td>98–102</td></tr>
          </tbody>
        </table>
      </div>
      <p class="uk-text-meta">Если значение находится между двумя размерами, выбирайте больший для более свободной посадки.</p>
    </div>
  </div>

  @include('sites.shop.partials.search-modal')
  @include('sites.shop.partials.cart-modal')
@endpush
