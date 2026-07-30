"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Facebook,
  GripVertical,
  Heart,
  Image as ImageIcon,
  Instagram,
  LayoutGrid,
  Menu,
  Monitor,
  Palette,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  ShoppingBag,
  Smartphone,
  Trash2,
  Type,
  Upload,
  UserRound,
  Video,
  X,
  Youtube,
} from "lucide-react";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

type Editor = "style" | "top" | "header" | "hero" | "showcase" | "text" | "banner" | "footer" | "add";
type Widget = { id: number; type: "showcase" | "text" | "banner" };
type HeaderLayout = "left" | "center";
type SearchSize = "icon" | "compact" | "medium" | "wide";
type MobileHeaderItem = "search" | "account" | "cart" | "menu";
type ShowcaseLayout = "grid" | "mixed" | "carousel";
type SocialRow = { id: number; network: string; url: string };
type StorePage = { id: number; title: string; text: string };
type GalleryEntry = { id: string; name: string; meta: string; tone: string };
type SlideEntry = { id: string; name: string; tone: string };

const mobileHeaderOptions: { id: MobileHeaderItem; label: string }[] = [
  { id: "search", label: "Поиск" },
  { id: "account", label: "Кабинет" },
  { id: "cart", label: "Корзина" },
  { id: "menu", label: "Меню" },
];

const fontPresets = [
  { id: "modern", name: "Современный", heading: "Manrope", body: "Inter" },
  { id: "editorial", name: "Редакционный", heading: "Playfair Display", body: "Inter" },
  { id: "minimal", name: "Минимализм", heading: "Montserrat", body: "Open Sans" },
  { id: "classic", name: "Классический", heading: "Cormorant", body: "Lato" },
  { id: "soft", name: "Мягкий", heading: "Nunito", body: "Inter" },
  { id: "geometric", name: "Геометричный", heading: "Poppins", body: "Source Sans" },
  { id: "elegant", name: "Элегантный", heading: "Baskerville", body: "Lato" },
  { id: "business", name: "Деловой", heading: "Merriweather", body: "Roboto" },
];

const editorNames: Record<Editor, string> = {
  style: "Цвета и стиль элементов",
  top: "Верхний баннер",
  header: "Шапка магазина",
  hero: "Главный баннер",
  showcase: "Витрина",
  text: "Заголовок и текст",
  banner: "Баннер",
  footer: "Нижняя часть сайта",
  add: "Добавить виджет",
};

const products = [
  ["Сумка Moss", "3 290 ₴", "green"],
  ["Рюкзак Bruno", "4 890 ₴", "brown"],
  ["Кошелёк Mini", "1 290 ₴", "wine"],
  ["Сумка Terra", "3 790 ₴", "sand"],
  ["Портмоне Slate", "1 690 ₴", "navy"],
  ["Клатч Ember", "2 490 ₴", "rust"],
  ["Ремень Atlas", "1 490 ₴", "stone"],
  ["Шопер Loft", "3 590 ₴", "olive"],
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="ae-field"><span>{label}</span>{children}</label>;
}

function Toggle() {
  return <span className="ae-toggle"><i /></span>;
}

