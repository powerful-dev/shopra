(() => {
  const grid = document.querySelector("[data-catalog-grid]");
  const products = [...document.querySelectorAll("[data-catalog-product]")];
  const countElements = document.querySelectorAll("[data-catalog-count]");
  const priceOutputs = document.querySelectorAll("[data-filter-price-output]");
  const sortSelect = document.querySelector("[data-catalog-sort]");
  const catalogMaxPrice = Number(document.documentElement.dataset.catalogMaxPrice) || 6800;

  if (!grid || !products.length) return;

  const defaults = {
    category: "all",
    maxPrice: catalogMaxPrice,
    saleOnly: false,
    size: "all",
    sort: "popular",
  };

  const state = { ...defaults };
  const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
  const categoryMap = { "0": "new", "1": "jackets", "2": "knit", "3": "accessories" };
  if (categoryMap[categoryFromUrl]) state.category = categoryMap[categoryFromUrl];

  function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₴`;
  }

  function syncControls() {
    document.querySelectorAll("[data-filter-category]").forEach((input) => {
      input.checked = input.value === state.category;
    });
    document.querySelectorAll("[data-filter-price]").forEach((input) => {
      input.value = state.maxPrice;
    });
    priceOutputs.forEach((output) => {
      output.textContent = formatPrice(state.maxPrice);
    });
    document.querySelectorAll("[data-filter-sale]").forEach((input) => {
      input.checked = state.saleOnly;
    });
    document.querySelectorAll("[data-filter-size]").forEach((button) => {
      const active = button.dataset.filterSize === state.size;
      button.classList.toggle("uk-button-primary", active);
      button.classList.toggle("uk-button-default", !active);
    });
    if (sortSelect) sortSelect.value = state.sort;
  }

  function matches(product) {
    const categoryMatches = state.category === "all" || product.dataset.category === state.category;
    const priceMatches = Number(product.dataset.price) <= state.maxPrice;
    const saleMatches = !state.saleOnly || product.dataset.sale === "true";
    const sizes = product.dataset.sizes.split(",");
    const sizeMatches = state.size === "all" || sizes.includes(state.size);
    return categoryMatches && priceMatches && saleMatches && sizeMatches;
  }

  function sortProducts(items) {
    return items.sort((first, second) => {
      if (state.sort === "low") return Number(first.dataset.price) - Number(second.dataset.price);
      if (state.sort === "high") return Number(second.dataset.price) - Number(first.dataset.price);
      if (state.sort === "new") return Number(first.dataset.order) - Number(second.dataset.order);
      return Number(first.dataset.order) - Number(second.dataset.order);
    });
  }

  function applyFilters() {
    const orderedProducts = sortProducts([...products]);
    let visibleCount = 0;

    orderedProducts.forEach((product) => {
      const visible = matches(product);
      product.classList.toggle("uk-hidden", !visible);
      if (visible) visibleCount += 1;
      grid.append(product);
    });

    countElements.forEach((element) => {
      element.textContent = visibleCount;
    });
    document.querySelectorAll("[data-filter-apply]").forEach((button) => {
      button.textContent = `Показать ${visibleCount} товаров`;
    });
  }

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-filter-category]")) state.category = event.target.value;
    if (event.target.matches("[data-filter-price]")) state.maxPrice = Number(event.target.value);
    if (event.target.matches("[data-filter-sale]")) state.saleOnly = event.target.checked;
    if (event.target.matches("[data-catalog-sort]")) state.sort = event.target.value;
    syncControls();
    applyFilters();
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-filter-price]")) return;
    state.maxPrice = Number(event.target.value);
    syncControls();
    applyFilters();
  });

  document.addEventListener("click", (event) => {
    const sizeButton = event.target.closest("[data-filter-size]");
    if (sizeButton) {
      state.size = sizeButton.dataset.filterSize;
      syncControls();
      applyFilters();
    }

    if (event.target.closest("[data-filter-reset]")) {
      Object.assign(state, defaults);
      syncControls();
      applyFilters();
    }
  });

  syncControls();
  applyFilters();
})();
