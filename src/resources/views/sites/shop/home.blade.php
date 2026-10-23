@extends('sites.shop.layout')

@section('content')
<main>
      <section class="uk-cover-container uk-height-viewport uk-light">
        <video autoplay muted loop playsinline poster="{{ $shopAssetBase.'/images/fashion-hero.png' }}" uk-cover>
          <source src="{{ $shopAssetBase.'/video/fashion-loop-v2.mp4' }}" type="video/mp4">
        </video>
        <div class="uk-position-cover shopra-gradient--left"></div>
        <div class="uk-position-top-right uk-position-medium">
          <span class="uk-overlay uk-overlay-primary uk-padding-small uk-border-pill uk-text-meta uk-text-uppercase uk-text-bold"><span class="uk-margin-small-right" uk-icon="icon: play-circle; ratio: .65"></span>Видео · без звука</span>
        </div>
        <div class="uk-position-center-left uk-position-large uk-width-1-1 uk-width-1-2@m">
          <p class="uk-text-uppercase uk-text-bold">DROP 08 / CITY FORM</p>
          <h1 class="uk-heading-small uk-margin-small-top">Собрано для города.<br>Продумано для вас.</h1>
          <p class="uk-width-xlarge">Чистые линии, выразительный цвет и вещи, которые остаются актуальными дольше сезона.</p>
          <div class="uk-margin-medium-top uk-flex uk-flex-middle uk-flex-nowrap">
            <a class="uk-button uk-button-primary uk-margin-small-right" href="catalog.html">Смотреть коллекцию <span uk-icon="icon: arrow-right"></span></a>
            <a class="uk-button uk-button-default" href="#about">О бренде</a>
          </div>
        </div>
        <div class="uk-position-bottom-right uk-position-medium">
          <span class="uk-label uk-border-pill uk-background-default uk-text-emphasis">01 / 03</span>
        </div>
      </section>

      <section id="catalog" class="uk-section uk-section-large">
        <div class="uk-container uk-container-expand">
          <div class="uk-flex uk-flex-between uk-flex-bottom uk-margin-large-bottom">
            <div>
              <p class="uk-text-meta uk-text-uppercase uk-text-bold">Каталог</p>
              <h2 class="uk-heading-small uk-margin-remove">Выберите категорию</h2>
            </div>
            <a class="uk-link-text uk-visible@s" href="catalog.html">Смотреть всё <span uk-icon="icon: arrow-right"></span></a>
          </div>

          <div class="uk-child-width-1-2 uk-child-width-1-4@m uk-grid-small" uk-grid>
            <div>
              <a class="uk-inline-clip uk-transition-toggle uk-light" href="catalog.html?category=0" tabindex="0">
                <img class="uk-transition-scale-up uk-transition-opaque" src="{{ $shopAssetBase.'/products/fashion-00.webp' }}" alt="Новая коллекция" width="720" height="960">
                <span class="uk-position-cover shopra-gradient--bottom"></span>
                <span class="uk-position-bottom-left uk-overlay">
                  <span class="uk-text-meta">01</span><br>
                  <span class="uk-h3 uk-display-block uk-margin-small-top uk-margin-remove-bottom">Новая коллекция</span>
                  <small>28 моделей</small>
                </span>
              </a>
            </div>
            <div>
              <a class="uk-inline-clip uk-transition-toggle uk-light" href="catalog.html?category=1" tabindex="0">
                <img class="uk-transition-scale-up uk-transition-opaque" src="{{ $shopAssetBase.'/products/fashion-01.webp' }}" alt="Жакеты" width="720" height="960">
                <span class="uk-position-cover shopra-gradient--bottom"></span>
                <span class="uk-position-bottom-left uk-overlay">
                  <span class="uk-text-meta">02</span><br>
                  <span class="uk-h3 uk-display-block uk-margin-small-top uk-margin-remove-bottom">Жакеты</span>
                  <small>Структура и цвет</small>
                </span>
              </a>
            </div>
            <div>
              <a class="uk-inline-clip uk-transition-toggle uk-light" href="catalog.html?category=2" tabindex="0">
                <img class="uk-transition-scale-up uk-transition-opaque" src="{{ $shopAssetBase.'/products/fashion-05.webp' }}" alt="Трикотаж" width="720" height="960">
                <span class="uk-position-cover shopra-gradient--bottom"></span>
                <span class="uk-position-bottom-left uk-overlay">
                  <span class="uk-text-meta">03</span><br>
                  <span class="uk-h3 uk-display-block uk-margin-small-top uk-margin-remove-bottom">Трикотаж</span>
                  <small>Мягкие слои</small>
                </span>
              </a>
            </div>
            <div>
              <a class="uk-inline-clip uk-transition-toggle uk-light" href="catalog.html?category=3" tabindex="0">
                <img class="uk-transition-scale-up uk-transition-opaque" src="{{ $shopAssetBase.'/products/fashion-04.webp' }}" alt="Аксессуары" width="720" height="960">
                <span class="uk-position-cover shopra-gradient--bottom"></span>
                <span class="uk-position-bottom-left uk-overlay">
                  <span class="uk-text-meta">04</span><br>
                  <span class="uk-h3 uk-display-block uk-margin-small-top uk-margin-remove-bottom">Аксессуары</span>
                  <small>Последний штрих</small>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="products" class="uk-section uk-section-large uk-section-muted">
        <div class="uk-container uk-container-expand">
          <div class="uk-flex uk-flex-between uk-flex-bottom uk-margin-large-bottom">
            <div>
              <p class="uk-text-meta uk-text-uppercase uk-text-bold">Выбор редакции</p>
              <h2 class="uk-heading-small uk-margin-remove">Товары сезона</h2>
            </div>
            <a class="uk-link-text uk-visible@s" href="catalog.html">Смотреть всё <span uk-icon="icon: arrow-right"></span></a>
          </div>

          <div class="uk-child-width-1-2 uk-child-width-1-4@m uk-grid-small" uk-grid>
            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=0"><img src="{{ $shopAssetBase.'/products/fashion-00.webp' }}" alt="Жакет Form 02" width="720" height="960"></a>
                  <span class="uk-label uk-border-pill uk-position-top-left uk-position-small">NEW</span>
                  <button id="wish-0" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Жакет Form 02 в избранное" uk-toggle="target: #wish-0; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Жакет Form 02 в корзину" data-cart-configure="fashion-0" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=0">Жакет Form 02</a></h3>
                    <strong>4 900 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-background-muted">&nbsp;</span></div>
                    <small>XS · S · M · L</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=1"><img src="{{ $shopAssetBase.'/products/fashion-01.webp' }}" alt="Пальто Axis" width="720" height="960"></a>
                  <span class="uk-label uk-border-pill uk-position-top-left uk-position-small">LIMITED</span>
                  <button id="wish-1" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Пальто Axis в избранное" uk-toggle="target: #wish-1; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Пальто Axis в корзину" data-cart-configure="fashion-1" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=1">Пальто Axis</a></h3>
                    <strong>6 800 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-muted">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span></div>
                    <small>S · M · L</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=2"><img src="{{ $shopAssetBase.'/products/fashion-02.webp' }}" alt="Топ Line Wine" width="720" height="960"></a>
                  <button id="wish-2" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Топ Line Wine в избранное" uk-toggle="target: #wish-2; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Топ Line Wine в корзину" data-cart-configure="fashion-2" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=2">Топ Line Wine</a></h3>
                    <strong>1 850 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-label-danger">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-background-muted">&nbsp;</span></div>
                    <small>XS · S · M · L</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=3"><img src="{{ $shopAssetBase.'/products/fashion-03.webp' }}" alt="Брюки Wide" width="720" height="960"></a>
                  <button id="wish-3" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Брюки Wide в избранное" uk-toggle="target: #wish-3; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Брюки Wide в корзину" data-cart-configure="fashion-3" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=3">Брюки Wide</a></h3>
                    <strong>2 950 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-muted">&nbsp;</span></div>
                    <small>S · M · L · XL</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=4"><img src="{{ $shopAssetBase.'/products/fashion-04.webp' }}" alt="Сумка Mini Fold" width="720" height="960"></a>
                  <span class="uk-label uk-border-pill uk-position-top-left uk-position-small">BEST</span>
                  <button id="wish-4" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Сумка Mini Fold в избранное" uk-toggle="target: #wish-4; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Сумка Mini Fold в корзину" data-cart-add="fashion-4" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=4">Сумка Mini Fold</a></h3>
                    <strong>2 300 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-label-danger">&nbsp;</span></div>
                    <small>ONE SIZE</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=5"><img src="{{ $shopAssetBase.'/products/fashion-05.webp' }}" alt="Кардиган Soft 08" width="720" height="960"></a>
                  <button id="wish-5" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Кардиган Soft 08 в избранное" uk-toggle="target: #wish-5; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Кардиган Soft 08 в корзину" data-cart-configure="fashion-5" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=5">Кардиган Soft 08</a></h3>
                    <strong>3 200 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-muted">&nbsp;</span> <span class="uk-badge uk-background-default">&nbsp;</span> <span class="uk-badge uk-background-primary">&nbsp;</span></div>
                    <small>XS/S · M/L</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=6"><img src="{{ $shopAssetBase.'/products/fashion-06.webp' }}" alt="Гольф Base" width="720" height="960"></a>
                  <button id="wish-6" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Гольф Base в избранное" uk-toggle="target: #wish-6; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Гольф Base в корзину" data-cart-configure="fashion-6" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=6">Гольф Base</a></h3>
                    <strong>1 600 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-default">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-label-danger">&nbsp;</span></div>
                    <small>XS · S · M · L</small>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article class="uk-card uk-card-default">
                <div class="uk-card-media-top uk-inline uk-width-1-1">
                  <a href="product.html?id=7"><img src="{{ $shopAssetBase.'/products/fashion-07.webp' }}" alt="Юбка Column" width="720" height="960"></a>
                  <button id="wish-7" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Юбка Column в избранное" uk-toggle="target: #wish-7; cls: uk-button-primary" uk-icon="heart"></button>
                  <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Добавить Юбка Column в корзину" data-cart-configure="fashion-7" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                </div>
                <div class="uk-card-body uk-padding-small">
                  <div class="uk-flex uk-flex-between uk-flex-top">
                    <h3 class="uk-card-title uk-margin-remove"><a class="uk-link-reset" href="product.html?id=7">Юбка Column</a></h3>
                    <strong>2 700 ₴</strong>
                  </div>
                  <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                    <div><span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span></div>
                    <small>XS · S · M · L</small>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="capsule" class="uk-section uk-section-large">
        <div class="uk-container uk-container-expand">
          <div class="uk-grid-collapse uk-child-width-1-2@m uk-flex-middle" uk-grid>
            <div>
              <div class="uk-padding-large">
                <p class="uk-text-meta uk-text-uppercase uk-text-bold">Вместе лучше</p>
                <h2 class="uk-heading-small">Соберите образ</h2>
                <div class="uk-child-width-1-2 uk-grid-small" uk-grid>
                  <div>
                    <article class="uk-card uk-card-default">
                      <div class="uk-card-media-top uk-inline uk-width-1-1">
                        <a href="product.html?id=4">
                          <img src="{{ $shopAssetBase.'/products/fashion-04.webp' }}" width="720" height="960" alt="Сумка Mini Fold">
                        </a>
                        <span class="uk-label uk-border-pill uk-position-top-left uk-position-small">BEST</span>
                        <button id="capsule-wish-4" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Сумку Mini Fold в избранное" uk-toggle="target: #capsule-wish-4; cls: uk-button-primary" uk-icon="heart"></button>
                        <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Выбрать параметры Сумки Mini Fold" data-cart-configure="fashion-4" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                      </div>
                      <div class="uk-card-body uk-padding-small">
                        <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Аксессуары</p>
                        <h3 class="uk-h4 uk-margin-small-top uk-margin-remove-bottom"><a class="uk-link-reset" href="product.html?id=4">Сумка Mini Fold</a></h3>
                        <p class="uk-margin-small"><del class="uk-text-muted">2 700 ₴</del> <strong>2 300 ₴</strong></p>
                        <div class="uk-flex uk-flex-between uk-flex-middle">
                          <div><span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-label-danger">&nbsp;</span></div>
                          <small>ONE SIZE</small>
                        </div>
                      </div>
                    </article>
                  </div>
                  <div>
                    <article class="uk-card uk-card-default">
                      <div class="uk-card-media-top uk-inline uk-width-1-1">
                        <a href="product.html?id=5">
                          <img src="{{ $shopAssetBase.'/products/fashion-05.webp' }}" width="720" height="960" alt="Кардиган Soft 08">
                        </a>
                        <button id="capsule-wish-5" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Кардиган Soft 08 в избранное" uk-toggle="target: #capsule-wish-5; cls: uk-button-primary" uk-icon="heart"></button>
                        <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Выбрать параметры Кардигана Soft 08" data-cart-configure="fashion-5" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                      </div>
                      <div class="uk-card-body uk-padding-small">
                        <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Трикотаж</p>
                        <h3 class="uk-h4 uk-margin-small-top uk-margin-remove-bottom"><a class="uk-link-reset" href="product.html?id=5">Кардиган Soft 08</a></h3>
                        <p class="uk-margin-small"><del class="uk-text-muted">3 700 ₴</del> <strong>3 200 ₴</strong></p>
                        <div class="uk-flex uk-flex-between uk-flex-middle">
                          <div><span class="uk-badge uk-background-muted">&nbsp;</span> <span class="uk-badge uk-background-default">&nbsp;</span> <span class="uk-badge uk-background-primary">&nbsp;</span></div>
                          <small>XS/S · M/L</small>
                        </div>
                      </div>
                    </article>
                  </div>
                  <div>
                    <article class="uk-card uk-card-default">
                      <div class="uk-card-media-top uk-inline uk-width-1-1">
                        <a href="product.html?id=6">
                          <img src="{{ $shopAssetBase.'/products/fashion-06.webp' }}" width="720" height="960" alt="Гольф Base">
                        </a>
                        <button id="capsule-wish-6" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Гольф Base в избранное" uk-toggle="target: #capsule-wish-6; cls: uk-button-primary" uk-icon="heart"></button>
                        <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Выбрать параметры Гольфа Base" data-cart-configure="fashion-6" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                      </div>
                      <div class="uk-card-body uk-padding-small">
                        <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Трикотаж</p>
                        <h3 class="uk-h4 uk-margin-small-top uk-margin-remove-bottom"><a class="uk-link-reset" href="product.html?id=6">Гольф Base</a></h3>
                        <p class="uk-margin-small"><del class="uk-text-muted">1 950 ₴</del> <strong>1 600 ₴</strong></p>
                        <div class="uk-flex uk-flex-between uk-flex-middle">
                          <div><span class="uk-badge uk-background-default">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span> <span class="uk-badge uk-label-danger">&nbsp;</span></div>
                          <small>XS · S · M · L</small>
                        </div>
                      </div>
                    </article>
                  </div>
                  <div>
                    <article class="uk-card uk-card-default">
                      <div class="uk-card-media-top uk-inline uk-width-1-1">
                        <a href="product.html?id=7">
                          <img src="{{ $shopAssetBase.'/products/fashion-07.webp' }}" width="720" height="960" alt="Юбка Column">
                        </a>
                        <button id="capsule-wish-7" class="uk-icon-button uk-position-top-right uk-position-small" type="button" aria-label="Добавить Юбку Column в избранное" uk-toggle="target: #capsule-wish-7; cls: uk-button-primary" uk-icon="heart"></button>
                        <button class="uk-icon-button uk-position-bottom-right uk-position-small" type="button" aria-label="Выбрать параметры Юбки Column" data-cart-configure="fashion-7" uk-toggle="target: #variant-modal" uk-icon="cart"></button>
                      </div>
                      <div class="uk-card-body uk-padding-small">
                        <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Юбки</p>
                        <h3 class="uk-h4 uk-margin-small-top uk-margin-remove-bottom"><a class="uk-link-reset" href="product.html?id=7">Юбка Column</a></h3>
                        <p class="uk-margin-small"><del class="uk-text-muted">3 150 ₴</del> <strong>2 700 ₴</strong></p>
                        <div class="uk-flex uk-flex-between uk-flex-middle">
                          <div><span class="uk-badge uk-background-primary">&nbsp;</span> <span class="uk-badge uk-background-secondary">&nbsp;</span></div>
                          <small>XS · S · M · L</small>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
            <div class="uk-flex-first uk-flex-last@m">
              <div class="uk-inline uk-light">
                <img src="{{ $shopAssetBase.'/images/fashion-combo-banner.webp' }}" alt="Образ из коллекции Cobalt" width="900" height="1100">
                <div class="uk-position-cover shopra-gradient--bottom"></div>
                <div class="uk-position-bottom-left uk-overlay uk-padding-large">
                  <p class="uk-text-meta uk-text-uppercase">Баннер + товары</p>
                  <h2 class="uk-heading-small uk-margin-remove">Один цвет.<br>Восемь сочетаний.</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="uk-cover-container uk-height-large uk-light">
        <img src="{{ $shopAssetBase.'/images/fashion-cta-banner.webp' }}" alt="Капсула Cobalt" uk-cover>
        <div class="uk-position-cover shopra-gradient--left"></div>
        <div class="uk-position-center-left uk-position-large uk-width-2-3 uk-width-1-2@m">
          <p class="uk-text-meta uk-text-uppercase">Новая коллекция</p>
          <h2 class="uk-heading-small">Один цвет.<br>Восемь сочетаний.</h2>
          <p class="uk-text-lead">Капсула Cobalt собирается между собой без лишних правил.</p>
          <a class="uk-button uk-button-primary uk-button-large" href="catalog.html">Открыть капсулу <span uk-icon="icon: arrow-right"></span></a>
        </div>
      </section>

      <section id="about" class="uk-section uk-section-large uk-section-default">
        <div class="uk-container uk-container-small uk-text-center">
          <p class="uk-text-meta uk-text-uppercase uk-text-bold">VERA · modern uniform</p>
          <h2 class="uk-heading-small">Спокойная система вещей на каждый день.</h2>
          <p class="uk-text-lead">Мы создаём выразительную городскую одежду, которая легко собирается в цельный гардероб и остаётся актуальной дольше одного сезона.</p>
        </div>
      </section>
    </main>