function Edit({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" className="ae-edit" onClick={onClick}><Pencil size={12} />{children}</button>;
}

function MobileHeaderGlyph({ item, size = 17, className }: { item: MobileHeaderItem; size?: number; className?: string }) {
  if (item === "search") return <Search className={className} size={size} />;
  if (item === "account") return <UserRound className={className} size={size} />;
  if (item === "cart") return <ShoppingBag className={className} size={size} />;
  return <Menu className={className} size={size} />;
}

function EditorModal({
  editor,
  close,
  add,
  palette,
  setPalette,
  corners,
  setCorners,
  fontPreset,
  setFontPreset,
  headerLayout,
  setHeaderLayout,
  searchSize,
  setSearchSize,
  mobileHeaderItems,
  setMobileHeaderItems,
  showcaseLayout,
  setShowcaseLayout,
  showcaseEyebrow,
  setShowcaseEyebrow,
  showcaseTitle,
  setShowcaseTitle,
  showcaseLink,
  setShowcaseLink,
  bannerTextColor,
  setBannerTextColor,
  pages,
  setPages,
}: {
  editor: Editor;
  close: () => void;
  add: (type: Widget["type"]) => void;
  palette: string;
  setPalette: (value: string) => void;
  corners: string;
  setCorners: (value: string) => void;
  fontPreset: string;
  setFontPreset: (value: string) => void;
  headerLayout: HeaderLayout;
  setHeaderLayout: (value: HeaderLayout) => void;
  searchSize: SearchSize;
  setSearchSize: (value: SearchSize) => void;
  mobileHeaderItems: MobileHeaderItem[];
  setMobileHeaderItems: (value: MobileHeaderItem[] | ((items: MobileHeaderItem[]) => MobileHeaderItem[])) => void;
  showcaseLayout: ShowcaseLayout;
  setShowcaseLayout: (value: ShowcaseLayout) => void;
  showcaseEyebrow: string;
  setShowcaseEyebrow: (value: string) => void;
  showcaseTitle: string;
  setShowcaseTitle: (value: string) => void;
  showcaseLink: string;
  setShowcaseLink: (value: string) => void;
  bannerTextColor: string;
  setBannerTextColor: (value: string) => void;
  pages: StorePage[];
  setPages: (value: StorePage[] | ((items: StorePage[]) => StorePage[])) => void;
}) {
  const [socials, setSocials] = useState<SocialRow[]>([
    { id: 1, network: "Instagram", url: "instagram.com/atelier7" },
  ]);
  const [pageCreatorOpen, setPageCreatorOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageText, setPageText] = useState("");
  const [showcaseMode, setShowcaseMode] = useState<"products" | "categories">("products");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [draggedGalleryId, setDraggedGalleryId] = useState<string | null>(null);
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const [draggedPageId, setDraggedPageId] = useState<number | null>(null);
  const [draggedMobileItem, setDraggedMobileItem] = useState<MobileHeaderItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryEntry[]>(
    products.map(([name, price, tone], index) => ({ id: `product-${index}`, name, meta: price, tone })),
  );
  const [slides, setSlides] = useState<SlideEntry[]>([
    { id: "slide-1", name: "Летняя коллекция", tone: "s0" },
    { id: "slide-2", name: "Сумки для города", tone: "s1" },
    { id: "slide-3", name: "Ручная работа", tone: "s2" },
  ]);

  const closePageEditor = () => {
    setPageCreatorOpen(false);
    setEditingPageId(null);
    setPageTitle("");
    setPageText("");
  };

  const openNewPage = () => {
    setEditingPageId(null);
    setPageTitle("");
    setPageText("");
    setPageCreatorOpen(true);
  };

  const openPageEditor = (page: StorePage) => {
    setEditingPageId(page.id);
    setPageTitle(page.title);
    setPageText(page.text);
    setPageCreatorOpen(true);
  };

  const savePage = () => {
    if (!pageTitle.trim()) return;
    if (editingPageId === null) {
      setPages((items) => [...items, { id: Date.now(), title: pageTitle.trim(), text: pageText.trim() }]);
    } else {
      setPages((items) => items.map((item) => item.id === editingPageId ? { ...item, title: pageTitle.trim(), text: pageText.trim() } : item));
    }
    closePageEditor();
  };

  const deletePage = () => {
    if (editingPageId === null) return;
    setPages((items) => items.filter((item) => item.id !== editingPageId));
    closePageEditor();
  };

  const selectShowcaseMode = (mode: "products" | "categories") => {
    setShowcaseMode(mode);
    setGalleryItems(
      mode === "products"
        ? products.map(([name, price, tone], index) => ({ id: `product-${index}`, name, meta: price, tone }))
        : [
            { id: "category-1", name: "Сумки", meta: "24 товара", tone: "brown" },
            { id: "category-2", name: "Рюкзаки", meta: "12 товаров", tone: "green" },
            { id: "category-3", name: "Кошельки", meta: "18 товаров", tone: "wine" },
            { id: "category-4", name: "Аксессуары", meta: "31 товар", tone: "sand" },
          ],
    );
  };

  const reorderGallery = (targetId: string) => {
    if (!draggedGalleryId || draggedGalleryId === targetId) return;
    setGalleryItems((items) => {
      const from = items.findIndex((item) => item.id === draggedGalleryId);
      const to = items.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return items;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedGalleryId(null);
  };

  const reorderSlides = (targetId: string) => {
    if (!draggedSlideId || draggedSlideId === targetId) return;
    setSlides((items) => {
      const from = items.findIndex((item) => item.id === draggedSlideId);
      const to = items.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return items;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedSlideId(null);
  };

  const reorderPages = (targetId: number) => {
    if (draggedPageId === null || draggedPageId === targetId) return;
    setPages((items) => {
      const from = items.findIndex((item) => item.id === draggedPageId);
      const to = items.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return items;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedPageId(null);
  };

  const moveMobileHeaderItem = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= mobileHeaderItems.length) return;
    setMobileHeaderItems((items) => {
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reorderMobileHeaderItem = (targetItem: MobileHeaderItem) => {
    if (!draggedMobileItem || draggedMobileItem === targetItem) return;
    setMobileHeaderItems((items) => {
      const from = items.indexOf(draggedMobileItem);
      const to = items.indexOf(targetItem);
      if (from < 0 || to < 0) return items;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedMobileItem(null);
  };

  return (
    <div className="ae-backdrop" onClick={close}>
      <section className="ae-modal uk-animation-slide-top-small" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header><div><small>Внешний вид магазина</small><h2>{editorNames[editor]}</h2></div><button onClick={close}><X size={20} /></button></header>
        <div className="ae-modal-body">
          {editor === "style" && <>
            <section className="ae-settings">
              <h3>Цветовая гамма</h3><p>Применяется к кнопкам, ссылкам и акцентам магазина.</p>
              <div className="ae-palettes">
                {[
                  ["copper", "Тёплая кожа", "#22201e", "#b85a2b", "#f1e7dc"],
                  ["forest", "Лес", "#1d2921", "#58705d", "#e7ece7"],
                  ["navy", "Чернильный", "#172333", "#45627d", "#e5ebef"],
                  ["mono", "Графит", "#171717", "#686868", "#eeeeee"],
                ].map(([id, name, a, b, c]) => (
                  <button className={palette === id ? "active" : ""} onClick={() => setPalette(id)} key={id}>
                    <span><i style={{ background: a }} /><i style={{ background: b }} /><i style={{ background: c }} /></span>
                    <b>{name}</b>{palette === id && <Check size={15} />}
                  </button>
                ))}
              </div>
            </section>
            <section className="ae-settings">
              <h3>Форма элементов</h3><p>Единая форма для карточек, полей, баннеров и кнопок.</p>
              <div className="ae-shapes">
                <button className={corners === "round" ? "active" : ""} onClick={() => setCorners("round")}><i className="round" /><b>Скруглённые</b><small>Мягкий современный вид</small></button>
                <button className={corners === "straight" ? "active" : ""} onClick={() => setCorners("straight")}><i /><b>Прямые</b><small>Строгий редакционный вид</small></button>
              </div>
            </section>
            <section className="ae-settings">
              <h3>Стиль шрифтов</h3>
              <p>Каждый пресет сочетает выразительный шрифт заголовков с хорошо читаемым основным текстом.</p>
              <div className="ae-font-presets">
                {fontPresets.map((preset) => (
                  <button
                    type="button"
                    className={fontPreset === preset.id ? "active" : ""}
                    onClick={() => setFontPreset(preset.id)}
                    key={preset.id}
                  >
                    <span className={`font-sample font-${preset.id}`}>Aa</span>
                    <span><b>{preset.name}</b><small>{preset.heading} · {preset.body}</small></span>
                    {fontPreset === preset.id && <Check size={15} />}
                  </button>
                ))}
              </div>
            </section>
          </>}

          {editor === "top" && <>
            <div className="ae-switch"><div><b>Показывать верхний баннер</b><small>Тонкая строка над шапкой</small></div><Toggle /></div>
            <Field label="Текст"><input className="uk-input" defaultValue="Бесплатная доставка от 2 500 ₴" /></Field>
            <Field label="Ссылка"><input className="uk-input" defaultValue="/delivery" /></Field>
            <Field label="Цвет"><div className="ae-colors"><i /><i /><i /><button><Plus size={14} /></button></div></Field>
          </>}

          {editor === "header" && <>
            <section className="ae-settings">
              <h3>Расположение элементов</h3>
              <p>Выберите готовую структуру шапки — изменения сразу видны в магазине.</p>
              <div className="ae-header-layouts">
                {[
                  ["left", "Логотип слева", "logo-left"],
                  ["center", "Логотип по центру", "logo-center"],
                ].map(([id, label, preview]) => (
                  <button type="button" className={headerLayout === id ? "active" : ""} onClick={() => setHeaderLayout(id as HeaderLayout)} key={id}>
                    <i className={preview}><span /><span /><span /></i>
                    <b>{label}</b>
                    {headerLayout === id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </section>
            <section className="ae-settings"><h3>Логотип</h3><div className="ae-tabs"><button className="active">Надпись</button><button>Изображение</button></div>
              <Field label="Название магазина"><input className="uk-input" defaultValue="ATELIER No. 7" /></Field>
              <button className="ae-upload"><Upload size={19} /><span><b>Загрузить логотип</b><small>PNG или SVG, до 5 МБ</small></span></button>
            </section>
            <section className="ae-settings">
              <h3>Ширина поиска</h3>
              <p>Поиск не обязан занимать всю свободную ширину шапки.</p>
              <div className="ae-segmented-options">
                {[
                  ["icon", "Иконка"],
                  ["compact", "Компактный"],
                  ["medium", "Средний"],
                  ["wide", "Широкий"],
                ].map(([id, label]) => (
                  <button type="button" className={searchSize === id ? "active" : ""} onClick={() => setSearchSize(id as SearchSize)} key={id}>{label}</button>
                ))}
              </div>
            </section>
            <div className="ae-switch"><div><b>Показывать телефон</b><small>Справа от логотипа</small></div><Toggle /></div>
            <Field label="Номер телефона"><input className="uk-input" defaultValue="+380 67 123 45 67" /></Field>
            <section className="ae-settings">
              <h3>Мобильная шапка</h3>
              <p>Перетаскивайте иконки, меняйте порядок или удаляйте ненужные.</p>
              <div className="ae-mobile-icons ae-sortable-list">
                {mobileHeaderItems.map((item, index) => {
                  const label = mobileHeaderOptions.find((option) => option.id === item)?.label ?? item;
                  return (
                    <div
                      key={item}
                      draggable
                      className={draggedMobileItem === item ? "is-dragging" : ""}
                      onDragStart={() => setDraggedMobileItem(item)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => reorderMobileHeaderItem(item)}
                      onDragEnd={() => setDraggedMobileItem(null)}
                    >
                      <GripVertical className="ae-mobile-grip" size={16} />
                      <MobileHeaderGlyph item={item} size={17} />
                      <b>{label}</b>
                      <span className="ae-mobile-icon-actions">
                        <button type="button" aria-label={`Поднять ${label}`} disabled={index === 0} onClick={() => moveMobileHeaderItem(index, -1)}><ArrowUp size={14} /></button>
                        <button type="button" aria-label={`Опустить ${label}`} disabled={index === mobileHeaderItems.length - 1} onClick={() => moveMobileHeaderItem(index, 1)}><ArrowDown size={14} /></button>
                        <button type="button" aria-label={`Удалить ${label}`} onClick={() => setMobileHeaderItems((items) => items.filter((value) => value !== item))}><Trash2 size={14} /></button>
                      </span>
                    </div>
                  );
                })}
                {mobileHeaderItems.length === 0 && <small className="ae-mobile-empty">Все иконки скрыты</small>}
              </div>
              {mobileHeaderItems.length < mobileHeaderOptions.length && <div className="ae-mobile-icon-add"><small>Добавить иконку</small><span>{mobileHeaderOptions.filter((option) => !mobileHeaderItems.includes(option.id)).map((option) => <button type="button" key={option.id} onClick={() => setMobileHeaderItems((items) => [...items, option.id])}><Plus size={13} />{option.label}</button>)}</span></div>}
            </section>
            <section className="ae-settings"><h3>Меню магазина</h3><div className="ae-list">{["Каталог", "Новинки", "О нас", "Доставка и оплата"].map(x => <div key={x}><GripVertical size={15} /><span>{x}</span><button>•••</button></div>)}</div><button className="ae-addline"><Plus size={14} /> Добавить пункт</button></section>
          </>}

          {(editor === "hero" || editor === "banner") && <>
            <section className="ae-settings">
              <h3>Изображение или видео</h3>
              <div className="ae-tabs">
                <button type="button" className={mediaType === "image" ? "active" : ""} onClick={() => setMediaType("image")}><ImageIcon size={16} /> Изображение</button>
                <button type="button" className={mediaType === "video" ? "active" : ""} onClick={() => setMediaType("video")}><Video size={16} /> Видео</button>
              </div>
              <button type="button" className="ae-upload">
                {mediaType === "image" ? <ImageIcon size={19} /> : <Video size={19} />}
                <span>
                  <b>{mediaType === "image" ? "Загрузить изображение" : "Загрузить видео"}</b>
                  <small>{mediaType === "image" ? "JPG, PNG или WEBP, до 10 МБ" : "MP4 или WebM, до 50 МБ"}</small>
                </span>
                <Upload size={16} />
              </button>
              <div className="ae-order-note"><GripVertical size={14} /> Перетяните слайды, чтобы изменить порядок</div>
              <div className="ae-list ae-sortable-list">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    draggable
                    className={draggedSlideId === slide.id ? "is-dragging" : ""}
                    onDragStart={() => setDraggedSlideId(slide.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorderSlides(slide.id)}
                    onDragEnd={() => setDraggedSlideId(null)}
                  >
                    <button type="button" className="ae-drag-handle" aria-label="Перетащить слайд"><GripVertical size={15} /></button>
                    <i className={`slide ${slide.tone}`} />
                    <span>{slide.name}<small>{mediaType === "image" ? "Изображение" : "Видео"}</small></span>
                    <button type="button" aria-label="Удалить слайд" onClick={() => setSlides((items) => items.filter((item) => item.id !== slide.id))}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="ae-addline" onClick={() => setSlides((items) => [...items, { id: `slide-${Date.now()}`, name: mediaType === "image" ? "Новый баннер" : "Новый видеобаннер", tone: `s${items.length % 3}` }])}>
                <Plus size={14} /> Добавить слайд
              </button>
            </section>
            {editor === "banner" && (
              <section className="ae-settings">
                <h3>Цвет текста на баннере</h3>
                <p>Подберите контрастный цвет заголовка и описания под загруженное изображение.</p>
                <div className="ae-banner-text-colors">
                  {[
                    ["#ffffff", "Белый"],
                    ["#f4e7da", "Молочный"],
                    ["#241d19", "Тёмный"],
                    ["#b85a2b", "Акцентный"],
                  ].map(([id, label]) => (
                    <button type="button" className={bannerTextColor === id ? "active" : ""} onClick={() => setBannerTextColor(id)} key={id}>
                      <i style={{ background: id }} />
                      <span>{label}</span>
                      {bannerTextColor === id && <Check size={14} />}
                    </button>
                  ))}
                </div>
                <label className="ae-banner-custom-color">
                  <input type="color" value={bannerTextColor} onChange={(event) => setBannerTextColor(event.target.value)} />
                  <span><b>Свой цвет</b><small>{bannerTextColor.toUpperCase()}</small></span>
                </label>
              </section>
            )}
            <Field label="Заголовок"><input className="uk-input" defaultValue={editor === "hero" ? "Кожа, которая живёт вместе с вами" : "Город. Дорога. Свобода."} /></Field>
            <Field label="Текст"><textarea className="uk-textarea" rows={3} defaultValue="Сумки и аксессуары ручной работы для города и путешествий." /></Field>
            <div className="ae-two"><Field label="Текст кнопки"><input className="uk-input" defaultValue="Смотреть коллекцию" /></Field><Field label="Ссылка"><input className="uk-input" defaultValue="/catalog" /></Field></div>
            <button className="ae-addline"><Plus size={14} /> Добавить ещё кнопку</button>
          </>}

          {editor === "showcase" && <>
            <section className="ae-settings">
              <h3>Заголовки витрины</h3>
              <p>Тексты сразу обновляются в предпросмотре магазина.</p>
              <div className="ae-two">
                <Field label="Надзаголовок"><input className="uk-input" value={showcaseEyebrow} onChange={(event) => setShowcaseEyebrow(event.target.value)} /></Field>
                <Field label="Текст ссылки"><input className="uk-input" value={showcaseLink} onChange={(event) => setShowcaseLink(event.target.value)} /></Field>
              </div>
              <Field label="Основной заголовок"><input className="uk-input" value={showcaseTitle} onChange={(event) => setShowcaseTitle(event.target.value)} /></Field>
            </section>
            <section className="ae-settings">
              <h3>Что показать</h3>
              <div className="ae-choice">
                <button type="button" className={showcaseMode === "products" ? "active" : ""} onClick={() => selectShowcaseMode("products")}><ShoppingBag size={20} /><span><b>Товары</b><small>Выбрать отдельные товары</small></span>{showcaseMode === "products" && <Check size={15} />}</button>
                <button type="button" className={showcaseMode === "categories" ? "active" : ""} onClick={() => selectShowcaseMode("categories")}><LayoutGrid size={20} /><span><b>Категории</b><small>Показать разделы каталога</small></span>{showcaseMode === "categories" && <Check size={15} />}</button>
              </div>
            </section>
            <section className="ae-settings">
              <h3>{showcaseMode === "products" ? "Выбранные товары" : "Выбранные категории"}</h3>
              <p>Перетяните строки мышкой, чтобы изменить их порядок в витрине.</p>
              <label className="ae-search"><Search size={15} /><input placeholder={showcaseMode === "products" ? "Найти товар…" : "Найти категорию…"} /></label>
              <div className="ae-list ae-sortable-list">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    className={draggedGalleryId === item.id ? "is-dragging" : ""}
                    onDragStart={() => setDraggedGalleryId(item.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorderGallery(item.id)}
                    onDragEnd={() => setDraggedGalleryId(null)}
                  >
                    <button type="button" className="ae-drag-handle" aria-label="Перетащить"><GripVertical size={15} /></button>
                    <i className={`thumb ${item.tone}`} />
                    <span><b>{item.name}</b><small>{item.meta}</small></span>
                    <Check size={14} />
                  </div>
                ))}
              </div>
            </section>
            <section className="ae-settings">
              <h3>Расположение</h3>
              <p>Выбранный вариант сразу применяется к витрине.</p>
              <div className="ae-layouts">
                <button type="button" className={showcaseLayout === "grid" ? "active" : ""} onClick={() => setShowcaseLayout("grid")}><i className="grid4" />Сетка 4</button>
                <button type="button" className={showcaseLayout === "mixed" ? "active" : ""} onClick={() => setShowcaseLayout("mixed")}><i className="mixed" />Смешанная</button>
                <button type="button" className={showcaseLayout === "carousel" ? "active" : ""} onClick={() => setShowcaseLayout("carousel")}><i className="carousel" />Карусель</button>
              </div>
            </section>
          </>}

          {editor === "text" && <>
            <Field label="Надзаголовок"><input className="uk-input" defaultValue="Ручная работа" /></Field>
            <Field label="Заголовок"><input className="uk-input" defaultValue="Вещи, которые становятся только лучше со временем" /></Field>
            <Field label="Текст"><textarea className="uk-textarea" rows={5} defaultValue="Мы работаем с натуральной кожей и собираем каждое изделие вручную — спокойно, точно и с вниманием к деталям." /></Field>
            <div className="ae-two"><Field label="Текст кнопки"><input className="uk-input" defaultValue="О мастерской" /></Field><Field label="Ссылка"><input className="uk-input" defaultValue="/about" /></Field></div>
          </>}

          {editor === "footer" && <>
            <section className="ae-settings">
              <h3>Социальные сети</h3>
              <p>Добавьте только те сети, которыми пользуется магазин.</p>
              <div className="ae-social">
                {socials.map((social) => (
                  <div className="ae-social-row" key={social.id}>
                    <select
                      className="uk-select"
                      value={social.network}
                      onChange={(event) => setSocials((items) => items.map((item) => item.id === social.id ? { ...item, network: event.target.value } : item))}
                    >
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>YouTube</option>
                      <option>TikTok</option>
                      <option>Telegram</option>
                      <option>Pinterest</option>
                    </select>
                    <input
                      className="uk-input"
                      value={social.url}
                      placeholder="Ссылка на профиль"
                      onChange={(event) => setSocials((items) => items.map((item) => item.id === social.id ? { ...item, url: event.target.value } : item))}
                    />
                    <button type="button" aria-label="Удалить социальную сеть" onClick={() => setSocials((items) => items.filter((item) => item.id !== social.id))}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="ae-addline ae-add-social"
                onClick={() => setSocials((items) => [...items, { id: Date.now(), network: "Instagram", url: "" }])}
              >
                <Plus size={14} /> Добавить социальную сеть
              </button>
            </section>
            <section className="ae-settings">
              <h3>Страницы магазина</h3>
              <p>Нужные страницы создаются прямо здесь и сразу появляются внизу сайта.</p>
              <div className="ae-pages">
                {pages.map((page) => (
                  <button
                    type="button"
                    draggable
                    className={draggedPageId === page.id ? "is-dragging" : ""}
                    key={page.id}
                    onDragStart={() => setDraggedPageId(page.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorderPages(page.id)}
                    onDragEnd={() => setDraggedPageId(null)}
                    onClick={() => openPageEditor(page)}
                    aria-label={`Редактировать страницу ${page.title}`}
                  >
                    <i><Check size={12} /></i>
                    <span className="ae-page-copy"><b>{page.title}</b><small>{page.text ? "Страница создана" : "Добавьте текст страницы"}</small></span>
                    <span className="ae-page-actions"><Pencil size={13} /><GripVertical size={14} /></span>
                  </button>
                ))}
              </div>
              <button type="button" className="ae-addline ae-create-page" onClick={openNewPage}>
                <Plus size={14} /> Создать страницу
              </button>
            </section>
          </>}

          {editor === "add" && <div className="ae-widget-choice">
            <button onClick={() => add("showcase")}><LayoutGrid size={22} /><span><b>Витрина</b><small>Товары или категории в сетке</small></span><Plus size={17} /></button>
            <button onClick={() => add("text")}><Type size={22} /><span><b>Заголовок и текст</b><small>Текстовый блок с кнопкой</small></span><Plus size={17} /></button>
            <button onClick={() => add("banner")}><ImageIcon size={22} /><span><b>Баннер</b><small>Изображение или видео и кнопки</small></span><Plus size={17} /></button>
          </div>}
        </div>
        {editor !== "add" && <footer><button onClick={close}>Отмена</button><button className="primary" onClick={close}><Check size={15} /> Готово</button></footer>}
        {pageCreatorOpen && (
          <div className="ae-page-creator-backdrop" onClick={closePageEditor}>
            <section className="ae-page-creator" onClick={(event) => event.stopPropagation()}>
              <header>
                <div><small>{editingPageId === null ? "Новая страница" : "Страница магазина"}</small><h3>{editingPageId === null ? "Создать страницу магазина" : "Редактировать страницу"}</h3></div>
                <button type="button" onClick={closePageEditor} aria-label="Закрыть"><X size={18} /></button>
              </header>
              <div>
                <Field label="Название страницы">
                  <input className="uk-input" value={pageTitle} placeholder="Например, Гарантия" onChange={(event) => setPageTitle(event.target.value)} />
                </Field>
                <Field label="Текст страницы">
                  <textarea className="uk-textarea" rows={9} value={pageText} placeholder="Введите текст страницы…" onChange={(event) => setPageText(event.target.value)} />
                </Field>
                <small className="ae-page-hint">Заголовок и текст страницы сразу обновятся в нижней части сайта.</small>
              </div>
              <footer>
                {editingPageId !== null && <button type="button" className="danger" onClick={deletePage}><Trash2 size={14} /> Удалить страницу</button>}
                <button type="button" onClick={closePageEditor}>Отмена</button>
                <button type="button" className="primary" disabled={!pageTitle.trim()} onClick={savePage}>
                  {editingPageId === null ? <Plus size={15} /> : <Save size={15} />} {editingPageId === null ? "Создать страницу" : "Сохранить изменения"}
                </button>
              </footer>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

function WidgetBlock({ widget, index, edit, move, remove, bannerTextColor, showcaseLayout, showcaseEyebrow, showcaseTitle, showcaseLink }: { widget: Widget; index: number; edit: (e: Editor) => void; move: (i: number, d: number) => void; remove: (id: number) => void; bannerTextColor: string; showcaseLayout: ShowcaseLayout; showcaseEyebrow: string; showcaseTitle: string; showcaseLink: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const tools = (
    <div className="store-tools">
      <button type="button" className="store-tool-drag" title="Перетащить виджет" aria-label="Перетащить виджет"><GripVertical size={15} /></button>
      <button type="button" title="Поднять выше" aria-label="Поднять выше" onClick={() => move(index, -1)}><ArrowUp size={15} /></button>
      <button type="button" title="Опустить ниже" aria-label="Опустить ниже" onClick={() => move(index, 1)}><ArrowDown size={15} /></button>
      <button type="button" title="Настроить" aria-label="Настроить" onClick={() => edit(widget.type)}><Pencil size={14} /></button>
      <button type="button" title="Удалить" aria-label="Удалить" onClick={() => remove(widget.id)}><Trash2 size={15} /></button>
    </div>
  );
  if (widget.type === "showcase") {
    const visibleProducts = showcaseLayout === "grid"
      ? products.slice(0, 4)
      : showcaseLayout === "mixed"
        ? products.slice(0, 5)
        : products;
    const scrollCarousel = (direction: number) => {
      carouselRef.current?.scrollBy({
        left: direction * carouselRef.current.clientWidth * 0.82,
        behavior: "smooth",
      });
    };

    return (
      <section className={`store-widget store-showcase showcase-${showcaseLayout}`}>
        {tools}
        <header>
          <div><small>{showcaseEyebrow}</small><h3>{showcaseTitle}</h3></div>
          <a>{showcaseLink}</a>
        </header>
        <div className="showcase-products">
          {showcaseLayout === "carousel" && (
            <button type="button" className="carousel-arrow carousel-arrow-prev" aria-label="Предыдущие товары" onClick={() => scrollCarousel(-1)}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="product-grid" ref={carouselRef}>
            {visibleProducts.map(([name, price, tone]) => (
              <article key={name}>
                <div className={`product-photo ${tone}`}><ShoppingBag size={27} /><button aria-label={`Добавить ${name} в избранное`}><Heart size={14} /></button></div>
                <p>{name}</p>
                <b>{price}</b>
              </article>
            ))}
          </div>
          {showcaseLayout === "carousel" && (
            <button type="button" className="carousel-arrow carousel-arrow-next" aria-label="Следующие товары" onClick={() => scrollCarousel(1)}>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </section>
    );
  }
  if (widget.type === "text") return <section className="store-widget store-text">{tools}<small>Ручная работа</small><h3>Вещи, которые становятся только лучше со временем</h3><p>Мы работаем с натуральной кожей и собираем каждое изделие вручную — спокойно, точно и с вниманием к деталям.</p><button>Узнать о мастерской</button></section>;
  return <section className="store-widget store-banner" style={{ "--banner-text-color": bannerTextColor } as CSSProperties}>{tools}<div><small>Новая коллекция</small><h3>Город. Дорога. Свобода.</h3><p>Лаконичные формы для каждого дня.</p><button>Смотреть коллекцию</button></div><span><ShoppingBag size={52} /></span></section>;
}

export function AppearanceEditor() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [device, setDevice] = useState("desktop");
  const [palette, setPalette] = useState("copper");
  const [corners, setCorners] = useState("round");
  const [fontPreset, setFontPreset] = useState("editorial");
  const [headerLayout, setHeaderLayout] = useState<HeaderLayout>("left");
  const [searchSize, setSearchSize] = useState<SearchSize>("compact");
  const [mobileHeaderItems, setMobileHeaderItems] = useState<MobileHeaderItem[]>(["search", "account", "cart", "menu"]);
  const [showcaseLayout, setShowcaseLayout] = useState<ShowcaseLayout>("grid");
  const [showcaseEyebrow, setShowcaseEyebrow] = useState("Выбор покупателей");
  const [showcaseTitle, setShowcaseTitle] = useState("Популярные товары");
  const [showcaseLink, setShowcaseLink] = useState("Смотреть все");
  const [bannerTextColor, setBannerTextColor] = useState("#ffffff");
  const [footerPages, setFooterPages] = useState<StorePage[]>([
    { id: 1, title: "Доставка и оплата", text: "" },
    { id: 2, title: "Возврат и обмен", text: "" },
    { id: 3, title: "Договор оферты", text: "" },
    { id: 4, title: "О нас", text: "" },
    { id: 5, title: "Контакты", text: "" },
    { id: 6, title: "Конфиденциальность", text: "" },
  ]);
  const [saved, setSaved] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([{ id: 1, type: "showcase" }, { id: 2, type: "text" }, { id: 3, type: "banner" }]);

  const move = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= widgets.length) return;
    setWidgets((items) => { const copy = [...items]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy; });
  };
  const add = (type: Widget["type"]) => { setWidgets((items) => [...items, { id: Date.now(), type }]); setEditor(type); };

  return <section className="appearance-page uk-animation-fade">
    <header className="appearance-head"><div><p className="eyebrow">Магазин · Внешний вид</p><h1>Внешний вид магазина</h1><p>Настройте внешний вид и главную страницу прямо здесь — без переходов между разделами.</p></div><div>{saved && <span className="saved"><Check size={14} /> Сохранено</span>}<button className="view">Предпросмотр</button><button className="save" onClick={() => setSaved(true)}><Save size={15} /> Сохранить</button></div></header>

    <button className={`style-card theme-${palette}`} onClick={() => setEditor("style")}><span><Palette size={21} /></span><div><b>Цвета и стиль элементов</b><small>Палитра, шрифты и форма кнопок, карточек и полей</small></div><i /><i /><i /><strong>{fontPresets.find((preset) => preset.id === fontPreset)?.name} · {corners === "round" ? "Скруглённые" : "Прямые"}</strong><em><Pencil size={14} /> Настроить</em></button>

    <div className="appearance-workspace">
      <div className="appearance-toolbar"><span>Главная страница</span><div><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}><Monitor size={16} /></button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}><Smartphone size={16} /></button></div><small>Нажмите на блок, чтобы изменить</small></div>
      <div className="preview-stage">
        <div className={`store-preview ${device} theme-${palette} corners-${corners} font-${fontPreset}`}>
          <div className="store-top">Бесплатная доставка от 2 500 ₴<Edit onClick={() => setEditor("top")}>Изменить</Edit></div>
          <header className={`store-header header-layout-${headerLayout} search-${searchSize}`}><Edit onClick={() => setEditor("header")}>Настроить шапку</Edit><div className="header-row"><div className="store-logo"><small>ATELIER</small><b>No. 7</b></div><a><Phone size={13} /> +380 67 123 45 67</a>{searchSize !== "icon" && <label>Поиск товаров <Search size={14} /></label>}<span className="header-actions">{searchSize === "icon" && <Search className="desktop-action desktop-search-action" size={17} />}<Heart className="desktop-action" size={16} /><UserRound className="desktop-action" size={17} /><ShoppingBag className="desktop-action" size={17} />{mobileHeaderItems.map((item) => <MobileHeaderGlyph item={item} className="mobile-header-icon" size={18} key={item} />)}</span></div><nav>{["Каталог", "Новинки", "Сумки", "Рюкзаки", "Аксессуары", "О нас", "Доставка и оплата"].map(x => <a key={x}>{x}</a>)}</nav></header>
          <section className="store-hero"><Edit onClick={() => setEditor("hero")}>Настроить баннер</Edit><div><small>Новая коллекция · 2026</small><h2>Кожа, которая живёт вместе с вами</h2><p>Сумки и аксессуары ручной работы для города и путешествий.</p><span><button>Смотреть коллекцию</button><button>О мастерской</button></span></div><aside><i /><b /><ShoppingBag size={56} /></aside><em><i /><i /><i /></em></section>
          {widgets.map((widget, index) => <WidgetBlock key={widget.id} widget={widget} index={index} edit={setEditor} move={move} remove={(id) => setWidgets(x => x.filter(w => w.id !== id))} bannerTextColor={bannerTextColor} showcaseLayout={showcaseLayout} showcaseEyebrow={showcaseEyebrow} showcaseTitle={showcaseTitle} showcaseLink={showcaseLink} />)}
          <button className="add-widget" onClick={() => setEditor("add")}><Plus size={16} /> Добавить виджет</button>
          <footer className="store-footer"><Edit onClick={() => setEditor("footer")}>Настроить низ сайта</Edit><div><div className="store-logo"><small>ATELIER</small><b>No. 7</b></div><section><b>Страницы магазина</b>{footerPages.slice(0, 3).map((page) => <a key={page.id}>{page.title}</a>)}</section><section><b>Ещё</b>{footerPages.slice(3, 6).map((page) => <a key={page.id}>{page.title}</a>)}</section><section><b>Мы в соцсетях</b><span><Instagram size={15} /><Facebook size={15} /><Youtube size={16} /></span></section></div><p><span>© 2026 ATELIER No. 7</span><span>Магазин работает на Shopra</span></p></footer>
        </div>
      </div>
    </div>
    {editor && <EditorModal editor={editor} close={() => setEditor(null)} add={add} palette={palette} setPalette={setPalette} corners={corners} setCorners={setCorners} fontPreset={fontPreset} setFontPreset={setFontPreset} headerLayout={headerLayout} setHeaderLayout={setHeaderLayout} searchSize={searchSize} setSearchSize={setSearchSize} mobileHeaderItems={mobileHeaderItems} setMobileHeaderItems={setMobileHeaderItems} showcaseLayout={showcaseLayout} setShowcaseLayout={setShowcaseLayout} showcaseEyebrow={showcaseEyebrow} setShowcaseEyebrow={setShowcaseEyebrow} showcaseTitle={showcaseTitle} setShowcaseTitle={setShowcaseTitle} showcaseLink={showcaseLink} setShowcaseLink={setShowcaseLink} bannerTextColor={bannerTextColor} setBannerTextColor={setBannerTextColor} pages={footerPages} setPages={setFooterPages} />}
  </section>;
}
