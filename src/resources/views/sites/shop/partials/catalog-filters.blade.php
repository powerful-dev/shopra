<fieldset class="uk-fieldset">
  <legend class="uk-legend">Категория</legend>
  <label class="uk-display-block uk-margin-small"><input class="uk-radio" type="radio" name="{{ $name }}" value="all" data-filter-category> Все товары <span class="uk-float-right">8</span></label>
  <label class="uk-display-block uk-margin-small"><input class="uk-radio" type="radio" name="{{ $name }}" value="new" data-filter-category> Новая коллекция <span class="uk-float-right">2</span></label>
  <label class="uk-display-block uk-margin-small"><input class="uk-radio" type="radio" name="{{ $name }}" value="jackets" data-filter-category> Жакеты <span class="uk-float-right">2</span></label>
  <label class="uk-display-block uk-margin-small"><input class="uk-radio" type="radio" name="{{ $name }}" value="knit" data-filter-category> Трикотаж <span class="uk-float-right">2</span></label>
  <label class="uk-display-block uk-margin-small"><input class="uk-radio" type="radio" name="{{ $name }}" value="accessories" data-filter-category> Аксессуары <span class="uk-float-right">2</span></label>
</fieldset>
<hr>
<fieldset class="uk-fieldset">
  <legend class="uk-legend">Цена до <b data-filter-price-output>6 800 ₴</b></legend>
  <input class="uk-range" type="range" min="1600" max="6800" step="50" value="6800" aria-label="Максимальная цена" data-filter-price>
  <div class="uk-flex uk-flex-between uk-text-meta"><span>1 600 ₴</span><span>6 800 ₴</span></div>
</fieldset>
<hr>
<fieldset class="uk-fieldset"><legend class="uk-legend">Предложения</legend><label><input class="uk-checkbox" type="checkbox" data-filter-sale> Только со скидкой</label></fieldset>
<hr>
<fieldset class="uk-fieldset">
  <legend class="uk-legend">Размер</legend>
  <div class="uk-grid-small uk-child-width-auto" uk-grid>
    @foreach (['all' => 'Все', 'XS' => 'XS', 'S' => 'S', 'M' => 'M', 'L' => 'L', 'XL' => 'XL', 'ONE SIZE' => 'ONE SIZE'] as $value => $label)
      <div><button class="uk-button {{ $loop->first ? 'uk-button-primary' : 'uk-button-default' }} uk-button-small" type="button" data-filter-size="{{ $value }}">{{ $label }}</button></div>
    @endforeach
  </div>
</fieldset>
