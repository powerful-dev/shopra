"use client";

import {
  ArrowLeft,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  Eye,
  FileText,
  FolderTree,
  GripVertical,
  ImagePlus,
  Layers3,
  Link2,
  MoreHorizontal,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Rocket,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  UploadCloud,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Screen = "list" | "create" | "publishing" | "done";
type CategoryManagerMode = "manage" | "assign";
type StoreCategory = {
  id: string;
  name: string;
  count: number;
  parent?: string;
  selectable?: boolean;
  kind?: "folder" | "collection";
};

type CatalogueProduct = [
  name: string,
  category: string,
  stock: string,
  price: string,
  status: string,
  tone: string,
];

type VariantValue = {
  id: string;
  name: string;
  tone?: string;
};

type VariantOption = {
  id: string;
  name: string;
  values: VariantValue[];
};

type VariantOptionPreset = VariantOption & {
  description: string;
  preview: string;
};

const variantOptionPresets: VariantOptionPreset[] = [
  {
    id: "color",
    name: "Цвет",
    description: "Популярные цвета для кожаных рюкзаков",
    preview: "Коньяк, кофе, чёрный и ещё 7",
    values: [
      { id: "cognac", name: "Коньяк", tone: "cognac" },
      { id: "coffee", name: "Кофе", tone: "coffee" },
      { id: "black", name: "Чёрный", tone: "black" },
      { id: "dark-blue", name: "Тёмно-синий", tone: "navy" },
      { id: "green", name: "Зелёный", tone: "olive" },
      { id: "burgundy", name: "Бургунди", tone: "wine" },
      { id: "orange", name: "Оранжевый", tone: "orange" },
      { id: "gray", name: "Серый", tone: "gray" },
      { id: "red", name: "Красный", tone: "red" },
      { id: "ginger", name: "Рыжий", tone: "ginger" },
    ],
  },
  {
    id: "product-size",
    name: "Размер изделия",
    description: "Размерная сетка для сумок и рюкзаков",
    preview: "Мини, стандартный, большой",
    values: [
      { id: "mini", name: "Мини" },
      { id: "standard", name: "Стандартный" },
      { id: "large", name: "Большой" },
    ],
  },
  {
    id: "material",
    name: "Материал",
    description: "Материалы, подходящие для этой категории",
    preview: "Натуральная кожа, замша, текстиль",
    values: [
      { id: "leather", name: "Натуральная кожа" },
      { id: "suede", name: "Замша" },
      { id: "textile", name: "Текстиль" },
    ],
  },
  {
    id: "personalization",
    name: "Персонализация",
    description: "Готовые варианты персонализации",
    preview: "Без персонализации, инициалы, логотип",
    values: [
      { id: "none", name: "Без персонализации" },
      { id: "initials", name: "Инициалы" },
      { id: "logo", name: "Логотип" },
    ],
  },
];

const initialStoreCategories: StoreCategory[] = [
  { id: "backpacks", name: "Рюкзаки", count: 48, selectable: false },
  { id: "city", name: "Городские", count: 24, parent: "backpacks" },
  { id: "everyday", name: "Повседневные", count: 12, parent: "city" },
  { id: "laptop-backpacks", name: "Для ноутбука", count: 8, parent: "city" },
  { id: "mini", name: "Мини-рюкзаки", count: 15, parent: "backpacks" },
  { id: "hiking", name: "Туристические", count: 18, parent: "backpacks" },
  { id: "school", name: "Школьные", count: 10, parent: "backpacks" },
  { id: "bags", name: "Сумки", count: 67, selectable: false },
  { id: "crossbody", name: "Через плечо", count: 21, parent: "bags" },
  { id: "laptop", name: "Для ноутбука", count: 13, parent: "bags" },
  { id: "accessories", name: "Аксессуары", count: 31, selectable: false },
  { id: "new", name: "Новинки", count: 32, kind: "collection" },
  { id: "sale", name: "Распродажа", count: 18, kind: "collection" },
];

const catalogue: CatalogueProduct[] = [
  ["Кожаный рюкзак FOREST", "Рюкзаки", "12 шт.", "5 490 ₴", "Активен", "olive"],
  ["Сумка через плечо ALICE", "Сумки", "7 шт.", "3 850 ₴", "Активен", "cognac"],
  ["Мессенджер HUNTER", "Мессенджеры", "2 шт.", "4 690 ₴", "Заканчивается", "coffee"],
  ["Мини-рюкзак HANNA", "Рюкзаки", "5 шт.", "3 290 ₴", "Активен", "wine"],
  ["Сумка для ноутбука RALPH", "Для ноутбука", "0 шт.", "5 150 ₴", "Черновик", "navy"],
];

const editorSections = [
  ["main", "Основное", PackageCheck],
  ["media", "Фото", ImagePlus],
  ["price", "Цена и наличие", CircleDollarSign],
  ["variants", "Варианты", Layers3],
  ["description", "Описание", FileText],
  ["features", "Характеристики", Settings2],
  ["delivery", "Доставка", Truck],
  ["seo", "SEO", Link2],
] as const;

function ProductArt({ tone = "cognac", large = false }: { tone?: string; large?: boolean }) {
  return (
    <span className={`sp-art ${tone}${large ? " large" : ""}`} aria-hidden="true">
      <i><b /><em /></i>
    </span>
  );
}

function CategoryManager({
  mode,
  categories,
  selected,
  onSave,
  onAdd,
  onRename,
  onDelete,
  onReorder,
  onClose,
}: {
  mode: CategoryManagerMode;
  categories: StoreCategory[];
  selected: string[];
  onSave: (ids: string[]) => void;
  onAdd: (name: string, parent?: string) => string;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (sourceId: string, targetId: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [parent, setParent] = useState("");
  const [editing, setEditing] = useState("");
  const [editingName, setEditingName] = useState("");
  const [menuFor, setMenuFor] = useState("");
  const [expanded, setExpanded] = useState(["backpacks", "city"]);
  const [draftSelected, setDraftSelected] = useState(selected);
  const [structureSuggested, setStructureSuggested] = useState(false);
  const [dragging, setDragging] = useState("");

  const categoryById = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories],
  );
  const childrenByParent = useMemo(() => {
    const map = new Map<string, StoreCategory[]>();
    categories.forEach((item) => {
      const key = item.parent || "root";
      map.set(key, [...(map.get(key) || []), item]);
    });
    return map;
  }, [categories]);
  const categoryRows = useMemo(() => {
    const rows: { item: StoreCategory; depth: number }[] = [];
    const visit = (parentId: string, depth: number) => {
      (childrenByParent.get(parentId) || []).forEach((item) => {
        rows.push({ item, depth });
        visit(item.id, depth + 1);
      });
    };
    visit("root", 0);
    return rows;
  }, [childrenByParent]);
  const matchingIds = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;
    const ids = new Set<string>();
    categories.forEach((item) => {
      if (!item.name.toLowerCase().includes(normalized)) return;
      ids.add(item.id);
      let parentId = item.parent;
      while (parentId) {
        ids.add(parentId);
        parentId = categoryById.get(parentId)?.parent;
      }
    });
    return ids;
  }, [categories, categoryById, query]);
  const visibleRows = categoryRows.filter(({ item }) => {
    if (matchingIds) return matchingIds.has(item.id);
    let parentId = item.parent;
    while (parentId) {
      if (!expanded.includes(parentId)) return false;
      parentId = categoryById.get(parentId)?.parent;
    }
    return true;
  });
  const expandableIds = categories
    .filter((item) => (childrenByParent.get(item.id) || []).length > 0)
    .map((item) => item.id);
  const allExpanded = expandableIds.every((id) => expanded.includes(id));
  const isAssignment = mode === "assign";

  const categoryPath = (id: string) => {
    const names: string[] = [];
    let current = categoryById.get(id);
    while (current) {
      names.unshift(current.name);
      current = current.parent ? categoryById.get(current.parent) : undefined;
    }
    return names.join(" → ");
  };
  const categoryDepth = (id: string) => {
    let depth = 0;
    let current = categoryById.get(id);
    while (current?.parent) {
      depth += 1;
      current = categoryById.get(current.parent);
    }
    return depth;
  };
  const selectedItems = draftSelected
    .map((id) => categoryById.get(id))
    .filter((item): item is StoreCategory => Boolean(item));
  const toggleDraft = (id: string) => {
    if (!isAssignment) return;
    if (categoryById.get(id)?.selectable === false) return;
    setDraftSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };
  const deleteCategory = (id: string) => {
    const removed = new Set([id]);
    let added = true;
    while (added) {
      added = false;
      categories.forEach((item) => {
        if (item.parent && removed.has(item.parent) && !removed.has(item.id)) {
          removed.add(item.id);
          added = true;
        }
      });
    }
    setDraftSelected((current) => current.filter((item) => !removed.has(item)));
    setMenuFor("");
    onDelete(id);
  };

  return (
    <div className="sp-category-backdrop uk-animation-fade" role="presentation" onClick={onClose}>
      <section className="sp-category-manager uk-animation-slide-bottom-small" role="dialog" aria-modal="true" aria-label="Категории магазина" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">Навигация витрины</p>
            <h2>{isAssignment ? "Категории товара" : "Категории магазина"}</h2>
            <span>
              {isAssignment
                ? "Выберите разделы витрины, в которых будет показан этот товар."
                : "Создавайте разделы каталога, меняйте вложенность и порядок."}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть категории"><X size={19} /></button>
        </header>

        <div className="sp-category-toolbar">
          <label>
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск категорий…" aria-label="Поиск категорий" />
          </label>
          <button
            className={structureSuggested ? "suggested" : ""}
            type="button"
            aria-pressed={structureSuggested}
            onClick={() => {
              setExpanded(expandableIds);
              if (isAssignment) {
                setDraftSelected((current) => [...new Set([...current, "city", "new", "sale"])]);
              }
              setStructureSuggested(true);
              setQuery("");
            }}
          >
            {structureSuggested ? <Check size={15} /> : <Sparkles size={15} />}
            {structureSuggested ? "Структура предложена" : "Предложить структуру"}
          </button>
          <button className="primary" type="button" onClick={() => setAdding(true)}><Plus size={15} />Новая категория</button>
        </div>

        <div className="sp-category-explainer">
          <Sparkles size={17} />
          <p>
            <strong>
              {isAssignment
                ? "Товар уже определён как «Городской рюкзак»"
                : "Редактор структуры каталога"}
            </strong>
            <small>
              {isAssignment
                ? structureSuggested
                  ? "Shopra развернула подходящие разделы и добавила товар в рекомендуемые категории."
                  : "Здесь выбираются разделы вашего магазина, где покупатель увидит этот товар."
                : structureSuggested
                  ? "Shopra развернула всю структуру, чтобы её было удобнее проверить."
                  : "Здесь нет привязки товара: только создание, переименование, удаление и сортировка категорий."}
            </small>
          </p>
        </div>

        {adding && (
          <form
            className="sp-new-category"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newName.trim()) return;
              const newId = onAdd(newName.trim(), parent || undefined);
              if (isAssignment) setDraftSelected((current) => [...current, newId]);
              if (parent) setExpanded((current) => [...new Set([...current, parent])]);
              setNewName("");
              setParent("");
              setAdding(false);
            }}
          >
            <label><span>Название</span><input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Например, Подарки" /></label>
            <label>
              <span>Родительская категория</span>
              <select value={parent} onChange={(event) => setParent(event.target.value)}>
                <option value="">Без родительской</option>
                {categories
                  .filter((item) => item.kind !== "collection" && categoryDepth(item.id) < 2)
                  .map((item) => <option value={item.id} key={item.id}>{categoryPath(item.id)}</option>)}
              </select>
            </label>
            <div><button type="button" onClick={() => setAdding(false)}>Отмена</button><button type="submit">Добавить</button></div>
          </form>
        )}

        <div className="sp-category-workspace">
          <div className="sp-category-tree-panel">
            <div className="sp-category-list-head">
              <span>Структура каталога</span>
              <button
                type="button"
                onClick={() => setExpanded(allExpanded ? [] : expandableIds)}
              >
                {allExpanded ? "Свернуть все" : "Развернуть все"}
              </button>
            </div>
            <div className="sp-category-list" role="tree" aria-label="Структура каталога">
              {visibleRows.map(({ item, depth }) => {
                const hasChildren = (childrenByParent.get(item.id) || []).length > 0;
                const isExpanded = expanded.includes(item.id);
                const isSelected = isAssignment && draftSelected.includes(item.id);
                return (
                  <div
                    className={`sp-category-row depth-${Math.min(depth, 2)}${isSelected ? " selected" : ""}${dragging === item.id ? " dragging" : ""}`}
                    key={item.id}
                    role="treeitem"
                    aria-level={depth + 1}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-selected={isAssignment ? isSelected : undefined}
                    draggable
                    onDragStart={() => setDragging(item.id)}
                    onDragEnd={() => setDragging("")}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (dragging && dragging !== item.id) onReorder(dragging, item.id);
                      setDragging("");
                    }}
                  >
                    <span className="sp-category-grip" title="Перетащить"><GripVertical size={15} /></span>
                    {hasChildren ? (
                      <button
                        className="sp-category-expand"
                        type="button"
                        aria-label={`${isExpanded ? "Свернуть" : "Развернуть"} ${item.name}`}
                        onClick={() => setExpanded((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id]
                        )}
                      >
                        {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </button>
                    ) : <span className="sp-category-expand placeholder" />}
                    {!isAssignment || item.selectable === false ? (
                      <span className="sp-category-check placeholder" />
                    ) : (
                      <label className="sp-category-check">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleDraft(item.id)} />
                        <span />
                      </label>
                    )}
                    <span
                      className={`sp-category-kind ${
                        item.kind === "collection" ? "collection" : hasChildren ? "parent" : "leaf"
                      }`}
                      title={
                        item.kind === "collection"
                          ? "Подборка"
                          : hasChildren
                            ? "Категория с подразделами"
                            : "Конечная категория"
                      }
                    >
                      {item.kind === "collection"
                        ? <Tag size={15} />
                        : hasChildren
                          ? <FolderTree size={15} />
                          : <Package size={15} />}
                    </span>
                    {editing === item.id ? (
                      <input
                        className="sp-category-rename"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && editingName.trim()) {
                            onRename(item.id, editingName.trim());
                            setEditing("");
                          }
                          if (event.key === "Escape") setEditing("");
                        }}
                        onBlur={() => {
                          if (editingName.trim()) onRename(item.id, editingName.trim());
                          setEditing("");
                        }}
                        autoFocus
                      />
                    ) : <strong>{item.name}</strong>}
                    <small>{item.count}</small>
                    <button
                      className="sp-category-more"
                      type="button"
                      onClick={() => setMenuFor((current) => current === item.id ? "" : item.id)}
                      aria-label={`Действия с категорией ${item.name}`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuFor === item.id && (
                      <div className="sp-category-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(item.id);
                            setEditingName(item.name);
                            setMenuFor("");
                          }}
                        >
                          <Pencil size={13} />Переименовать
                        </button>
                        <button type="button" onClick={() => deleteCategory(item.id)}>
                          <Trash2 size={13} />Удалить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!visibleRows.length && (
                <div className="sp-category-empty">
                  <Search size={18} />
                  <strong>Категории не найдены</strong>
                  <small>Создайте новую категорию или измените запрос.</small>
                </div>
              )}
            </div>
          </div>

          <aside className="sp-category-guide">
            <div>
              <h3>Как это работает</h3>
              {isAssignment ? (
                <>
                  <p><CheckCircle2 size={18} /><span><strong>Выбирайте нужные разделы</strong><small>Товар может отображаться сразу в нескольких категориях.</small></span></p>
                  <p><Tag size={18} /><span><strong>Подборки работают отдельно</strong><small>«Новинки» и «Распродажа» можно включать одним кликом.</small></span></p>
                  <p><GripVertical size={18} /><span><strong>Структура остаётся общей</strong><small>Изменения дерева категорий видны для всего каталога.</small></span></p>
                </>
              ) : (
                <>
                  <p><FolderTree size={18} /><span><strong>Создавайте иерархию</strong><small>Родительские разделы и вложенные категории формируют меню витрины.</small></span></p>
                  <p><GripVertical size={18} /><span><strong>Меняйте порядок</strong><small>Перетаскивайте категории внутри одного уровня.</small></span></p>
                  <p><Pencil size={18} /><span><strong>Редактируйте без товаров</strong><small>В этом режиме вы управляете только структурой каталога.</small></span></p>
                </>
              )}
            </div>

            <section className="sp-category-placement">
              <strong>{isAssignment ? "Где появится товар" : "Как выглядит каталог"}</strong>
              <small>
                {isAssignment
                  ? "Покупатель увидит его в выбранных разделах:"
                  : "Предпросмотр навигации магазина после изменения структуры."}
              </small>
              {isAssignment && (
                <div className="sp-category-chips compact">
                  {selectedItems.map((item) => (
                    <button type="button" onClick={() => toggleDraft(item.id)} key={item.id}>
                      {categoryPath(item.id)}<X size={11} />
                    </button>
                  ))}
                  {!selectedItems.length && <em>Пока без категории — публикация доступна</em>}
                </div>
              )}

              <div className="sp-category-store-preview" aria-label="Предпросмотр категорий магазина">
                <header><span>▣</span><strong>Мой магазин</strong><Search size={12} /><Eye size={12} /></header>
                <nav>
                  <span>Рюкзаки</span><span>Сумки</span><span>Аксессуары</span><b>Новинки</b><b>Распродажа</b>
                </nav>
                <p>{isAssignment && selectedItems[0] ? categoryPath(selectedItems[0].id) : "Все товары"}</p>
                <div>
                  {["black", "gray", "navy"].map((tone, index) => (
                    <article key={tone}>
                      <ProductArt tone={tone} />
                      <i /><i />
                      <strong>{[2490, 2190, 2690][index].toLocaleString("uk-UA")} грн</strong>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer>
          {isAssignment ? (
            <div>
              <span>Выбрано <b>{draftSelected.length}</b> категории</span>
              <div className="sp-category-chips">
                {selectedItems.map((item) => (
                  <button type="button" onClick={() => toggleDraft(item.id)} key={item.id}>
                    {categoryPath(item.id)}<X size={11} />
                  </button>
                ))}
                {!selectedItems.length && <em>Можно оставить товар без категории</em>}
              </div>
            </div>
          ) : (
            <div className="sp-category-manage-summary">
              <span><b>{categories.length}</b> категорий в структуре</span>
              <small>Изменения структуры применяются ко всему каталогу.</small>
            </div>
          )}
          <div>
            {isAssignment && <button className="secondary" type="button" onClick={onClose}>Отмена</button>}
            <button
              type="button"
              onClick={() => {
                if (isAssignment) onSave(draftSelected);
                onClose();
              }}
            >
              Готово
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function CreateFromExistingDialog({
  onCreate,
  onClose,
}: {
  onCreate: (product: CatalogueProduct) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const matchingProducts = catalogue.filter((product) =>
    `${product[0]} ${product[1]}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selectedProduct = catalogue.find((product) => product[0] === selectedName);

  return (
    <div className="sp-copy-backdrop uk-animation-fade" role="presentation" onClick={onClose}>
      <section
        className="sp-copy-dialog uk-animation-slide-bottom-small"
        role="dialog"
        aria-modal="true"
        aria-label="Создать на основе существующего товара"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p className="eyebrow">Быстрый старт</p>
            <h2>Создать на основе существующего товара</h2>
            <span>Выберите похожий товар — Shopra перенесёт его настройки в новый черновик.</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть выбор товара"><X size={18} /></button>
        </header>

        <div className="sp-copy-workspace">
          <div className="sp-copy-products">
            <label>
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти похожий товар…"
                aria-label="Найти товар для основы"
              />
            </label>
            <div>
              {matchingProducts.map((product) => (
                <button
                  className={selectedName === product[0] ? "selected" : ""}
                  type="button"
                  onClick={() => setSelectedName(product[0])}
                  aria-pressed={selectedName === product[0]}
                  key={product[0]}
                >
                  <ProductArt tone={product[5]} />
                  <span>
                    <strong>{product[0]}</strong>
                    <small>{product[1]} · {product[3]}</small>
                  </span>
                  {selectedName === product[0] && <Check size={15} />}
                </button>
              ))}
              {!matchingProducts.length && <p>Подходящие товары не найдены</p>}
            </div>
          </div>

          <aside>
            {selectedProduct ? (
              <>
                <ProductArt tone={selectedProduct[5]} large />
                <p className="eyebrow">Основа нового товара</p>
                <h3>{selectedProduct[0]}</h3>
                <small>{selectedProduct[1]}</small>
                <div className="sp-copy-transfer">
                  <strong>Перенесём:</strong>
                  <span><Check size={12} />Описание и характеристики</span>
                  <span><Check size={12} />Фото и категории</span>
                  <span><Check size={12} />Варианты и цены</span>
                  <span><Check size={12} />Настройки доставки</span>
                </div>
                <p className="sp-copy-note">
                  Артикул, остатки и статус не переносятся. Исходный товар останется без изменений.
                </p>
              </>
            ) : (
              <div className="sp-copy-placeholder">
                <Copy size={25} />
                <strong>Выберите товар слева</strong>
                <small>Здесь появится список данных, которые будут перенесены.</small>
              </div>
            )}
          </aside>
        </div>

        <footer>
          <button className="secondary" type="button" onClick={onClose}>Отмена</button>
          <button
            type="button"
            disabled={!selectedProduct}
            onClick={() => {
              if (selectedProduct) onCreate(selectedProduct);
            }}
          >
            <Copy size={14} />
            Создать товар
          </button>
        </footer>
      </section>
    </div>
  );
}

function ProductsList({
  onCreate,
  onManageCategories,
}: {
  onCreate: (source?: CatalogueProduct) => void;
  onManageCategories: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все товары");
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const visible = useMemo(() => {
    return catalogue.filter((product) => {
      const q = query.toLowerCase();
      const queryMatch = `${product[0]} ${product[1]}`.toLowerCase().includes(q);
      const filterMatch =
        filter === "Все товары" ||
        (filter === "Активные" && product[4] === "Активен") ||
        (filter === "Черновики" && product[4] === "Черновик") ||
        (filter === "Мало на складе" && product[4] === "Заканчивается");
      return queryMatch && filterMatch;
    });
  }, [filter, query]);

  return (
    <section className="sp-page uk-animation-fade">
      <header className="sp-page-head">
        <div>
          <p className="eyebrow">Каталог магазина</p>
          <h1>Товары</h1>
          <p>Все товары, остатки и цены — в одном месте.</p>
        </div>
        <div className="sp-head-actions">
          <button className="sp-categories-button" type="button" onClick={onManageCategories}><FolderTree size={17} />Категории</button>
          <button className="sp-add uk-button" type="button" onClick={() => onCreate()}><Plus size={18} />Добавить товар</button>
        </div>
      </header>

      <div className="sp-stats">
        {[
          ["Все товары", "156", "В каталоге", Boxes],
          ["Активные", "142", "Видны покупателям", PackageCheck],
          ["Черновики", "6", "Ждут публикации", FileText],
          ["Мало на складе", "8", "Нужно проверить", Clock3],
        ].map(([label, value, note, Icon]) => (
          <button
            className={filter === label ? "active" : ""}
            type="button"
            onClick={() => setFilter(String(label))}
            key={String(label)}
          >
            <span><Icon size={18} /></span>
            <div><small>{String(label)}</small><strong>{String(value)}</strong><em>{String(note)}</em></div>
          </button>
        ))}
      </div>

      <div className="sp-catalogue">
        <div className="sp-toolbar">
          <label>
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти товар…"
              aria-label="Найти товар"
            />
          </label>
          <button type="button"><SlidersHorizontal size={16} />{filter}<ChevronDown size={14} /></button>
          <button className="sp-copy-existing" type="button" onClick={() => setCopyDialogOpen(true)}>
            <Copy size={15} />
            Создать на основе существующего товара
          </button>
        </div>
        <div className="sp-table-head">
          <span />
          <span>Товар</span><span>Категория</span><span>Остаток</span><span>Цена</span><span>Статус</span><span />
        </div>
        {visible.map((product, index) => (
          <div className="sp-product-row" key={product[0]}>
            <input type="checkbox" aria-label={`Выбрать ${product[0]}`} />
            <button className="sp-product-name" type="button">
              <ProductArt tone={product[5]} />
              <span><strong>{product[0]}</strong><small>SKU: SH-{String(index + 1).padStart(4, "0")}</small></span>
            </button>
            <span>{product[1]}</span>
            <span className={product[4] === "Заканчивается" ? "low" : ""}>{product[2]}</span>
            <strong>{product[3]}</strong>
            <span className={`sp-status ${product[4] === "Активен" ? "live" : product[4] === "Черновик" ? "draft" : "low"}`}>
              {product[4]}
            </span>
            <button className="sp-more" type="button" aria-label={`Действия ${product[0]}`}><MoreHorizontal size={17} /></button>
          </div>
        ))}
        {visible.length === 0 && <div className="sp-empty">Товары не найдены</div>}
        <footer className="sp-table-foot">
          <span>Показано {visible.length} из 156 товаров</span>
          <div><button disabled>Назад</button><button className="active">1</button><button>2</button><button>3</button><span>…</span><button>16</button><button>Далее</button></div>
        </footer>
      </div>
      {copyDialogOpen && (
        <CreateFromExistingDialog
          onCreate={(product) => {
            setCopyDialogOpen(false);
            onCreate(product);
          }}
          onClose={() => setCopyDialogOpen(false)}
        />
      )}
    </section>
  );
}

function EditorAccordion({
  id,
  label,
  optional = true,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  icon: typeof Layers3;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={open ? "sp-editor-section open" : "sp-editor-section"} id={`sp-section-${id}`}>
      <button className="sp-section-toggle" type="button" onClick={onToggle} aria-expanded={open}>
        <span className="sp-section-icon"><Icon size={17} /></span>
        <strong>{label}</strong>
        <em className={optional ? "optional" : "required"}>{optional ? "Необязательно" : "Обязательно"}</em>
        <ChevronDown size={17} />
      </button>
      {open && <div className="sp-section-body">{children}</div>}
    </section>
  );
}

function ProductCreator({
  screen,
  setScreen,
  categories,
  storeCategories,
  onToggleStoreCategory,
  onManageCategories,
  sourceProduct,
}: {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  categories: StoreCategory[];
  storeCategories: string[];
  onToggleStoreCategory: (id: string) => void;
  onManageCategories: () => void;
  sourceProduct?: CatalogueProduct;
}) {
  const [name, setName] = useState(sourceProduct ? `${sourceProduct[0]} — новый` : "Кожаный рюкзак CITY");
  const [category, setCategory] = useState("Рюкзаки и сумки → Рюкзаки → Городские рюкзаки");
  const [price, setPrice] = useState("6200");
  const [oldPrice, setOldPrice] = useState("7200");
  const [stock, setStock] = useState("12");
  const [variants, setVariants] = useState(true);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([
    {
      id: "color",
      name: "Цвет",
      values: variantOptionPresets[0].values.slice(0, 3).map((value) => ({ ...value })),
    },
  ]);
  const [presetPickerOpen, setPresetPickerOpen] = useState(false);
  const [valuePickerFor, setValuePickerFor] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customOptionName, setCustomOptionName] = useState("");
  const [customOptionValue, setCustomOptionValue] = useState("");
  const [pricesVary, setPricesVary] = useState(true);
  const [priceOption, setPriceOption] = useState("color");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [delivery, setDelivery] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState(0);
  const [defaultPhotoColor, setDefaultPhotoColor] = useState("cognac");
  const [photoPickerFor, setPhotoPickerFor] = useState("");
  const [variantPhotoAssignments, setVariantPhotoAssignments] = useState<Record<string, string[]>>({
    cognac: ["photo-1", "photo-2"],
    coffee: ["photo-3", "photo-4"],
    black: ["photo-5"],
  });
  const [draftSaved, setDraftSaved] = useState(true);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    variants: true,
    description: false,
    features: false,
    delivery: false,
    seo: false,
  });
  const [progress, setProgress] = useState(8);

  const suggested = name.toLowerCase().includes("рюкзак")
    ? "Рюкзаки и сумки → Рюкзаки → Городские рюкзаки"
    : "Рюкзаки и сумки → Сумки";

  const readiness = Math.min(
    100,
    (name.trim().length > 2 ? 10 : 0) +
      (category ? 10 : 0) +
      (Number(price) > 0 ? 10 : 0) +
      (Number(stock) >= 0 && stock !== "" ? 10 : 0) +
      (variants ? 10 : 0) +
      (description.trim().length > 20 ? 15 : 0) +
      (features.trim().length > 3 ? 10 : 0) +
      (delivery ? 10 : 0) +
      (seoTitle.trim().length > 3 ? 10 : 0) +
      (uploadedPhotos > 0 ? 5 : 0),
  );

  const toggleSection = (id: string) => {
    setOpenSections((current) => ({ ...current, [id]: !current[id] }));
  };

  const openAndScroll = (id: string) => {
    if (!["main", "media", "price"].includes(id)) {
      setOpenSections((current) => ({ ...current, [id]: true }));
    }
    window.setTimeout(() => {
      document.getElementById(`sp-section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  };

  const startPublishing = () => {
    setProgress(8);
    setScreen("publishing");
  };

  const addPresetOption = (preset: VariantOptionPreset) => {
    if (variantOptions.some((option) => option.id === preset.id)) return;
    setVariantOptions((current) => [
      ...current,
      {
        id: preset.id,
        name: preset.name,
        values: preset.values.map((value) => ({ ...value })),
      },
    ]);
    if (!variantOptions.length) setPriceOption(preset.id);
    setPresetPickerOpen(false);
  };

  const removeVariantOption = (id: string) => {
    const nextOptions = variantOptions.filter((option) => option.id !== id);
    setVariantOptions(nextOptions);
    if (priceOption === id || (priceOption === "combination" && nextOptions.length < 2)) {
      setPriceOption(nextOptions[0]?.id || "");
    }
    if (valuePickerFor === id) setValuePickerFor("");
  };

  const removeVariantValue = (optionId: string, valueId: string) => {
    setVariantOptions((current) =>
      current.map((option) =>
        option.id === optionId
          ? { ...option, values: option.values.filter((value) => value.id !== valueId) }
          : option,
      ),
    );
    if (optionId === "color") {
      setVariantPhotoAssignments((current) => {
        const next = { ...current };
        delete next[valueId];
        return next;
      });
      if (defaultPhotoColor === valueId) {
        const remainingColors =
          variantOptions.find((option) => option.id === "color")?.values.filter((value) => value.id !== valueId) || [];
        setDefaultPhotoColor(remainingColors[0]?.id || "");
      }
      if (photoPickerFor === valueId) setPhotoPickerFor("");
    }
  };

  const addVariantValue = (optionId: string, value: VariantValue) => {
    const optionBeforeAdd = variantOptions.find((option) => option.id === optionId);
    const isNewValue = !optionBeforeAdd?.values.some(
      (item) => item.name.toLowerCase() === value.name.toLowerCase(),
    );
    setVariantOptions((current) =>
      current.map((option) =>
        option.id === optionId && !option.values.some((item) => item.name.toLowerCase() === value.name.toLowerCase())
          ? { ...option, values: [...option.values, value] }
          : option,
      ),
    );
    if (optionId === "color" && isNewValue && !optionBeforeAdd?.values.length) {
      setDefaultPhotoColor(value.id);
    }
  };

  const productGallery = [
    { id: "photo-1", tone: "cognac", label: "Вид спереди" },
    { id: "photo-2", tone: "cognac", label: "Вид сбоку" },
    { id: "photo-3", tone: "coffee", label: "Вид спереди" },
    { id: "photo-4", tone: "coffee", label: "Детали" },
    { id: "photo-5", tone: "black", label: "Вид спереди" },
    ...Array.from({ length: uploadedPhotos }, (_, index) => ({
      id: `added-${index}`,
      tone: index % 3 === 0 ? "black" : index % 2 ? "coffee" : "cognac",
      label: `Загружено ${index + 1}`,
    })),
  ];

  const assignPhoto = (colorId: string, photoId: string) => {
    setVariantPhotoAssignments((current) => {
      const assigned = current[colorId] || [];
      if (assigned.includes(photoId)) return current;
      return { ...current, [colorId]: [...assigned, photoId] };
    });
  };

  const toggleAssignedPhoto = (colorId: string, photoId: string) => {
    setVariantPhotoAssignments((current) => {
      const assigned = current[colorId] || [];
      return {
        ...current,
        [colorId]: assigned.includes(photoId)
          ? assigned.filter((id) => id !== photoId)
          : [...assigned, photoId],
      };
    });
  };

  useEffect(() => {
    if (screen !== "publishing") return;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + (current < 75 ? 3 : 1));
        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setScreen("done"), 350);
        }
        return next;
      });
    }, 70);
    return () => window.clearInterval(timer);
  }, [screen, setScreen]);

  if (screen === "publishing" || screen === "done") {
    const done = screen === "done";
    const stage =
      progress < 25 ? "Проверяем карточку товара" :
        progress < 50 ? "Обрабатываем фотографии" :
          progress < 75 ? "Создаём страницу товара" :
            progress < 95 ? "Добавляем товар на витрину" : "Публикуем изменения";
    return (
      <section className="sp-publish uk-animation-fade">
        <button type="button" onClick={() => setScreen("list")}><ArrowLeft size={16} />К товарам</button>
        <div className={done ? "sp-console ready" : "sp-console"}>
          <span className="sp-launch-icon">{done ? <CheckCircle2 size={48} /> : <Rocket size={46} />}</span>
          <p className="eyebrow">{done ? "Готово к продаже" : "Запускаем товар"}</p>
          <h1>{done ? "Товар опубликован!" : "Почти готово…"}</h1>
          <p>{done ? "Карточка появилась на витрине. Покупатели уже могут её увидеть." : stage}</p>
          <div className="sp-publish-product">
            <ProductArt tone="cognac" />
            <span><strong>{name || "Новый товар"}</strong><small>{category || suggested}</small></span>
            <b>{price} ₴</b>
          </div>
          <div className="sp-game-load">
            <header><span>{done ? "Опубликовано" : stage}</span><strong>{done ? 100 : progress}%</strong></header>
            <div><i style={{ width: `${done ? 100 : progress}%` }} /></div>
            <small>{done ? "Все настройки сохранены" : "Можно не закрывать эту страницу"}</small>
          </div>
          {done && <footer><button onClick={() => setScreen("list")}>Все товары</button><button><Rocket size={15} />Посмотреть на витрине</button></footer>}
        </div>
      </section>
    );
  }

  const completeOptions = variantOptions.filter((option) => option.values.length > 0);
  const colorPhotoOption = completeOptions.find((option) => option.id === "color");
  const defaultColorValue = colorPhotoOption?.values.find((value) => value.id === defaultPhotoColor);
  const previewVariantPhotos = (variantPhotoAssignments[defaultPhotoColor] || [])
    .map((photoId) => productGallery.find((photo) => photo.id === photoId))
    .filter((photo): photo is (typeof productGallery)[number] => Boolean(photo));
  const previewPhotos = previewVariantPhotos.length ? previewVariantPhotos : productGallery;
  const valueCombinations = completeOptions.length
    ? completeOptions.reduce<VariantValue[][]>(
        (rows, option) =>
          rows.flatMap((row) => option.values.map((value) => [...row, value])),
        [[]],
      )
    : [];
  const priceOptionName =
    priceOption === "combination"
      ? "Вся комбинация"
      : variantOptions.find((option) => option.id === priceOption)?.name || "вариант";
  const selectedPriceOption =
    priceOption === "combination"
      ? undefined
      : completeOptions.find((option) => option.id === priceOption);
  const groupedPriceRows = selectedPriceOption
    ? selectedPriceOption.values.map((value, valueIndex) => ({
        tone: value.tone || "neutral",
        label: value.name,
        rowPrice: String(Number(price || 0) + valueIndex * 200),
        rowId: `${selectedPriceOption.id}-${value.id}`,
      }))
    : [];
  const showGroupedPrices = pricesVary && Boolean(selectedPriceOption);
  const combinationRows = valueCombinations.map((values, rowIndex) => {
    const selectedOptionIndex = completeOptions.findIndex((option) => option.id === priceOption);
    const selectedValueIndex =
      selectedOptionIndex >= 0
        ? completeOptions[selectedOptionIndex].values.findIndex(
            (value) => value.id === values[selectedOptionIndex]?.id,
          )
        : 0;
    const combinationDelta = values.reduce((sum, value, optionIndex) => {
      const valueIndex = completeOptions[optionIndex].values.findIndex((item) => item.id === value.id);
      return sum + Math.max(0, valueIndex) * (optionIndex + 1) * 100;
    }, 0);
    const rowPrice = !pricesVary
      ? Number(price || 0)
      : Number(price || 0) +
        (priceOption === "combination" ? combinationDelta : Math.max(0, selectedValueIndex) * 200);
    const rowId = values.map((value) => value.id).join("-");

    return {
      tone: values.find((value) => value.tone)?.tone || "neutral",
      label: values.map((value) => value.name).join(" · "),
      rowPrice: String(rowPrice),
      rowStock: String(Math.max(1, 6 - rowIndex)),
      sku: `CITY-${rowId
        .split("-")
        .map((part) => part.slice(0, 3).toUpperCase())
        .join("-")}`,
      rowId,
    };
  });

  return (
    <section className="sp-editor uk-animation-fade">
      <header className="sp-editor-head">
        <div className="sp-editor-title">
          <button type="button" onClick={() => setScreen("list")} aria-label="Вернуться к товарам">
            <ArrowLeft size={17} />
          </button>
          <div>
            <p className="eyebrow">Карточка товара</p>
            <h1>Новый товар</h1>
          </div>
        </div>
        <div className="sp-editor-actions">
          <button
            type="button"
            className={draftSaved ? "saved" : ""}
            onClick={() => {
              setDraftSaved(true);
              window.setTimeout(() => setDraftSaved(false), 1800);
            }}
          >
            {draftSaved ? <Check size={15} /> : <Save size={15} />}
            <span>{draftSaved ? "Черновик сохранён" : "Сохранить черновик"}</span>
          </button>
          <button
            className="sp-editor-more"
            type="button"
            onClick={() => setActionsMenuOpen((current) => !current)}
            aria-expanded={actionsMenuOpen}
            aria-label="Другие действия с товаром"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      <nav className="sp-editor-nav" aria-label="Разделы товара">
        {editorSections.map(([id, label, Icon], index) => (
          <button className={index === 0 ? "active" : ""} type="button" onClick={() => openAndScroll(id)} key={id}>
            <span><Icon size={14} /></span>{label}
          </button>
        ))}
      </nav>

      <section className="sp-editor-control">
        <div className="sp-readiness-ring" style={{ "--readiness": `${readiness * 3.6}deg` } as CSSProperties}>
          <span>{readiness}%</span>
        </div>
        <div className="sp-editor-control-copy">
          <strong>{readiness >= 40 ? "Уже можно продавать" : "Добавьте основные данные"}</strong>
          <small>Заполните ещё {Math.max(0, 5 - Math.floor(readiness / 20))} раздела</small>
        </div>
        <div className="sp-editor-control-actions">
          <button className="publish" type="button" onClick={startPublishing}><Rocket size={15} />Опубликовать</button>
          <button type="button" onClick={() => openAndScroll("preview")}><Eye size={15} />Предпросмотр</button>
          <button
            className="more"
            type="button"
            onClick={() => setActionsMenuOpen((current) => !current)}
            aria-expanded={actionsMenuOpen}
            aria-label="Открыть меню действий"
          >
            {actionsMenuOpen ? <ChevronDown size={17} /> : <MoreHorizontal size={18} />}
          </button>
        </div>
        {actionsMenuOpen && (
          <div className="sp-editor-action-menu">
            <button type="button" onClick={() => setScreen("list")}><Clock3 size={15} />Опубликовать позже</button>
            <button type="button"><Clock3 size={15} />История публикаций</button>
            <button type="button" onClick={() => setScreen("list")}><Copy size={15} />Создать на основе другого товара</button>
            <button className="danger" type="button" onClick={() => setScreen("list")}><Trash2 size={15} />Удалить товар</button>
          </div>
        )}
      </section>

      <div className="sp-editor-grid">
        <main className="sp-editor-main">
          {sourceProduct && (
            <section className="sp-copy-source-note">
              <span><Copy size={17} /></span>
              <p>
                <strong>Создано на основе «{sourceProduct[0]}»</strong>
                <small>Фото, описание, категории и варианты перенесены. Артикул, остатки и статус нужно задать заново.</small>
              </p>
              <button type="button" onClick={() => setScreen("list")}>Выбрать другой товар</button>
            </section>
          )}
          <section className="sp-editor-card" id="sp-section-main">
            <header><h2>Основное</h2><em>Обязательно</em></header>
            <div className="sp-editor-card-body">
              <label className="sp-field">
                <span>Название товара <b>*</b></span>
                <input value={name} onChange={(event) => { setName(event.target.value); setDraftSaved(false); }} />
              </label>
              <div className="sp-category-block">
                <div className="sp-category-label">
                  <span>Категория Shopra</span>
                  <em>Подобрана автоматически</em>
                </div>
                <button className="sp-system-category" type="button" onClick={() => setCategoryPickerOpen(!categoryPickerOpen)}>
                  <span><Sparkles size={16} /></span>
                  <p><strong>{category.split(" → ").at(-1)}</strong><small>{category}</small></p>
                  <b>Изменить</b>
                </button>
                {categoryPickerOpen && (
                  <div className="sp-system-suggestions">
                    <header><strong>Выберите наиболее точную категорию</strong><small>Она помогает Shopra предложить подходящие характеристики.</small></header>
                    {[
                      "Рюкзаки и сумки → Рюкзаки → Городские рюкзаки",
                      "Рюкзаки и сумки → Рюкзаки → Повседневные рюкзаки",
                      "Рюкзаки и сумки → Рюкзаки → Туристические рюкзаки",
                      "Рюкзаки и сумки → Сумки для ноутбука",
                    ].map((item) => (
                      <button
                        className={category === item ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setCategory(item);
                          setCategoryPickerOpen(false);
                        }}
                        key={item}
                      >
                        <span>{item.split(" → ").at(-1)}</span><small>{item}</small>{category === item && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="sp-auto-hint">
                  <Sparkles size={16} />
                  <p><strong>Shopra выбрала категорию по названию товара</strong><small>Никакого опроса: принять вариант можно одним кликом.</small></p>
                </div>
              </div>

              <div className="sp-store-categories">
                <div className="sp-category-label">
                  <span>Категории магазина</span>
                  <button type="button" onClick={onManageCategories}><FolderTree size={14} />Управление категориями</button>
                </div>
                <p>Эти разделы покупатель увидит в каталоге вашего магазина.</p>
                <div>
                  {categories.filter((item) => storeCategories.includes(item.id)).map((item) => (
                    <button type="button" onClick={() => onToggleStoreCategory(item.id)} key={item.id}>{item.name}<X size={12} /></button>
                  ))}
                  <button className="add" type="button" onClick={onManageCategories}><Plus size={12} />Добавить</button>
                </div>
              </div>
            </div>
          </section>

          <section className="sp-editor-card" id="sp-section-media">
            <header><h2>Фото и видео</h2><em>Обязательно</em></header>
            <div className="sp-editor-card-body">
              <div className="sp-media-grid">
                {productGallery.map((photo, index) => (
                  <button
                    className={photo.id.startsWith("added-") ? "sp-media-thumb added" : "sp-media-thumb"}
                    type="button"
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/shopra-photo", photo.id)}
                    key={photo.id}
                    aria-label={`Фото товара ${index + 1}: ${photo.label}`}
                  >
                    <ProductArt tone={photo.tone} large />
                    {index === 0 && <span>Главное</span>}
                    {photo.id.startsWith("added-") && <Check size={14} />}
                  </button>
                ))}
                <label className="sp-media-upload">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setUploadedPhotos((current) => Math.min(6, current + (event.target.files?.length || 0)))}
                  />
                  <UploadCloud size={22} />
                  <strong>Добавить</strong>
                  <small>фото или видео</small>
                </label>
              </div>
              <p className="sp-media-note">Перетащите фото, чтобы изменить порядок. Можно добавить ещё {Math.max(0, 15 - uploadedPhotos)} фото и 2 видео.</p>
            </div>
          </section>

          <section className="sp-editor-card" id="sp-section-price">
            <header><h2>Цена и наличие</h2><em>Обязательно</em></header>
            <div className="sp-editor-card-body sp-price-grid">
              <label className="sp-field">
                <span>Цена <b>*</b></span>
                <div className="sp-money"><input value={price} onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))} /><b>грн</b></div>
              </label>
              <label className="sp-field">
                <span>Старая цена</span>
                <div className="sp-money"><input value={oldPrice} onChange={(event) => setOldPrice(event.target.value.replace(/\D/g, ""))} /><b>грн</b></div>
              </label>
              <label className="sp-field">
                <span>Количество <b>*</b></span>
                <div className="sp-money"><input value={stock} onChange={(event) => setStock(event.target.value.replace(/\D/g, ""))} /><b>шт</b></div>
              </label>
              <label className="sp-stock-check">
                <input type="checkbox" defaultChecked />
                Показывать остаток на витрине
              </label>
            </div>
          </section>

          <EditorAccordion id="variants" label="Варианты" icon={Layers3} open={openSections.variants} onToggle={() => toggleSection("variants")}>
            <button className={variants ? "sp-switch active" : "sp-switch"} type="button" onClick={() => setVariants(!variants)}>
              <p><strong>У товара есть варианты</strong><small>Например: цвет, размер или материал</small></p><i><b /></i>
            </button>
            {variants && (
              <div className="sp-variant-builder">
                <div className="sp-variant-heading">
                  <div>
                    <strong>Опции товара</strong>
                    <small>Shopra предлагает готовые варианты по категории товара.</small>
                  </div>
                  <button type="button" onClick={() => setPresetPickerOpen(!presetPickerOpen)}>
                    <Plus size={13} />Добавить опцию
                  </button>
                </div>

                {presetPickerOpen && (
                  <div className="sp-variant-presets" role="dialog" aria-label="Готовые опции товара">
                    <header>
                      <div>
                        <span><Sparkles size={15} /></span>
                        <p>
                          <strong>Для категории «Городские рюкзаки»</strong>
                          <small>Добавьте только то, что действительно нужно этому товару.</small>
                        </p>
                      </div>
                      <button type="button" onClick={() => setPresetPickerOpen(false)} aria-label="Закрыть готовые опции">
                        <X size={15} />
                      </button>
                    </header>
                    <div className="sp-preset-grid">
                      {variantOptionPresets.map((preset) => {
                        const added = variantOptions.some((option) => option.id === preset.id);
                        return (
                          <button
                            className={added ? "added" : ""}
                            type="button"
                            disabled={added}
                            onClick={() => addPresetOption(preset)}
                            key={preset.id}
                          >
                            <span>{added ? <Check size={14} /> : <Plus size={14} />}</span>
                            <p><strong>{preset.name}</strong><small>{preset.description}</small></p>
                            <em>{added ? "Добавлено" : preset.preview}</em>
                          </button>
                        );
                      })}
                    </div>
                    <form
                      className="sp-custom-option"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!customOptionName.trim() || !customOptionValue.trim()) return;
                        const customId = `custom-${Date.now()}`;
                        setVariantOptions((current) => [
                          ...current,
                          {
                            id: customId,
                            name: customOptionName.trim(),
                            values: [
                              {
                                id: `${customId}-value`,
                                name: customOptionValue.trim(),
                              },
                            ],
                          },
                        ]);
                        if (!variantOptions.length) setPriceOption(customId);
                        setCustomOptionName("");
                        setCustomOptionValue("");
                        setPresetPickerOpen(false);
                      }}
                    >
                      <div>
                        <strong>Нет нужной опции?</strong>
                        <small>Создайте свою — она сохранится только в этом товаре.</small>
                      </div>
                      <input
                        value={customOptionName}
                        onChange={(event) => setCustomOptionName(event.target.value)}
                        placeholder="Например, Фурнитура"
                        aria-label="Название своей опции"
                      />
                      <input
                        value={customOptionValue}
                        onChange={(event) => setCustomOptionValue(event.target.value)}
                        placeholder="Первое значение"
                        aria-label="Первое значение своей опции"
                      />
                      <button type="submit"><Plus size={13} />Создать</button>
                    </form>
                  </div>
                )}

                {variantOptions.map((option, optionIndex) => {
                  const preset = variantOptionPresets.find((item) => item.id === option.id);
                  const availableValues =
                    preset?.values.filter(
                      (value) => !option.values.some((selected) => selected.id === value.id),
                    ) || [];

                  return (
                    <div className="sp-option-block" key={option.id}>
                      <div className="sp-option-card">
                        <span><GripVertical size={15} /></span>
                        <div><small>Опция {optionIndex + 1}</small><strong>{option.name}</strong></div>
                        <div className="sp-option-values">
                          {option.values.map((value) => (
                            <button
                              type="button"
                              onClick={() => removeVariantValue(option.id, value.id)}
                              key={value.id}
                            >
                              {option.id === "color" && <i className={value.tone || "neutral"} />}
                              {value.name}<X size={11} />
                            </button>
                          ))}
                          <button
                            className="add"
                            type="button"
                            onClick={() => {
                              setValuePickerFor(valuePickerFor === option.id ? "" : option.id);
                              setCustomValue("");
                            }}
                          >
                            <Plus size={11} />Добавить значение
                          </button>
                        </div>
                        <button type="button" onClick={() => removeVariantOption(option.id)} aria-label={`Удалить опцию ${option.name}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {valuePickerFor === option.id && (
                        <div className="sp-value-picker" role="dialog" aria-label={`Значения для опции ${option.name}`}>
                          <header>
                            <div>
                              <strong>Добавить значение в «{option.name}»</strong>
                              <small>{availableValues.length ? "Выберите из готового списка или добавьте своё." : "Добавьте собственное значение."}</small>
                            </div>
                            <button type="button" onClick={() => setValuePickerFor("")} aria-label="Закрыть значения"><X size={14} /></button>
                          </header>
                          {availableValues.length > 0 && (
                            <div className="sp-value-suggestions">
                              {availableValues.map((value) => (
                                <button
                                  type="button"
                                  onClick={() => addVariantValue(option.id, { ...value })}
                                  key={value.id}
                                >
                                  {option.id === "color" && <i className={value.tone || "neutral"} />}
                                  <Plus size={11} />{value.name}
                                </button>
                              ))}
                            </div>
                          )}
                          <form
                            onSubmit={(event) => {
                              event.preventDefault();
                              if (!customValue.trim()) return;
                              addVariantValue(option.id, {
                                id: `custom-${option.id}-${Date.now()}`,
                                name: customValue.trim(),
                                tone: option.id === "color" ? "neutral" : undefined,
                              });
                              setCustomValue("");
                            }}
                          >
                            <input
                              value={customValue}
                              onChange={(event) => setCustomValue(event.target.value)}
                              placeholder={`Своё значение для «${option.name}»`}
                              aria-label={`Своё значение для ${option.name}`}
                            />
                            <button type="submit"><Plus size={12} />Добавить</button>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}

                <section className="sp-variant-photos">
                  <header>
                    <div>
                      <span><ImagePlus size={17} /></span>
                      <p>
                        <strong>Фото вариантов</strong>
                        <small>Покупатель увидит фотографии выбранного цвета, а не одну картинку на все варианты.</small>
                      </p>
                    </div>
                    <label className={!colorPhotoOption ? "disabled" : ""}>
                      <span>Фото меняются по</span>
                      <select value={colorPhotoOption ? "color" : ""} onChange={() => undefined} disabled={!colorPhotoOption} aria-label="Опция для фотографий">
                        <option value="">{colorPhotoOption ? "Выберите опцию" : "Добавьте цвет"}</option>
                        {colorPhotoOption && <option value="color">Цвет</option>}
                      </select>
                    </label>
                  </header>

                  {colorPhotoOption ? (
                    <>
                      <div className="sp-shared-photo-gallery">
                        <div>
                          <strong>Общая галерея товара</strong>
                          <small>Загрузите фото один раз. Перетащите их к цвету или нажмите «Добавить фото».</small>
                        </div>
                        <div>
                          {productGallery.map((photo, index) => (
                            <button
                              type="button"
                              draggable
                              onDragStart={(event) => event.dataTransfer.setData("text/shopra-photo", photo.id)}
                              aria-label={`Перетащить фото ${index + 1}`}
                              key={`shared-${photo.id}`}
                            >
                              <ProductArt tone={photo.tone} large />
                              <b>{index + 1}</b>
                              <GripVertical size={12} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sp-color-photo-list">
                        {colorPhotoOption.values.map((value) => {
                          const assignedIds = variantPhotoAssignments[value.id] || [];
                          const assignedPhotos = assignedIds
                            .map((photoId) => productGallery.find((photo) => photo.id === photoId))
                            .filter((photo): photo is (typeof productGallery)[number] => Boolean(photo));
                          const isDefault = defaultPhotoColor === value.id;

                          return (
                            <article
                              className={isDefault ? "sp-color-photo-row is-default" : "sp-color-photo-row"}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => {
                                event.preventDefault();
                                const photoId = event.dataTransfer.getData("text/shopra-photo");
                                if (productGallery.some((photo) => photo.id === photoId)) assignPhoto(value.id, photoId);
                              }}
                              key={`photos-${value.id}`}
                            >
                              <header>
                                <div>
                                  <i className={value.tone || "neutral"} />
                                  <span><strong>{value.name}</strong><small>{assignedPhotos.length ? `${assignedPhotos.length} фото` : "Общая галерея"}</small></span>
                                </div>
                                <button
                                  className={isDefault ? "active" : ""}
                                  type="button"
                                  onClick={() => setDefaultPhotoColor(value.id)}
                                  aria-pressed={isDefault}
                                >
                                  <Star size={13} fill={isDefault ? "currentColor" : "none"} />
                                  {isDefault ? "По умолчанию" : "Сделать главным"}
                                </button>
                              </header>

                              <div className="sp-assigned-photos">
                                {assignedPhotos.map((photo) => {
                                  const photoIndex = productGallery.findIndex((item) => item.id === photo.id);
                                  return (
                                    <div key={`${value.id}-${photo.id}`}>
                                      <ProductArt tone={photo.tone} large />
                                      <b>{photoIndex + 1}</b>
                                      <button
                                        type="button"
                                        onClick={() => toggleAssignedPhoto(value.id, photo.id)}
                                        aria-label={`Убрать фото ${photoIndex + 1} из цвета ${value.name}`}
                                      >
                                        <X size={11} />
                                      </button>
                                    </div>
                                  );
                                })}
                                {!assignedPhotos.length && (
                                  <p>
                                    <ImagePlus size={16} />
                                    Пока покажем общую галерею
                                  </p>
                                )}
                                <button
                                  className="add"
                                  type="button"
                                  onClick={() => setPhotoPickerFor(photoPickerFor === value.id ? "" : value.id)}
                                  aria-expanded={photoPickerFor === value.id}
                                >
                                  <Plus size={14} />
                                  Добавить фото
                                </button>
                              </div>

                              {photoPickerFor === value.id && (
                                <div className="sp-photo-picker" role="dialog" aria-label={`Фото для цвета ${value.name}`}>
                                  <header>
                                    <p><strong>Фото для «{value.name}»</strong><small>Можно выбрать несколько. Первое выбранное фото будет главным для этого цвета.</small></p>
                                    <button type="button" onClick={() => setPhotoPickerFor("")} aria-label="Закрыть выбор фото"><X size={14} /></button>
                                  </header>
                                  <div>
                                    {productGallery.map((photo, index) => {
                                      const checked = assignedIds.includes(photo.id);
                                      return (
                                        <button
                                          className={checked ? "selected" : ""}
                                          type="button"
                                          aria-pressed={checked}
                                          aria-label={`${checked ? "Убрать" : "Выбрать"} фото ${index + 1} для цвета ${value.name}`}
                                          onClick={() => toggleAssignedPhoto(value.id, photo.id)}
                                          key={`picker-${value.id}-${photo.id}`}
                                        >
                                          <ProductArt tone={photo.tone} large />
                                          <b>{index + 1}</b>
                                          {checked && <span><Check size={13} /></span>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <footer>
                                    <span>Выбрано: <strong>{assignedIds.length}</strong></span>
                                    <button type="button" onClick={() => setPhotoPickerFor("")}>Готово</button>
                                  </footer>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>

                      <p className="sp-photo-default-note">
                        <Star size={13} fill="currentColor" />
                        Цвет «{colorPhotoOption.values.find((value) => value.id === defaultPhotoColor)?.name || colorPhotoOption.values[0]?.name}» и его фото будут показаны при первом открытии товара.
                      </p>
                    </>
                  ) : (
                    <div className="sp-variant-photo-empty">
                      <ImagePlus size={19} />
                      <p><strong>Добавьте опцию «Цвет»</strong><small>После этого можно будет привязать к каждому цвету свои фотографии.</small></p>
                    </div>
                  )}
                </section>

                <div className={pricesVary ? "sp-price-variation active" : "sp-price-variation"}>
                  <button
                    className="sp-price-vary-toggle"
                    type="button"
                    aria-pressed={pricesVary}
                    aria-label="Разные цены для вариантов"
                    onClick={() => setPricesVary(!pricesVary)}
                  >
                    <i>{pricesVary && <Check size={14} strokeWidth={3} />}</i>
                  </button>
                  <div>
                    <strong>Цены отличаются для разных вариантов</strong>
                    <small>{pricesVary ? "Выберите опцию, которая влияет на цену." : `Для всех вариантов используется базовая цена ${Number(price || 0).toLocaleString("uk-UA")} грн.`}</small>
                  </div>
                  <label className={pricesVary && completeOptions.length ? "" : "disabled"}>
                    <span>Цена зависит от</span>
                    <select
                      value={priceOption}
                      disabled={!pricesVary || !completeOptions.length}
                      onChange={(event) => setPriceOption(event.target.value)}
                    >
                      {completeOptions.map((option) => (
                        <option value={option.id} key={option.id}>{option.name}</option>
                      ))}
                      {completeOptions.length > 1 && <option value="combination">Вся комбинация</option>}
                    </select>
                  </label>
                </div>

                <div className="sp-combinations">
                  <header>
                    <div>
                      <strong>
                        {showGroupedPrices ? groupedPriceRows.length : combinationRows.length}{" "}
                        {showGroupedPrices || completeOptions.length === 1 ? "варианта" : "комбинаций"}
                      </strong>
                      <small>
                        {showGroupedPrices
                          ? completeOptions.length > 1
                            ? `Цена меняется только по опции «${priceOptionName}». Остальные опции не дублируют строки.`
                            : `Одна опция «${priceOptionName}» — одна строка на каждое значение.`
                          : pricesVary
                            ? "Цена задаётся отдельно для каждой комбинации."
                            : "У всех вариантов одна базовая цена."}
                      </small>
                    </div>
                    <button type="button">Изменить все</button>
                  </header>
                  <div className={showGroupedPrices ? "sp-combination-head price-only" : "sp-combination-head"}>
                    <span>
                      {showGroupedPrices
                        ? selectedPriceOption?.name
                        : completeOptions.length === 1
                          ? completeOptions[0].name
                          : "Комбинация"}
                    </span>
                    <span>Цена</span>
                    {!showGroupedPrices && <><span>Остаток</span><span>Артикул</span><span>Видно</span></>}
                  </div>
                  {showGroupedPrices
                    ? groupedPriceRows.map(({ tone, label, rowPrice, rowId }) => (
                      <div className="sp-combination-row price-only" key={rowId}>
                        <span><i className={tone} /><strong>{label}</strong></span>
                        <label>
                          <input
                            key={`price-${rowId}-${priceOption}`}
                            defaultValue={rowPrice}
                            aria-label={`Цена ${label}`}
                          />
                          <b>грн</b>
                        </label>
                      </div>
                    ))
                    : combinationRows.map(({ tone, label, rowPrice, rowStock, sku, rowId }) => (
                      <div className="sp-combination-row" key={rowId}>
                        <span><i className={tone} /><strong>{label}</strong></span>
                        <label>
                          <input
                            key={`price-${rowId}-${pricesVary}-${priceOption}`}
                            defaultValue={rowPrice}
                            readOnly={!pricesVary}
                            aria-label={`Цена ${label}`}
                          />
                          <b>грн</b>
                        </label>
                        <label><input defaultValue={rowStock} /><b>шт</b></label>
                        <input defaultValue={sku} aria-label={`Артикул ${label}`} />
                        <button className="sp-row-switch active" type="button" aria-label={`Вариант ${label} активен`}><i><b /></i></button>
                      </div>
                    ))}
                  {!showGroupedPrices && !combinationRows.length && (
                    <div className="sp-combinations-empty">
                      Добавьте хотя бы одно значение варианта.
                    </div>
                  )}
                  {showGroupedPrices && !groupedPriceRows.length && (
                    <div className="sp-combinations-empty">
                      Добавьте хотя бы одно значение варианта.
                    </div>
                  )}
                </div>
              </div>
            )}
          </EditorAccordion>

          <EditorAccordion id="description" label="Описание" icon={FileText} open={openSections.description} onToggle={() => toggleSection("description")}>
            <label className="sp-field">
              <span>Описание товара <button type="button" onClick={() => setDescription("Кожаный городской рюкзак ручной работы. Вместительный, удобный и рассчитан на ежедневное использование.")}><WandSparkles size={13} />Помочь написать</button></span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Расскажите о товаре простыми словами…" />
            </label>
          </EditorAccordion>

          <EditorAccordion id="features" label="Характеристики" icon={Settings2} open={openSections.features} onToggle={() => toggleSection("features")}>
            <label className="sp-field">
              <span>Материал, размеры и особенности</span>
              <input value={features} onChange={(event) => setFeatures(event.target.value)} placeholder="Например: натуральная кожа, 35 × 25 × 11 см" />
            </label>
          </EditorAccordion>

          <EditorAccordion id="delivery" label="Доставка" icon={Truck} open={openSections.delivery} onToggle={() => toggleSection("delivery")}>
            <label className="sp-field">
              <span>Условия доставки</span>
              <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
                <option value="">По настройкам магазина</option>
                <option>Бесплатная доставка</option>
                <option>Фиксированная стоимость</option>
                <option>Самовывоз</option>
              </select>
            </label>
          </EditorAccordion>

          <EditorAccordion id="seo" label="SEO" icon={Link2} open={openSections.seo} onToggle={() => toggleSection("seo")}>
            <label className="sp-field">
              <span>Заголовок для поиска</span>
              <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} placeholder={name} />
            </label>
            <div className="sp-search-preview"><small>ВАШ-МАГАЗИН.COM › PRODUCTS</small><strong>{seoTitle || name}</strong><p>{description || "Описание товара появится здесь автоматически."}</p></div>
          </EditorAccordion>
        </main>

        <aside className="sp-editor-side">
          <section className="sp-improve">
            <h3>Что улучшить</h3>
            {[
              ["variants", "Варианты", variants],
              ["description", "Описание", description.trim().length > 20],
              ["features", "Характеристики", features.trim().length > 3],
              ["delivery", "Доставка", Boolean(delivery)],
              ["seo", "SEO", seoTitle.trim().length > 3],
            ].map(([id, label, ready]) => (
              <button type="button" onClick={() => openAndScroll(String(id))} key={String(id)}>
                <span className={ready ? "done" : ""}>{ready ? <Check size={12} /> : <Plus size={12} />}</span>
                {String(label)}
                <ChevronDown size={13} />
              </button>
            ))}
            <button type="button" onClick={() => openAndScroll("media")}><span><Video size={12} /></span>Видео<ChevronDown size={13} /></button>
          </section>

          <section className="sp-side-preview" id="sp-section-preview">
            <header><h3>Предпросмотр</h3><Eye size={15} /></header>
            <ProductArt tone={previewPhotos[0]?.tone || defaultColorValue?.tone || "cognac"} large />
            <div className="sp-preview-thumbs">
              {previewPhotos.slice(0, 4).map((photo) => <ProductArt tone={photo.tone} key={`${photo.id}-preview`} />)}
              <button type="button"><Plus size={15} /></button>
            </div>
            <small>{category.split(" → ").at(-1)}</small>
            <strong>{name || "Название товара"}</strong>
            <b>{Number(price || 0).toLocaleString("uk-UA")} грн</b>
            {defaultColorValue && <em className="sp-preview-default-color"><i className={defaultColorValue.tone || "neutral"} />По умолчанию: {defaultColorValue.name}</em>}
          </section>

          <div className="sp-side-tip">
            <Tag size={17} />
            <p><strong>Ничего лишнего</strong><small>Основного уже достаточно. Остальные настройки можно заполнить позже.</small></p>
          </div>
        </aside>
      </div>

      <div className="sp-mobile-publish">
        <button type="button" onClick={startPublishing}><Rocket size={16} />Опубликовать товар</button>
        <span><i />{readiness >= 40 ? "Уже можно продавать" : "Заполните основное"} · {readiness}%</span>
      </div>
    </section>
  );
}

export function ProductsPage({ startCreating = false }: { startCreating?: boolean }) {
  const [screen, setScreen] = useState<Screen>(startCreating ? "create" : "list");
  const [sourceProduct, setSourceProduct] = useState<CatalogueProduct | undefined>();
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [categoryManagerMode, setCategoryManagerMode] = useState<CategoryManagerMode>("manage");
  const [categories, setCategories] = useState<StoreCategory[]>(initialStoreCategories);
  const [storeCategories, setStoreCategories] = useState(["city", "new", "sale"]);

  const toggleStoreCategory = (id: string) => {
    setStoreCategories((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <>
      {screen === "list"
        ? (
          <ProductsList
            onCreate={(source) => {
              setSourceProduct(source);
              setScreen("create");
            }}
            onManageCategories={() => {
              setCategoryManagerMode("manage");
              setCategoryManagerOpen(true);
            }}
          />
        )
        : (
          <ProductCreator
            screen={screen}
            setScreen={setScreen}
            categories={categories}
            storeCategories={storeCategories}
            onToggleStoreCategory={toggleStoreCategory}
            onManageCategories={() => {
              setCategoryManagerMode("assign");
              setCategoryManagerOpen(true);
            }}
            sourceProduct={sourceProduct}
          />
        )}
      {categoryManagerOpen && (
        <CategoryManager
          mode={categoryManagerMode}
          categories={categories}
          selected={storeCategories}
          onSave={setStoreCategories}
          onAdd={(name, parent) => {
            const id = `${name.toLowerCase().replace(/[^a-zа-яіїє0-9]+/gi, "-")}-${Date.now()}`;
            setCategories((current) => [...current, { id, name, count: 0, parent }]);
            return id;
          }}
          onRename={(id, name) => setCategories((current) => current.map((item) => item.id === id ? { ...item, name } : item))}
          onDelete={(id) => {
            setCategories((current) => {
              const removed = new Set([id]);
              let added = true;
              while (added) {
                added = false;
                current.forEach((item) => {
                  if (item.parent && removed.has(item.parent) && !removed.has(item.id)) {
                    removed.add(item.id);
                    added = true;
                  }
                });
              }
              setStoreCategories((selectedIds) => selectedIds.filter((item) => !removed.has(item)));
              return current.filter((item) => !removed.has(item.id));
            });
          }}
          onReorder={(sourceId, targetId) => setCategories((current) => {
            const sourceIndex = current.findIndex((item) => item.id === sourceId);
            const targetIndex = current.findIndex((item) => item.id === targetId);
            if (sourceIndex < 0 || targetIndex < 0 || current[sourceIndex].parent !== current[targetIndex].parent) return current;
            const next = [...current];
            const [moved] = next.splice(sourceIndex, 1);
            const adjustedTarget = next.findIndex((item) => item.id === targetId);
            next.splice(adjustedTarget, 0, moved);
            return next;
          })}
          onClose={() => setCategoryManagerOpen(false)}
        />
      )}
    </>
  );
}
