(() => {
  const assetBase = document.documentElement.dataset.shopraAssetBase || "";
  const storeKey = document.documentElement.dataset.shopraStore || "fashion";
  const storePresets = {
    fashion: {
      brand: "VERA",
      optionLabels: { color: "Цвет", size: "Размер" },
      products: {
        "fashion-0": { name: "Жакет Form 02", category: "Новая коллекция", price: 4900, oldPrice: 5600, image: `${assetBase}/products/fashion-00.webp`, color: "Чернильный", size: "M" },
        "fashion-1": { name: "Пальто Axis", category: "Жакеты", price: 6800, oldPrice: 7600, image: `${assetBase}/products/fashion-01.webp`, color: "Песочный", size: "S" },
        "fashion-2": { name: "Топ Line Wine", category: "Трикотаж", price: 1850, oldPrice: 2200, image: `${assetBase}/products/fashion-02.webp`, color: "Винный", size: "M" },
        "fashion-3": { name: "Брюки Wide", category: "Брюки", price: 2950, oldPrice: 3400, image: `${assetBase}/products/fashion-03.webp`, color: "Графит", size: "M" },
        "fashion-4": { name: "Сумка Mini Fold", category: "Аксессуары", price: 2300, oldPrice: 2700, image: `${assetBase}/products/fashion-04.webp`, color: "Чернильный", size: "ONE SIZE" },
        "fashion-5": { name: "Кардиган Soft 08", category: "Трикотаж", price: 3200, oldPrice: 3700, image: `${assetBase}/products/fashion-05.webp`, color: "Серый", size: "M/L" },
        "fashion-6": { name: "Гольф Base", category: "Трикотаж", price: 1600, oldPrice: 1950, image: `${assetBase}/products/fashion-06.webp`, color: "Молочный", size: "M" },
        "fashion-7": { name: "Юбка Column", category: "Юбки", price: 2700, oldPrice: 3150, image: `${assetBase}/products/fashion-07.webp`, color: "Чернильный", size: "M" },
      },
      demoCart: [
        { key: "fashion-1:Песочный:S", productId: "fashion-1", color: "Песочный", size: "S", quantity: 4 },
        { key: "fashion-0:Чернильный:M", productId: "fashion-0", color: "Чернильный", size: "M", quantity: 1 },
        { key: "fashion-5:Графит:M/L", productId: "fashion-5", color: "Графит", size: "M/L", quantity: 4 },
      ],
    },
    food: {
      brand: "TISTO",
      optionLabels: { color: "Получение", size: "Формат" },
      products: {
        "food-0": { name: "Тарт фисташка", category: "Выпечка", price: 185, oldPrice: 220, image: `${assetBase}/products/food-00.webp`, color: "Сегодня", size: "1 шт." },
        "food-1": { name: "Круассан классический", category: "Выпечка", price: 95, oldPrice: 120, image: `${assetBase}/products/food-01.webp`, color: "Сегодня", size: "1 шт." },
        "food-2": { name: "Хлеб Country", category: "Хлеб", price: 145, oldPrice: 175, image: `${assetBase}/products/food-02.webp`, color: "Сегодня", size: "500 г" },
        "food-3": { name: "Цитрусовый кекс", category: "Подарки", price: 210, oldPrice: 250, image: `${assetBase}/products/food-03.webp`, color: "Сегодня", size: "1 шт." },
        "food-4": { name: "Масло с солью", category: "К столу", price: 165, oldPrice: 195, image: `${assetBase}/products/food-04.webp`, color: "Сегодня", size: "180 г" },
        "food-5": { name: "Завтрак на двоих", category: "Подарки", price: 590, oldPrice: 690, image: `${assetBase}/products/food-05.webp`, color: "Завтра", size: "SET" },
        "food-6": { name: "Гранола с орехами", category: "Хлеб", price: 210, oldPrice: 240, image: `${assetBase}/products/food-06.webp`, color: "Сегодня", size: "350 г" },
        "food-7": { name: "Джем апельсин", category: "К столу", price: 145, oldPrice: 175, image: `${assetBase}/products/food-07.webp`, color: "Сегодня", size: "220 г" },
      },
      demoCart: [
        { key: "food-0:Сегодня:1 шт.", productId: "food-0", color: "Сегодня", size: "1 шт.", quantity: 1 },
        { key: "food-2:Сегодня:500 г", productId: "food-2", color: "Сегодня", size: "500 г", quantity: 1 },
      ],
    },
    jewelry: {
      brand: "NOIRÉ",
      optionLabels: { color: "Металл", size: "Размер" },
      products: {
        "jewelry-0": { name: "Кольцо Fold I", category: "Кольца", price: 4200, oldPrice: 4900, image: `${assetBase}/products/jewelry-00.webp`, color: "Серебро", size: "17" },
        "jewelry-1": { name: "Подвес Relic", category: "Подвесы", price: 3800, oldPrice: 4400, image: `${assetBase}/products/jewelry-01.webp`, color: "Серебро", size: "ONE SIZE" },
        "jewelry-2": { name: "Кольцо Orbit", category: "Кольца", price: 4600, oldPrice: 5200, image: `${assetBase}/products/jewelry-02.webp`, color: "Серебро", size: "18" },
        "jewelry-3": { name: "Печатка Stone", category: "Серебро", price: 5100, oldPrice: 5900, image: `${assetBase}/products/jewelry-03.webp`, color: "Чернение", size: "19" },
        "jewelry-4": { name: "Кольцо Trace", category: "Серебро", price: 3300, oldPrice: 3900, image: `${assetBase}/products/jewelry-04.webp`, color: "Серебро", size: "17" },
        "jewelry-5": { name: "Подвес Veil", category: "Подвесы", price: 3900, oldPrice: 4400, image: `${assetBase}/products/jewelry-05.webp`, color: "Патина", size: "ONE SIZE" },
        "jewelry-6": { name: "Кольца Pair", category: "One of one", price: 4100, oldPrice: 4800, image: `${assetBase}/products/jewelry-06.webp`, color: "Серебро", size: "17/18" },
        "jewelry-7": { name: "Медальон Line", category: "One of one", price: 3600, oldPrice: 4200, image: `${assetBase}/products/jewelry-07.webp`, color: "Патина", size: "ONE SIZE" },
      },
      demoCart: [
        { key: "jewelry-0:Серебро:17", productId: "jewelry-0", color: "Серебро", size: "17", quantity: 1 },
        { key: "jewelry-1:Серебро:ONE SIZE", productId: "jewelry-1", color: "Серебро", size: "ONE SIZE", quantity: 1 },
      ],
    },
  };

  const store = storePresets[storeKey] || storePresets.fashion;
  const products = store.products;
  const storageKey = `shopra-${storeKey}-cart-v1`;
  const freeShipping = 3000;
  const demoCart = store.demoCart;

  let cart = loadCart();
  let activeProductId = `${storeKey}-0`;

  const itemsElement = document.querySelector("[data-cart-items]");
  const subtotalElement = document.querySelector("[data-cart-subtotal]");
  const shippingElement = document.querySelector("[data-cart-shipping]");
  const progressElement = document.querySelector("[data-cart-progress]");
  const checkoutElement = document.querySelector("[data-cart-checkout]");
  const searchForm = document.querySelector("[data-search-form]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchTitle = document.querySelector("[data-search-title]");
  const searchResults = document.querySelector("[data-search-results]");
  const variantForm = document.querySelector("[data-variant-form]");
  const productGallery = document.querySelector("[data-product-gallery]");
  const productMediaCount = document.querySelector("[data-product-media-count]");
  const quickOrderTrigger = document.querySelector("[data-quick-order-open]");
  const quickOrderModal = quickOrderTrigger ? createQuickOrderModal() : null;
  const quickOrderForm = quickOrderModal?.querySelector("[data-quick-order-form]");
  activeProductId = variantForm?.dataset.productId || activeProductId;

  function loadCart() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === null ? demoCart : JSON.parse(stored);
    } catch {
      return demoCart;
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // The UI remains functional when storage is unavailable.
    }
  }

  function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₴`;
  }

  function itemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function subtotal() {
    return cart.reduce((total, item) => total + (products[item.productId]?.price || 0) * item.quantity, 0);
  }

  function productQuantity(productId) {
    return cart
      .filter((item) => item.productId === productId)
      .reduce((total, item) => total + item.quantity, 0);
  }

  function syncProductCardButtons() {
    document.querySelectorAll("button[data-cart-add], button[data-cart-configure]").forEach((button) => {
      const productId = button.dataset.cartAdd || button.dataset.cartConfigure;
      const quantity = productQuantity(productId);
      let marker = button.querySelector("[data-card-cart-count]");

      button.classList.toggle("uk-button-primary", quantity > 0);
      if (quantity <= 0) {
        marker?.remove();
        return;
      }

      if (!marker) {
        marker = document.createElement("span");
        marker.dataset.cardCartCount = "";
        marker.setAttribute("aria-hidden", "true");
        const badge = document.createElement("span");
        badge.className = "uk-badge uk-border-circle";
        marker.append(badge);
        button.append(marker);
      }
      marker.querySelector(".uk-badge").textContent = quantity;
    });
  }

  function setPrimaryVariantValue(input, value, checked = true) {
    if (!input) return;
    input.value = value;
    input.checked = checked;

    const label = input.closest("label");
    if (!label) return;
    const swatchColors = {
      "Кобальт": "#2457bd",
      "Чернильный": "#172333",
      "Молочный": "#eee9df",
      "Песочный": "#e7dfd2",
      "Графит": "#2b2c30",
      "Винный": "#6f2535",
      "Серый": "#a5a7a6",
      "Серебро": "#c9cdd0",
      "Патина": "#667970",
      "Золото": "#b58a43",
      "Чернение": "#252627",
    };
    const swatch = label.querySelector(".uk-icon-button:empty");
    if (swatch && swatchColors[value]) swatch.style.backgroundColor = swatchColors[value];

    const hiddenName = label.querySelector("span.uk-hidden:last-child");
    if (hiddenName) {
      hiddenName.textContent = value;
      return;
    }

    const visibleText = [...label.childNodes].reverse().find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (visibleText) visibleText.textContent = value;
  }

  function syncModalVariantChoices(product) {
    const variantModal = document.querySelector("#variant-modal");
    if (!variantModal || !variantForm) return false;

    const defaultChoices = {
      fashion: {
        colors: ["Кобальт", "Чернильный", "Молочный"],
        sizes: ["XS", "S", "M", "L"],
      },
      food: {
        colors: ["Сегодня", "Самовывоз", "Завтра"],
        sizes: ["1 шт.", "500 г", "SET"],
      },
      jewelry: {
        colors: ["Серебро", "Патина", "Золото"],
        sizes: ["17", "18", "19"],
      },
    };
    const productChoices = {
      "fashion-1": {
        colors: ["Песочный", "Графит"],
        sizes: [{ value: "XS", available: false }, "S", "M", "L"],
      },
      "fashion-3": { sizes: ["S", "M", "L", "XL"] },
      "fashion-4": { sizes: ["ONE SIZE"] },
      "fashion-5": { sizes: ["XS/S", "M/L"] },
      "food-2": { sizes: ["500 г", "1 кг"] },
      "food-3": { sizes: ["1 шт.", "6 шт."] },
      "food-4": { sizes: ["180 г", "360 г"] },
      "food-5": { sizes: ["SET"] },
      "food-6": { sizes: ["350 г", "700 г"] },
      "food-7": { sizes: ["220 г", "440 г"] },
      "jewelry-1": { sizes: ["ONE SIZE"] },
      "jewelry-5": { sizes: ["ONE SIZE"] },
      "jewelry-7": { sizes: ["ONE SIZE"] },
    };
    const defaults = defaultChoices[storeKey] || defaultChoices.fashion;
    const configured = productChoices[activeProductId];
    const inferredChoices = {
      colors: defaults.colors.includes(product.color) ? defaults.colors : [product.color, ...defaults.colors],
      sizes: defaults.sizes.includes(product.size) ? defaults.sizes : [product.size, ...defaults.sizes],
    };
    const choices = {
      colors: configured?.colors || inferredChoices.colors,
      sizes: configured?.sizes || inferredChoices.sizes,
    };

    [["color", choices.colors], ["size", choices.sizes]].forEach(([name, values]) => {
      const inputs = [...variantForm.querySelectorAll(`input[name="${name}"]`)];
      const selectedValue = name === "color" ? product.color : product.size;
      const normalizedChoices = values.map((choice) => typeof choice === "string"
        ? { value: choice, available: true }
        : { value: choice.value, available: choice.available !== false });
      const selectedIndex = normalizedChoices.findIndex((choice) => choice.value === selectedValue && choice.available);
      const activeIndex = selectedIndex >= 0
        ? selectedIndex
        : normalizedChoices.findIndex((choice) => choice.available);

      inputs.forEach((input, index) => {
        const label = input.closest("label");
        const wrapper = label?.parentElement;
        const choice = normalizedChoices[index];
        const value = choice?.value;
        if (wrapper) wrapper.hidden = !choice;
        input.checked = false;
        input.disabled = !choice || !choice.available;
        label?.classList.toggle("uk-disabled", Boolean(choice && !choice.available));
        label?.toggleAttribute("data-variant-unavailable", Boolean(choice && !choice.available));
        if (choice && !choice.available) label?.setAttribute("aria-disabled", "true");
        else label?.removeAttribute("aria-disabled");

        label?.querySelector("[data-variant-lock]")?.remove();
        if (choice && !choice.available && label) {
          const lock = document.createElement("span");
          lock.dataset.variantLock = "";
          lock.setAttribute("uk-icon", "icon: lock; ratio: 0.65");
          label.append(lock);
        }

        if (value) setPrimaryVariantValue(input, value, index === activeIndex);
      });
    });
    window.UIkit?.update(variantModal);
    return true;
  }

  function syncVariantCartStatus() {
    const variantModal = document.querySelector("#variant-modal");
    if (!variantModal || !variantForm) return;

    const footer = variantModal.querySelector(".uk-modal-footer");
    const confirmButton = footer?.querySelector("[data-cart-confirm]");
    if (!footer || !confirmButton) return;

    let status = footer.querySelector("[data-variant-cart-status]");
    if (!status) {
      status = document.createElement("p");
      status.dataset.variantCartStatus = "";
      status.className = "uk-margin-remove-top";
      footer.insertBefore(status, confirmButton);
    }

    const color = variantForm.querySelector('input[name="color"]:checked')?.value || "";
    const size = variantForm.querySelector('input[name="size"]:checked')?.value || "";
    const quantity = cart.find((item) => item.key === `${activeProductId}:${color}:${size}`)?.quantity || 0;
    status.hidden = quantity === 0;
    status.innerHTML = quantity ? `Эта модификация уже в корзине: <b>${quantity}</b>` : "";
  }

  function syncVariantOptions() {
    if (!variantForm) return;
    variantForm.querySelectorAll("[data-variant-option]").forEach((option) => {
      const active = option.querySelector("input").checked;
      option.classList.toggle("uk-button-primary", active);
      option.classList.toggle("uk-button-default", !active);
    });
    const color = variantForm.querySelector('input[name="color"]:checked')?.value || "";
    const size = variantForm.querySelector('input[name="size"]:checked')?.value || "";
    document.querySelectorAll("[data-variant-color-current]").forEach((element) => {
      element.textContent = color;
    });
    document.querySelectorAll("[data-variant-size-current]").forEach((element) => {
      element.textContent = size;
    });
    syncVariantCartStatus();
  }

  function syncProductGallery() {
    if (!productGallery) return;
    const slides = [...productGallery.querySelectorAll("[data-product-main-track] > li")];
    const currentIndex = window.UIkit?.slider(productGallery).index || 0;
    const visibleCount = window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
    const lastVisibleIndex = Math.min(currentIndex + visibleCount - 1, slides.length - 1);
    if (productMediaCount) {
      productMediaCount.textContent = currentIndex === lastVisibleIndex
        ? `${currentIndex + 1} / ${slides.length}`
        : `${currentIndex + 1}–${lastVisibleIndex + 1} / ${slides.length}`;
    }
    document.querySelectorAll("[data-product-media-index]").forEach((thumbnail) => {
      const index = Number(thumbnail.dataset.productMediaIndex);
      thumbnail.classList.toggle("uk-active", index >= currentIndex && index <= lastVisibleIndex);
    });
  }

  function syncRoutedProduct() {
    if (!variantForm?.dataset.productId) return;

    const requestedIndex = new URLSearchParams(window.location.search).get("id");
    const requestedProductId = /^\d+$/.test(requestedIndex || "") ? `${storeKey}-${requestedIndex}` : variantForm.dataset.productId;
    const product = products[requestedProductId];
    if (!product) return;

    activeProductId = requestedProductId;
    variantForm.dataset.productId = requestedProductId;
    document.title = `${product.name} — ${store.brand}`;

    document.querySelectorAll("[data-variant-name]").forEach((element) => { element.textContent = product.name; });
    document.querySelectorAll("[data-variant-category]").forEach((element) => { element.textContent = product.category; });
    document.querySelectorAll("[data-variant-price]").forEach((element) => { element.textContent = formatPrice(product.price); });
    document.querySelectorAll("[data-variant-old-price]").forEach((element) => { element.textContent = formatPrice(product.oldPrice); });

    const variantImage = document.querySelector("[data-variant-image]");
    if (variantImage) {
      variantImage.src = product.image;
      variantImage.alt = product.name;
    }

    const colorInputs = [...variantForm.querySelectorAll('input[name="color"]')];
    colorInputs.forEach((input) => { input.checked = false; });
    const primaryColor = colorInputs.find((input) => input.value === product.color && !input.disabled)
      || colorInputs.find((input) => !input.disabled);
    setPrimaryVariantValue(primaryColor, product.color);

    const sizeInputs = [...variantForm.querySelectorAll('input[name="size"]')];
    sizeInputs.forEach((input) => { input.checked = false; });
    const primarySize = sizeInputs.find((input) => input.value === product.size && !input.disabled)
      || sizeInputs.find((input) => !input.disabled);
    setPrimaryVariantValue(primarySize, product.size);
  }

  function createQuickOrderModal() {
    const modal = document.createElement("div");
    modal.id = "quick-order-modal";
    modal.className = "uk-flex-top";
    modal.dataset.quickOrderModal = "";
    modal.setAttribute("uk-modal", "");
    modal.innerHTML = `
      <div class="uk-modal-dialog uk-width-large uk-margin-auto-vertical">
        <button class="uk-modal-close-default uk-icon-button" type="button" aria-label="Закрыть быстрый заказ" uk-close></button>
        <form class="uk-form-stacked" data-quick-order-form>
          <header class="uk-modal-header">
            <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom">${store.brand}</p>
            <h2 class="uk-modal-title uk-margin-small-top uk-margin-small-bottom">Быстрый заказ</h2>
            <p class="uk-text-muted uk-margin-remove">Оформим в один звонок.</p>
          </header>
          <div class="uk-modal-body">
            <article class="uk-card uk-card-default uk-card-body uk-padding-small" data-quick-order-product>
              <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-auto"><img src="" alt="" width="88" height="112" data-quick-order-image></div>
                <div class="uk-width-expand">
                  <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom" data-quick-order-category></p>
                  <h3 class="uk-h4 uk-margin-small-top uk-margin-small-bottom" data-quick-order-name></h3>
                  <div class="uk-flex uk-flex-wrap" data-quick-order-options>
                    <span class="uk-label uk-border-pill uk-margin-small-right"><b>${store.optionLabels.color}</b><span data-quick-order-color></span></span>
                    <span class="uk-label uk-border-pill"><b>${store.optionLabels.size}</b><span data-quick-order-size></span></span>
                  </div>
                </div>
                <div class="uk-width-auto uk-text-right">
                  <strong class="uk-display-block" data-quick-order-line-total></strong>
                  <small class="uk-text-muted">× <span data-quick-order-quantity></span></small>
                </div>
              </div>
            </article>

            <section class="uk-margin-top" data-quick-order-contact>
              <header class="uk-flex uk-flex-between uk-flex-middle">
                <div><h3 class="uk-h4 uk-margin-remove">Контактные данные</h3><p class="uk-text-meta uk-margin-small-top uk-margin-remove-bottom">Только для подтверждения заказа</p></div>
                <span class="uk-text-primary" uk-icon="icon: receiver"></span>
              </header>
              <div class="uk-grid-small uk-child-width-1-2@s uk-margin-small-top" uk-grid>
                <div>
                  <label class="uk-form-label" for="quick-order-name">Имя</label>
                  <div class="uk-form-controls"><input id="quick-order-name" class="uk-input uk-form-large" name="name" type="text" placeholder="Ваше имя" autocomplete="name" required></div>
                </div>
                <div>
                  <label class="uk-form-label" for="quick-order-phone">Телефон</label>
                  <div class="uk-form-controls"><input id="quick-order-phone" class="uk-input uk-form-large" name="phone" type="tel" placeholder="+380 00 000 00 00" autocomplete="tel" minlength="7" required></div>
                </div>
              </div>
            </section>
          </div>
          <footer class="uk-modal-footer">
            <div class="uk-flex uk-flex-between uk-flex-bottom">
              <span class="uk-text-large">Итого</span>
              <strong class="uk-h2 uk-margin-remove" data-quick-order-total></strong>
            </div>
            <button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-margin-top uk-flex uk-flex-between uk-flex-middle" type="submit"><span>Подтвердить заказ</span><span uk-icon="icon: arrow-right"></span></button>
            <p class="uk-text-meta uk-text-center uk-margin-small-bottom">Менеджер свяжется с вами для подтверждения</p>
          </footer>
        </form>
        <section class="uk-modal-body uk-text-center uk-padding-large" data-quick-order-success hidden>
          <span class="uk-icon-button uk-button-primary" uk-icon="icon: check; ratio: 1.4"></span>
          <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-top uk-margin-remove-bottom">Заказ принят</p>
          <h2 class="uk-modal-title uk-margin-small-top">Спасибо.</h2>
          <p class="uk-text-muted">Мы перезвоним на <strong data-quick-order-success-phone></strong>, чтобы подтвердить заказ.</p>
          <button class="uk-button uk-button-default uk-modal-close" type="button">Продолжить покупки</button>
        </section>
      </div>`;
    document.body.append(modal);
    window.UIkit?.update(modal);
    return modal;
  }

  function currentProductSelection() {
    const product = products[activeProductId];
    if (!product) return null;
    return {
      product,
      color: variantForm?.querySelector('input[name="color"]:checked')?.value || product.color,
      size: variantForm?.querySelector('input[name="size"]:checked')?.value || product.size,
      quantity: Math.max(1, Number(document.querySelector("[data-product-quantity]")?.textContent) || 1),
    };
  }

  function syncQuickOrder() {
    if (!quickOrderModal) return;
    const selection = currentProductSelection();
    if (!selection) return;
    const { product, color, size, quantity } = selection;
    const setText = (selector, value) => {
      const element = quickOrderModal.querySelector(selector);
      if (element) element.textContent = value;
    };
    const image = quickOrderModal.querySelector("[data-quick-order-image]");
    if (image) {
      image.src = product.image;
      image.alt = product.name;
    }
    setText("[data-quick-order-category]", product.category);
    setText("[data-quick-order-name]", product.name);
    setText("[data-quick-order-color]", color);
    setText("[data-quick-order-size]", size);
    setText("[data-quick-order-quantity]", quantity);
    setText("[data-quick-order-line-total]", formatPrice(product.price * quantity));
    setText("[data-quick-order-total]", formatPrice(product.price * quantity));
  }

  function renderSearchItem([productId, product]) {
    return `
      <li>
        <a class="uk-link-reset uk-modal-close" href="product.html?id=${productId.split("-").pop()}" aria-label="Открыть ${product.name}" data-search-result>
          <img src="${product.image}" alt="${product.name}" width="48" height="64" data-search-image>
          <div data-search-copy>
            <h4 data-search-name>${product.name}</h4>
            <strong class="uk-text-primary" data-search-price>${formatPrice(product.price)}</strong>
          </div>
          <span uk-icon="icon: arrow-right" aria-hidden="true"></span>
        </a>
      </li>`;
  }

  function renderSearch(query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
    const entries = Object.entries(products).filter(([, product]) => {
      const searchable = `${product.name} ${product.category} ${product.color}`.toLocaleLowerCase("ru-RU");
      return searchable.includes(normalizedQuery);
    });
    const visibleEntries = normalizedQuery ? entries : entries.slice(0, 4);

    searchTitle.textContent = normalizedQuery ? "Результаты поиска" : "Популярные товары";
    searchResults.innerHTML = visibleEntries.length
      ? visibleEntries.map(renderSearchItem).join("")
      : `<li><div data-search-empty><span uk-icon="icon: search" aria-hidden="true"></span><h4>Товары не найдены</h4><p class="uk-text-meta">Попробуйте изменить запрос.</p></div></li>`;
  }

  function deliveryIcon() {
    return '<span class="shopra-delivery-icon" aria-hidden="true"><span uk-icon="icon: shopra-delivery"></span></span>';
  }

  function initDeliveryIcons() {
    window.UIkit?.icon.add({
      "shopra-delivery": '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17H3V7h11v10h-4M14 10h4l3 4v3h-2M14 17h1M14 14h7"/><circle cx="8" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
    });
    document.querySelectorAll("[data-shipping-banner]").forEach((banner) => {
      const text = document.createElement("span");
      text.textContent = banner.textContent.trim();
      banner.innerHTML = deliveryIcon();
      banner.append(text);
    });
    shippingElement.setAttribute("aria-live", "polite");
    searchResults.setAttribute("aria-live", "polite");
  }

  function renderItem(item) {
    const product = products[item.productId];
    if (!product) return "";
    return `
      <article data-cart-item>
        <div class="uk-grid-small" uk-grid>
          <div class="uk-width-1-3" data-cart-item-media>
            <img src="${product.image}" alt="${product.name}" width="720" height="960" data-cart-item-image>
          </div>
          <div class="uk-width-expand" data-cart-item-body>
            <p class="uk-text-meta uk-text-uppercase uk-text-bold uk-margin-remove-bottom" data-cart-item-category>${product.category}</p>
            <h3 class="uk-h4 uk-margin-small-top uk-margin-small-bottom" data-cart-item-title>${product.name}</h3>
            <p class="uk-margin-small" data-cart-options>
              <span class="uk-label uk-border-pill"><b>${store.optionLabels.color}</b><span>${item.color}</span></span>
              <span class="uk-label uk-border-pill"><b>${store.optionLabels.size}</b><span>${item.size}</span></span>
            </p>
            <strong data-cart-item-price>${formatPrice(product.price)}</strong>
            <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-top" data-cart-item-actions>
              <div class="uk-button-group" aria-label="Количество ${product.name}" data-cart-quantity>
                <button class="uk-button uk-button-default uk-button-small" type="button" data-cart-action="decrease" data-cart-key="${item.key}" aria-label="Уменьшить количество">−</button>
                <span class="uk-button uk-button-default uk-button-small">${item.quantity}</span>
                <button class="uk-button uk-button-default uk-button-small" type="button" data-cart-action="increase" data-cart-key="${item.key}" aria-label="Увеличить количество">+</button>
              </div>
              <button class="uk-button uk-button-text" type="button" data-cart-action="remove" data-cart-key="${item.key}" data-cart-remove><span uk-icon="icon: trash; ratio: 0.65"></span><span>Удалить</span></button>
            </div>
          </div>
        </div>
        <hr class="uk-margin-medium-top uk-margin-medium-bottom">
      </article>`;
  }

  function render() {
    const count = itemCount();
    const total = subtotal();
    document.querySelectorAll("[data-cart-count]").forEach((element) => { element.textContent = count; });
    subtotalElement.textContent = formatPrice(total);
    progressElement.value = Math.min(total, freeShipping);
    progressElement.max = freeShipping;
    const shippingMessage = total >= freeShipping
      ? "<b>Бесплатная доставка доступна</b> для этого заказа"
      : `До бесплатной доставки ещё <b>${formatPrice(freeShipping - total)}</b>`;
    shippingElement.innerHTML = `${deliveryIcon()}<span>${shippingMessage}</span>`;
    checkoutElement.disabled = cart.length === 0;
    itemsElement.innerHTML = cart.length
      ? cart.map(renderItem).join("")
      : `<div class="uk-text-center uk-padding"><span uk-icon="icon: cart; ratio: 2"></span><h3>Корзина пока пуста</h3><p>Добавьте товары из каталога — они сразу появятся здесь.</p><a class="uk-button uk-button-primary uk-modal-close" href="#products">Перейти к товарам</a></div>`;
    syncProductCardButtons();
    syncVariantCartStatus();
  }

  function addItem(productId, color, size, quantity = 1) {
    const product = products[productId];
    if (!product) return;
    const key = `${productId}:${color}:${size}`;
    const existing = cart.find((item) => item.key === key);
    if (existing) existing.quantity += quantity;
    else cart.push({ key, productId, color, size, quantity });
    saveCart();
    render();
  }

  document.addEventListener("click", (event) => {
    const checkout = event.target.closest("[data-cart-checkout]");
    if (checkout && !checkout.disabled) {
      window.location.href = "checkout.html";
      return;
    }

    const quickOrderOpen = event.target.closest("[data-quick-order-open]");
    if (quickOrderOpen && quickOrderModal) {
      event.preventDefault();
      syncQuickOrder();
      window.UIkit?.modal(quickOrderModal).show();
      return;
    }

    const configure = event.target.closest("[data-cart-configure]");
    if (configure) {
      activeProductId = configure.dataset.cartConfigure;
      const product = products[activeProductId];
      document.querySelector("[data-variant-name]").textContent = product.name;
      document.querySelector("[data-variant-price]").textContent = formatPrice(product.price);
      const variantImage = document.querySelector("[data-variant-image]");
      if (variantImage) {
        variantImage.src = product.image;
        variantImage.alt = product.name;
      }
      variantForm?.reset();
      syncModalVariantChoices(product);
      syncVariantOptions();
    }

    const directAdd = event.target.closest("[data-cart-add]");
    if (directAdd) {
      event.preventDefault();
      const product = products[directAdd.dataset.cartAdd];
      addItem(directAdd.dataset.cartAdd, product.color, product.size);
      window.UIkit?.modal("#cart-modal").show();
    }

    const action = event.target.closest("[data-cart-action]");
    if (action) {
      const index = cart.findIndex((item) => item.key === action.dataset.cartKey);
      if (index < 0) return;
      if (action.dataset.cartAction === "increase") cart[index].quantity += 1;
      if (action.dataset.cartAction === "decrease") cart[index].quantity -= 1;
      if (action.dataset.cartAction === "remove" || cart[index].quantity <= 0) cart.splice(index, 1);
      saveCart();
      render();
    }

    const quantityAction = event.target.closest("[data-product-quantity-action]");
    if (quantityAction) {
      const quantityElement = document.querySelector("[data-product-quantity]");
      const currentQuantity = Number(quantityElement.textContent) || 1;
      quantityElement.textContent = quantityAction.dataset.productQuantityAction === "increase"
        ? currentQuantity + 1
        : Math.max(1, currentQuantity - 1);
    }

    const mediaThumbnail = event.target.closest("[data-product-media-index]");
    if (mediaThumbnail && productGallery) {
      event.preventDefault();
      window.UIkit?.slider(productGallery).show(Number(mediaThumbnail.dataset.productMediaIndex));
    }

    if (event.target.closest("[data-cart-confirm]")) {
      const color = variantForm.querySelector('input[name="color"]:checked')?.value || products[activeProductId].color;
      const size = variantForm.querySelector('input[name="size"]:checked')?.value || products[activeProductId].size;
      const quantity = Number(document.querySelector("[data-product-quantity]")?.textContent) || 1;
      addItem(activeProductId, color, size, quantity);
      const variantModal = document.querySelector("#variant-modal");
      if (variantModal) window.UIkit?.modal(variantModal).hide();
      window.setTimeout(() => window.UIkit?.modal("#cart-modal").show(), 220);
    }
  });

  searchForm.addEventListener("submit", (event) => event.preventDefault());
  searchInput.addEventListener("input", (event) => renderSearch(event.target.value));
  document.querySelector("#search-modal").addEventListener("shown", () => searchInput.focus());
  document.querySelector("#variant-modal")?.addEventListener("beforeshow", () => {
    const product = products[activeProductId];
    if (!product) return;
    syncModalVariantChoices(product);
    syncVariantOptions();
  });
  variantForm?.addEventListener("change", syncVariantOptions);
  quickOrderForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quickOrderForm.reportValidity()) return;
    const phone = new FormData(quickOrderForm).get("phone")?.toString().trim() || "указанный номер";
    quickOrderModal.querySelector("[data-quick-order-success-phone]").textContent = phone;
    quickOrderForm.hidden = true;
    quickOrderModal.querySelector("[data-quick-order-success]").hidden = false;
  });
  quickOrderModal?.addEventListener("hidden", () => {
    quickOrderForm.hidden = false;
    quickOrderModal.querySelector("[data-quick-order-success]").hidden = true;
    quickOrderForm.reset();
  });
  productGallery?.addEventListener("itemshown", () => window.setTimeout(syncProductGallery));
  window.addEventListener("resize", syncProductGallery);

  initDeliveryIcons();
  syncRoutedProduct();
  render();
  renderSearch();
  syncVariantOptions();
  syncProductGallery();
})();

