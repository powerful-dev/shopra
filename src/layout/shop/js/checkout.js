(() => {
  const storeKey = document.documentElement.dataset.shopraStore || "fashion";
  const storePresets = {
    fashion: {
      optionLabels: { color: "Цвет", size: "Размер" },
      products: {
        "fashion-0": { name: "Жакет Form 02", price: 4900, image: "assets/products/fashion-00.webp" },
        "fashion-1": { name: "Пальто Axis", price: 6800, image: "assets/products/fashion-01.webp" },
        "fashion-2": { name: "Топ Line Wine", price: 1850, image: "assets/products/fashion-02.webp" },
        "fashion-3": { name: "Брюки Wide", price: 2950, image: "assets/products/fashion-03.webp" },
        "fashion-4": { name: "Сумка Mini Fold", price: 2300, image: "assets/products/fashion-04.webp" },
        "fashion-5": { name: "Кардиган Soft 08", price: 3200, image: "assets/products/fashion-05.webp" },
        "fashion-6": { name: "Гольф Base", price: 1600, image: "assets/products/fashion-06.webp" },
        "fashion-7": { name: "Юбка Column", price: 2700, image: "assets/products/fashion-07.webp" },
      },
      demoCart: [
        { key: "fashion-1:Песочный:S", productId: "fashion-1", color: "Песочный", size: "S", quantity: 4 },
        { key: "fashion-0:Чернильный:M", productId: "fashion-0", color: "Чернильный", size: "M", quantity: 1 },
        { key: "fashion-5:Графит:M/L", productId: "fashion-5", color: "Графит", size: "M/L", quantity: 4 },
      ],
    },
    food: {
      optionLabels: { color: "Получение", size: "Формат" },
      products: {
        "food-0": { name: "Тарт фисташка", price: 185, image: "assets/products/food-00.webp" },
        "food-1": { name: "Круассан классический", price: 95, image: "assets/products/food-01.webp" },
        "food-2": { name: "Хлеб Country", price: 145, image: "assets/products/food-02.webp" },
        "food-3": { name: "Цитрусовый кекс", price: 210, image: "assets/products/food-03.webp" },
        "food-4": { name: "Масло с солью", price: 165, image: "assets/products/food-04.webp" },
        "food-5": { name: "Завтрак на двоих", price: 590, image: "assets/products/food-05.webp" },
        "food-6": { name: "Гранола с орехами", price: 210, image: "assets/products/food-06.webp" },
        "food-7": { name: "Джем апельсин", price: 145, image: "assets/products/food-07.webp" },
      },
      demoCart: [
        { key: "food-0:Сегодня:1 шт.", productId: "food-0", color: "Сегодня", size: "1 шт.", quantity: 1 },
        { key: "food-2:Сегодня:500 г", productId: "food-2", color: "Сегодня", size: "500 г", quantity: 1 },
      ],
    },
    jewelry: {
      optionLabels: { color: "Металл", size: "Размер" },
      products: {
        "jewelry-0": { name: "Кольцо Fold I", price: 4200, image: "assets/products/jewelry-00.webp" },
        "jewelry-1": { name: "Подвес Relic", price: 3800, image: "assets/products/jewelry-01.webp" },
        "jewelry-2": { name: "Кольцо Orbit", price: 4600, image: "assets/products/jewelry-02.webp" },
        "jewelry-3": { name: "Печатка Stone", price: 5100, image: "assets/products/jewelry-03.webp" },
        "jewelry-4": { name: "Кольцо Trace", price: 3300, image: "assets/products/jewelry-04.webp" },
        "jewelry-5": { name: "Подвес Veil", price: 3900, image: "assets/products/jewelry-05.webp" },
        "jewelry-6": { name: "Кольца Pair", price: 4100, image: "assets/products/jewelry-06.webp" },
        "jewelry-7": { name: "Медальон Line", price: 3600, image: "assets/products/jewelry-07.webp" },
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
  const deliveryPrices = { nova: 90, courier: 180, ukrposhta: 70 };
  const demoCart = store.demoCart;

  const form = document.querySelector("[data-checkout-form]");
  const emptyState = document.querySelector("[data-checkout-empty]");
  const successState = document.querySelector("[data-checkout-success]");
  const orderLines = document.querySelector("[data-order-lines]");
  const promoInput = document.querySelector("[data-promo-input]");
  const promoMessage = document.querySelector("[data-promo-message]");
  let cart = loadCart();
  let promoApplied = false;

  function loadCart() {
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored === null ? demoCart : JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter((item) => products[item.productId] && item.quantity > 0) : demoCart;
    } catch {
      return demoCart;
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // The checkout remains usable when storage is unavailable.
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    }[character]));
  }

  function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₴`;
  }

  function itemCount() {
    return cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }

  function subtotal() {
    return cart.reduce((total, item) => total + products[item.productId].price * Number(item.quantity || 0), 0);
  }

  function selectedValue(name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function deliveryPrice() {
    return subtotal() >= freeShipping ? 0 : deliveryPrices[selectedValue("delivery")] || 0;
  }

  function discount() {
    return promoApplied ? Math.round(subtotal() * 0.1) : 0;
  }

  function codFee() {
    return selectedValue("payment") === "cod" ? 20 : 0;
  }

  function total() {
    return subtotal() - discount() + deliveryPrice() + codFee();
  }

  function renderLine(item) {
    const product = products[item.productId];
    const options = [
      item.color ? `${store.optionLabels.color}: ${escapeHTML(item.color)}` : "",
      item.size ? `${store.optionLabels.size}: ${escapeHTML(item.size)}` : "",
    ].filter(Boolean).join(" · ");

    return `
      <article class="uk-grid-small uk-flex-top" uk-grid data-order-line>
        <div class="uk-width-auto">
          <div class="uk-inline" data-order-media>
            <img src="${product.image}" width="56" height="76" alt="${escapeHTML(product.name)}" data-order-image>
            <span class="uk-badge" data-order-quantity>${Number(item.quantity)}</span>
          </div>
        </div>
        <div class="uk-width-expand">
          <strong class="uk-display-block" data-order-name>${escapeHTML(product.name)}</strong>
          <small class="uk-text-muted" data-order-options>${options}</small>
          <div data-order-line-footer>
            <strong data-order-line-total>${formatPrice(product.price * Number(item.quantity))}</strong>
            <button class="uk-button uk-button-text" type="button" data-checkout-remove data-cart-key="${escapeHTML(item.key)}" aria-label="Удалить ${escapeHTML(product.name)} из корзины"><span uk-icon="icon: trash; ratio: 0.65"></span><span>Удалить</span></button>
          </div>
        </div>
      </article>
      <hr class="uk-margin-small-top uk-margin-small-bottom">`;
  }

  function updateChoiceCards(selector) {
    document.querySelectorAll(selector).forEach((label) => {
      const active = label.querySelector("input").checked;
      label.classList.toggle("uk-card-primary", active);
      label.classList.toggle("uk-light", active);
      label.classList.toggle("uk-card-default", !active);
    });
  }

  function updateDeliveryFields() {
    const courier = selectedValue("delivery") === "courier";
    document.querySelector("[data-branch-label]").textContent = courier ? "Индекс" : "Номер отделения";
    document.querySelector("[data-branch-input]").placeholder = courier ? "01001" : "Например, №12";
    document.querySelector("[data-address-label]").textContent = courier ? "Адрес доставки" : "Адрес или название отделения";
    document.querySelector("[data-address-input]").placeholder = courier ? "Улица, дом, квартира" : "Улица и номер отделения";
  }

  function updatePaymentFields() {
    const showCard = selectedValue("payment") === "card";
    document.querySelector("[data-card-fields]").hidden = !showCard;
    document.querySelectorAll("[data-card-input]").forEach((input) => {
      input.required = showCard;
      input.disabled = !showCard;
    });
  }

  function renderSummary() {
    if (!cart.length) {
      form.hidden = true;
      emptyState.hidden = false;
      return;
    }

    form.hidden = false;
    emptyState.hidden = true;
    orderLines.innerHTML = cart.map(renderLine).join("");
    document.querySelector("[data-order-count]").textContent = itemCount();
    document.querySelector("[data-order-subtotal]").textContent = formatPrice(subtotal());
    document.querySelector("[data-order-delivery]").textContent = deliveryPrice() ? formatPrice(deliveryPrice()) : "Бесплатно";
    document.querySelector("[data-order-total]").textContent = formatPrice(total());
    document.querySelector("[data-order-discount]").textContent = `−${formatPrice(discount())}`;
    document.querySelector("[data-discount-row]").hidden = !promoApplied;
    document.querySelector("[data-cod-row]").hidden = selectedValue("payment") !== "cod";

    const free = subtotal() >= freeShipping;
    document.querySelector("[data-delivery-note]").textContent = free
      ? "Для вашего заказа доставка бесплатная."
      : "Выберите удобный способ получения.";
    document.querySelectorAll("[data-delivery-price]").forEach((element) => {
      element.textContent = free ? "Бесплатно" : formatPrice(deliveryPrices[element.dataset.deliveryPrice]);
    });
  }

  form.addEventListener("change", (event) => {
    if (event.target.name === "delivery") {
      updateChoiceCards("[data-delivery-option]");
      updateDeliveryFields();
    }
    if (event.target.name === "payment") {
      updateChoiceCards("[data-payment-option]");
      updatePaymentFields();
    }
    renderSummary();
  });

  orderLines.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-checkout-remove]");
    if (!removeButton) return;

    cart = cart.filter((item) => item.key !== removeButton.dataset.cartKey);
    saveCart();
    renderSummary();
  });

  promoInput.addEventListener("input", () => {
    promoApplied = false;
    promoMessage.hidden = true;
    promoMessage.classList.remove("uk-text-success", "uk-text-danger");
    renderSummary();
  });

  document.querySelector("[data-promo-apply]").addEventListener("click", () => {
    promoApplied = promoInput.value.trim().toUpperCase() === "SHOPRA10";
    promoMessage.hidden = false;
    promoMessage.classList.toggle("uk-text-success", promoApplied);
    promoMessage.classList.toggle("uk-text-danger", !promoApplied);
    promoMessage.textContent = promoApplied
      ? "Промокод применён: скидка 10%"
      : "Для демо используйте SHOPRA10";
    renderSummary();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const orderTotal = total();
    const orderNumber = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
    document.querySelector("[data-order-number]").textContent = orderNumber;
    document.querySelector("[data-success-total]").textContent = formatPrice(orderTotal);
    try {
      localStorage.setItem(storageKey, "[]");
    } catch {
      // The local demo can still show the confirmation when storage is unavailable.
    }
    cart = [];
    form.hidden = true;
    successState.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateChoiceCards("[data-delivery-option]");
  updateChoiceCards("[data-payment-option]");
  updateDeliveryFields();
  updatePaymentFields();
  renderSummary();
})();