@endsection

@push('modals')
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
          <div class="uk-overflow-auto uk-flex-1">
            <ul class="uk-list uk-list-divider uk-margin-remove-bottom" data-search-results></ul>
          </div>
        </div>
      </div>
    </div>

    <div id="variant-modal" uk-modal>
      <div class="uk-modal-dialog uk-width-xlarge uk-margin-auto-vertical">
        <button class="uk-modal-close-default uk-icon-button uk-close-large uk-position-small" type="button" aria-label="Закрыть выбор модификации" uk-close></button>

        <header class="uk-modal-header">
          <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">Выберите модификацию</p>
          <h2 class="uk-modal-title uk-margin-small-top" data-variant-name>Жакет Form 02</h2>
        </header>

        <section class="uk-modal-body uk-background-muted uk-padding-small">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto"><img src="{{ $shopAssetBase.'/products/fashion-00.webp' }}" alt="Жакет Form 02" width="80" height="107" data-variant-image></div>
            <div class="uk-width-expand">
              <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">VERA</p>
              <p class="uk-h3 uk-margin-small-top uk-margin-small-bottom" data-variant-price>4 900 ₴</p>
              <p class="uk-text-meta uk-margin-remove">Выбранные параметры попадут в корзину отдельной строкой.</p>
            </div>
          </div>
        </section>

        <form data-variant-form>
          <div class="uk-modal-body">
            <fieldset class="uk-fieldset">
              <div class="uk-flex uk-flex-between uk-flex-middle"><legend class="uk-legend">Цвет</legend><strong data-variant-color-current>Кобальт</strong></div>
              <div class="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid>
                <div><label class="uk-button uk-button-primary uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Кобальт" checked><span class="uk-icon-button uk-background-primary uk-margin-small-right uk-flex-none"></span>Кобальт</label></div>
                <div><label class="uk-button uk-button-default uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Чернильный"><span class="uk-icon-button uk-background-secondary uk-margin-small-right uk-flex-none"></span>Чернильный</label></div>
                <div><label class="uk-button uk-button-default uk-width-1-1 uk-text-left uk-text-capitalize uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle" data-variant-option><input class="uk-hidden" type="radio" name="color" value="Молочный"><span class="uk-icon-button uk-background-muted uk-margin-small-right uk-flex-none"></span>Молочный</label></div>
              </div>
            </fieldset>

            <fieldset class="uk-fieldset uk-margin-top">
              <div class="uk-flex uk-flex-between uk-flex-middle"><legend class="uk-legend">Размер</legend><strong data-variant-size-current>XS</strong></div>
              <div class="uk-grid-small uk-child-width-auto" uk-grid>
                <div><label class="uk-button uk-button-primary uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="XS" checked>XS</label></div>
                <div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="S">S</label></div>
                <div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="M">M</label></div>
                <div><label class="uk-button uk-button-default uk-button-small" data-variant-option><input class="uk-hidden" type="radio" name="size" value="L">L</label></div>
              </div>
            </fieldset>
          </div>

          <footer class="uk-modal-footer">
            <button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-flex uk-flex-between uk-flex-middle" type="button" data-cart-confirm><span>Добавить выбранное</span><span uk-icon="icon: arrow-right"></span></button>
          </footer>
        </form>
      </div>
    </div>

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
@endpush

