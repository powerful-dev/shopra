"use client";

import {
  ArrowLeft,
  BadgePercent,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Heart,
  Package,
  Percent,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type View = "home" | "offers" | "offer-form" | "promo" | "sale";
type OfferKind = "favorite" | "cart" | "repeat";
type SaleScope = "all" | "selected" | "low-stock" | "variant";
type OfferScope = "all" | "selected";
type SelectionMode = "products" | "categories";

const offerContent: Record<OfferKind, { title: string; text: string; icon: typeof Heart; stat: string }> = {
  favorite: {
    title: "Добавили товар в избранное",
    text: "Автоматически отправить скидку тем, кто проявил интерес к товару.",
    icon: Heart,
    stat: "202 покупателя за 30 дней",
  },
  cart: {
    title: "Оставили товар в корзине",
    text: "Мягко напомнить о покупке и помочь завершить заказ.",
    icon: ShoppingCart,
    stat: "78 покупателей за 30 дней",
  },
  repeat: {
    title: "Уже покупали в магазине",
    text: "Поблагодарить покупателя и предложить вернуться за новым заказом.",
    icon: Users,
    stat: "20 повторных покупателей",
  },
};

const products = [
  { id: "city", title: "Кожаный рюкзак City", meta: "12 вариантов · остаток 18", selected: true },
  { id: "hunter", title: "Сумка Hunter", meta: "8 вариантов · остаток 6", selected: false },
  { id: "annabel", title: "Сумка Annabel", meta: "4 варианта · остаток 3", selected: true },
];

const categories = [
  { id: "urban", title: "Рюкзаки → Городские", meta: "24 товара" },
  { id: "bags", title: "Сумки", meta: "32 товара" },
  { id: "accessories", title: "Аксессуары", meta: "18 товаров" },
  { id: "new", title: "Новинки", meta: "12 товаров" },
];

const colorOptions = ["Коньяк", "Кофе", "Чёрный", "Синий"];
const sizeOptions = ["Мини", "Стандартный", "Большой"];

const scopeContent: Array<{ id: SaleScope; title: string; text: string; icon: typeof Package }> = [
  { id: "all", title: "Все товары", text: "Текущие и новые товары магазина", icon: Package },
  { id: "selected", title: "Выбранные товары", text: "Товары или целые категории", icon: Check },
  { id: "low-stock", title: "Мало на складе", text: "Автоматически по остатку", icon: Clock },
  { id: "variant", title: "Определённая модификация", text: "Например, только цвет или размер", icon: Sparkles },
];

function DiscountHeader({ title, text, onBack }: { title: string; text: string; onBack?: () => void }) {
  return (
    <header className="sd-page-head">
      <div className="sd-heading-line">
        {onBack && (
          <button type="button" className="sd-back" onClick={onBack} aria-label="Вернуться назад">
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <p className="eyebrow">Shopra · Продвижение</p>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </header>
  );
}

export function DiscountsPage() {
  const [view, setView] = useState<View>("home");
  const [offerKind, setOfferKind] = useState<OfferKind>("favorite");
  const [offerPercent, setOfferPercent] = useState("15");
  const [offerScope, setOfferScope] = useState<OfferScope>("all");
  const [offerSelectionMode, setOfferSelectionMode] = useState<SelectionMode>("products");
  const [selectedOfferProducts, setSelectedOfferProducts] = useState(["city", "annabel"]);
  const [selectedOfferCategories, setSelectedOfferCategories] = useState(["urban", "new"]);
  const [salePercent, setSalePercent] = useState("20");
  const [saleScope, setSaleScope] = useState<SaleScope>("all");
  const [variantColors, setVariantColors] = useState(["Коньяк", "Чёрный"]);
  const [variantSizes, setVariantSizes] = useState(["Мини", "Стандартный"]);
  const [selectedProducts, setSelectedProducts] = useState(["city", "annabel"]);
  const [notice, setNotice] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("WELCOME10");

  const selectedScopeText = useMemo(() => {
    if (saleScope === "all") return "Все товары магазина";
    if (saleScope === "selected") return `${selectedProducts.length} выбранных товара`;
    if (saleScope === "low-stock") return "Товары с остатком 5 шт. и меньше";
    return `Весь каталог · ${variantColors.join(", ")} · ${variantSizes.join(", ")}`;
  }, [saleScope, selectedProducts, variantColors, variantSizes]);

  const offerScopeText = useMemo(() => {
    if (offerScope === "all") return "Все товары";
    if (offerSelectionMode === "products") return `${selectedOfferProducts.length} выбранных товара`;
    return `${selectedOfferCategories.length} выбранные категории`;
  }, [offerScope, offerSelectionMode, selectedOfferProducts, selectedOfferCategories]);

  const openOffer = (kind: OfferKind) => {
    setOfferKind(kind);
    setView("offer-form");
    setNotice(null);
  };

  const saveAndReturn = (message: string, target: View = "home") => {
    setNotice(message);
    setView(target);
  };

  if (view === "offers") {
    return (
      <section className="sd-page uk-animation-fade">
        <DiscountHeader
          title="Предложения покупателям"
          text="Shopra отправит скидку автоматически в подходящий момент."
          onBack={() => setView("home")}
        />
        <div className="sd-offer-grid">
          {(Object.keys(offerContent) as OfferKind[]).map((kind) => {
            const item = offerContent[kind];
            const Icon = item.icon;
            return (
              <article className="sd-offer-card" key={kind}>
                <span className="sd-card-icon"><Icon size={21} /></span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
                <small>{item.stat}</small>
                <button type="button" onClick={() => openOffer(kind)}>
                  Настроить <ChevronRight size={15} />
                </button>
              </article>
            );
          })}
          <article className="sd-offer-card promo">
            <span className="sd-card-icon"><Tag size={21} /></span>
            <div>
              <h2>Промокод</h2>
              <p>Создайте код для рассылки, рекламы или постоянных покупателей.</p>
            </div>
            <small>Код покупатель вводит при оформлении</small>
            <button type="button" onClick={() => setView("promo")}>
              Создать код <ChevronRight size={15} />
            </button>
          </article>
        </div>
      </section>
    );
  }

  if (view === "offer-form") {
    const item = offerContent[offerKind];
    const Icon = item.icon;
    return (
      <section className="sd-page uk-animation-fade">
        <DiscountHeader title={item.title} text={item.text} onBack={() => setView("offers")} />
        <div className="sd-editor-grid">
          <div className="sd-form-card">
            <div className="sd-audience-note">
              <span><Icon size={19} /></span>
              <p><strong>Получатели определяются автоматически</strong><small>{item.stat}</small></p>
            </div>
            <div className="sd-form-row">
              <label><span>Размер скидки</span><div className="sd-suffix"><input value={offerPercent} onChange={(event) => setOfferPercent(event.target.value)} inputMode="numeric" /><b>%</b></div></label>
              <label><span>Когда отправить</span><select defaultValue={offerKind === "repeat" ? "7" : "48"}><option value="24">Через 24 часа</option><option value="48">Через 48 часов</option><option value="7">Через 7 дней</option></select></label>
            </div>
            <label className="sd-full-field"><span>На какие товары действует</span><select value={offerScope} onChange={(event) => setOfferScope(event.target.value as OfferScope)}><option value="all">На все товары</option><option value="selected">Выбрать товары или категории</option></select></label>
            {offerScope === "selected" && (
              <div className="sd-condition-box sd-offer-selection">
                <div className="sd-selection-tabs" role="tablist" aria-label="Способ выбора товаров">
                  <button type="button" className={offerSelectionMode === "products" ? "active" : ""} onClick={() => setOfferSelectionMode("products")}><Package size={15} /> Товары</button>
                  <button type="button" className={offerSelectionMode === "categories" ? "active" : ""} onClick={() => setOfferSelectionMode("categories")}><Tag size={15} /> Категории</button>
                </div>
                <div className="sd-product-tools"><label><Search size={16} /><input placeholder={offerSelectionMode === "products" ? "Найти товар…" : "Найти категорию…"} /></label><span>{offerSelectionMode === "products" ? selectedOfferProducts.length : selectedOfferCategories.length} выбрано</span></div>
                <div className="sd-product-list">
                  {(offerSelectionMode === "products" ? products : categories).map((item) => {
                    const selected = offerSelectionMode === "products" ? selectedOfferProducts : selectedOfferCategories;
                    const checked = selected.includes(item.id);
                    const toggle = () => {
                      if (offerSelectionMode === "products") setSelectedOfferProducts((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id]);
                      else setSelectedOfferCategories((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id]);
                    };
                    return <button type="button" onClick={toggle} key={item.id}><span className={checked ? "checked" : ""}>{checked && <Check size={13} />}</span><p><strong>{item.title}</strong><small>{item.meta}</small></p></button>;
                  })}
                </div>
                {offerSelectionMode === "categories" && <p className="sd-selection-note"><Sparkles size={14} /> Предложение будет действовать и на новые товары в выбранных категориях.</p>}
              </div>
            )}
            <label className="sd-full-field"><span>Срок действия предложения</span><select defaultValue="30"><option value="7">7 дней после отправки</option><option value="14">14 дней после отправки</option><option value="30">30 дней после отправки</option></select></label>
            <div className="sd-preview-message">
              <span><Sparkles size={18} /></span>
              <p><strong>Покупатель увидит понятное предложение</strong><small>Скидка {offerPercent || "0"}% применится автоматически — промокод не нужен.</small></p>
            </div>
          </div>
          <aside className="sd-summary-card">
            <p className="eyebrow">Итог</p>
            <h3>{item.title}</h3>
            <dl><div><dt>Скидка</dt><dd>{offerPercent || "0"}%</dd></div><div><dt>Товары</dt><dd>{offerScopeText}</dd></div><div><dt>Отправка</dt><dd>Автоматически</dd></div></dl>
            <button type="button" onClick={() => saveAndReturn("Предложение сохранено и будет отправляться автоматически", "offers")}>Сохранить предложение</button>
          </aside>
        </div>
      </section>
    );
  }

  if (view === "promo") {
    return (
      <section className="sd-page uk-animation-fade">
        <DiscountHeader title="Новый промокод" text="Создайте короткий код, которым можно поделиться с покупателями." onBack={() => setView("offers")} />
        <div className="sd-editor-grid">
          <div className="sd-form-card">
            <label className="sd-full-field"><span>Промокод</span><div className="sd-code-input"><input value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} /><button type="button" aria-label="Скопировать промокод"><Copy size={16} /></button></div><small>Только латинские буквы и цифры</small></label>
            <div className="sd-form-row">
              <label><span>Тип скидки</span><select defaultValue="percent"><option value="percent">Процент</option><option value="fixed">Фиксированная сумма</option><option value="shipping">Бесплатная доставка</option></select></label>
              <label><span>Размер скидки</span><div className="sd-suffix"><input defaultValue="10" inputMode="numeric" /><b>%</b></div></label>
            </div>
            <div className="sd-form-row"><label><span>Минимальная сумма заказа</span><div className="sd-suffix"><input defaultValue="1000" inputMode="numeric" /><b>₴</b></div></label><label><span>Использований на покупателя</span><select defaultValue="1"><option value="1">1 раз</option><option value="3">До 3 раз</option><option value="0">Без ограничения</option></select></label></div>
            <div className="sd-form-row"><label><span>Начало</span><input type="date" defaultValue="2026-08-01" /></label><label><span>Окончание</span><input type="date" defaultValue="2026-08-31" /></label></div>
          </div>
          <aside className="sd-summary-card promo-summary"><span><Tag size={22} /></span><p>Промокод</p><strong>{promoCode || "ВАШКОД"}</strong><small>10% на заказ от 1 000 ₴</small><button type="button" onClick={() => saveAndReturn(`Промокод ${promoCode || "ВАШКОД"} создан`)}>Создать промокод</button></aside>
        </div>
      </section>
    );
  }

  if (view === "sale") {
    return (
      <section className="sd-page uk-animation-fade">
        <DiscountHeader title="Новая распродажа" text="Сначала укажите скидку, затем выберите товары или точное условие." onBack={() => setView("home")} />
        <div className="sd-sale-layout">
          <div className="sd-sale-main">
            <section className="sd-form-card">
              <div className="sd-section-number"><span>1</span><div><h2>Условия распродажи</h2><p>Покупателю не понадобится промокод.</p></div></div>
              <div className="sd-form-row"><label><span>Размер скидки</span><div className="sd-suffix"><input value={salePercent} onChange={(event) => setSalePercent(event.target.value)} inputMode="numeric" /><b>%</b></div></label><label><span>Название для себя</span><input defaultValue="Летняя распродажа" /></label></div>
              <div className="sd-form-row"><label><span>Начало</span><input type="date" defaultValue="2026-08-01" /></label><label><span>Окончание</span><input type="date" defaultValue="2026-08-31" /></label></div>
            </section>

            <section className="sd-form-card">
              <div className="sd-section-number"><span>2</span><div><h2>Какие товары участвуют</h2><p>Можно выбрать обычный список или автоматическое условие.</p></div></div>
              <div className="sd-scope-grid">
                {scopeContent.map(({ id, title, text, icon: Icon }) => (
                  <button type="button" className={saleScope === id ? "active" : ""} onClick={() => setSaleScope(id)} key={id}>
                    <span><Icon size={18} /></span><p><strong>{title}</strong><small>{text}</small></p>{saleScope === id && <Check size={16} />}
                  </button>
                ))}
              </div>

              {saleScope === "selected" && (
                <div className="sd-condition-box">
                  <div className="sd-product-tools"><label><Search size={16} /><input placeholder="Найти товар…" /></label><select defaultValue="all"><option value="all">Все категории</option><option value="bags">Сумки</option><option value="backpacks">Рюкзаки</option></select></div>
                  <div className="sd-product-list">
                    {products.map((product) => {
                      const checked = selectedProducts.includes(product.id);
                      return <button type="button" onClick={() => setSelectedProducts((current) => checked ? current.filter((id) => id !== product.id) : [...current, product.id])} key={product.id}><span className={checked ? "checked" : ""}>{checked && <Check size={13} />}</span><p><strong>{product.title}</strong><small>{product.meta}</small></p></button>;
                    })}
                  </div>
                </div>
              )}

              {saleScope === "low-stock" && (
                <div className="sd-condition-box sd-low-stock">
                  <span><Clock size={20} /></span><div><strong>Добавлять товары автоматически</strong><small>Скидка включится, когда остаток станет равен или меньше указанного.</small></div><label><input defaultValue="5" inputMode="numeric" /><b>шт.</b></label>
                  <p><Check size={14} /> Сейчас условию соответствуют 7 товаров и 12 модификаций.</p>
                </div>
              )}

              {saleScope === "variant" && (
                <div className="sd-condition-box sd-variant-rule">
                  <div className="sd-catalog-scope"><span><Package size={19} /></span><p><strong>Все товары каталога</strong><small>Shopra найдёт совпадающие модификации во всех товарах.</small></p><em><Check size={13} /> Выбрано</em></div>
                  <div className="sd-variant-groups">
                    <div className="sd-values"><span>Цвет</span><div>{colorOptions.map((value) => { const checked = variantColors.includes(value); return <button type="button" className={checked ? "active" : ""} onClick={() => setVariantColors((current) => checked ? current.filter((item) => item !== value) : [...current, value])} key={value}>{checked && <Check size={12} />}{value}</button>; })}</div></div>
                    <div className="sd-values"><span>Размер</span><div>{sizeOptions.map((value) => { const checked = variantSizes.includes(value); return <button type="button" className={checked ? "active" : ""} onClick={() => setVariantSizes((current) => checked ? current.filter((item) => item !== value) : [...current, value])} key={value}>{checked && <Check size={12} />}{value}</button>; })}</div></div>
                  </div>
                  <div className="sd-match-logic"><span><Sparkles size={16} /></span><p><strong>Цвет и размер учитываются вместе</strong><small>Например, скидка сработает для всех чёрных товаров размера «Мини». Если одну группу оставить пустой, она не ограничивает выбор.</small></p></div>
                  <p className="sd-rule-note"><Check size={15} /> Сейчас правилу соответствуют 24 модификации в 9 товарах.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="sd-summary-card sd-sale-summary">
            <p className="eyebrow">Расположение скидки</p><h3>Летняя распродажа</h3><div className="sd-discount-big">−{salePercent || "0"}%</div>
            <dl><div><dt>Охват</dt><dd>{selectedScopeText}</dd></div><div><dt>Период</dt><dd>1–31 августа</dd></div><div><dt>Промокод</dt><dd>Не нужен</dd></div></dl>
            <div className="sd-summary-hint"><Sparkles size={15} /><span>Покупатель увидит старую цену, новую цену и размер скидки.</span></div>
            <button type="button" onClick={() => saveAndReturn("Распродажа создана и запланирована на 1 августа")}>Проверить и создать</button>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="sd-page uk-animation-fade">
      <DiscountHeader title="Скидки и распродажи" text="Помогайте покупателю решиться и освобождайте остатки без ручной смены цен." />
      {notice && <div className="sd-notice"><Check size={16} /><span>{notice}</span><button type="button" aria-label="Закрыть уведомление" onClick={() => setNotice(null)}><X size={15} /></button></div>}
      <div className="sd-overview-stats">
        <article><span><BadgePercent size={19} /></span><p><small>Активные скидки</small><strong>3</strong></p></article>
        <article><span><Users size={19} /></span><p><small>Предложений отправлено</small><strong>300</strong></p></article>
        <article><span><Percent size={19} /></span><p><small>Продажи со скидкой</small><strong>42 680 ₴</strong></p></article>
      </div>

      <div className="sd-section-title"><div><p className="eyebrow">Основные действия</p><h2>Что хотите настроить?</h2></div></div>
      <div className="sd-primary-grid">
        <button type="button" className="sd-primary-card" onClick={() => setView("offers")}>
          <span className="sd-card-icon"><Heart size={22} /></span><div><h3>Создать предложение</h3><p>Избранное, брошенная корзина, повторная покупка или промокод.</p></div><b>Настроить <ChevronRight size={16} /></b>
        </button>
        <button type="button" className="sd-primary-card featured" onClick={() => setView("sale")}>
          <span className="sd-card-icon"><BadgePercent size={22} /></span><div><h3>Создать распродажу</h3><p>Весь магазин, выбранные товары, малый остаток или конкретная модификация.</p></div><b>Создать <ChevronRight size={16} /></b>
        </button>
      </div>

      <div className="sd-section-title campaigns-title"><div><p className="eyebrow">Работают сейчас</p><h2>Ваши скидки</h2></div><button type="button" onClick={() => setView("promo")}><Tag size={15} /> Новый промокод</button></div>
      <div className="sd-campaign-list">
        <article><span className="sd-campaign-icon auto"><ShoppingCart size={18} /></span><p><strong>Брошенная корзина</strong><small>Автоматическое предложение · 15%</small></p><em>Активно</em><b>78 отправлено</b><button type="button" onClick={() => openOffer("cart")}>Изменить</button></article>
        <article><span className="sd-campaign-icon"><Heart size={18} /></span><p><strong>После добавления в избранное</strong><small>Автоматическое предложение · 10%</small></p><em>Активно</em><b>202 отправлено</b><button type="button" onClick={() => openOffer("favorite")}>Изменить</button></article>
        <article><span className="sd-campaign-icon sale"><BadgePercent size={18} /></span><p><strong>Летняя распродажа</strong><small>Выбранные товары · до 31 августа</small></p><em>Запланировано</em><b>−20%</b><button type="button" onClick={() => setView("sale")}>Открыть</button></article>
      </div>
    </section>
  );
}
