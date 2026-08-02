"use client";

import {
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  FileText,
  Filter,
  Info,
  Mail,
  PackageCheck,
  Phone,
  Plus,
  Printer,
  Search,
  Send,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type OrderStatus = "new" | "awaiting" | "paid" | "processing" | "ready" | "shipped" | "completed" | "cancelled";
type PaymentStatus = "paid" | "awaiting" | "requisites";
type OrderItem = { name: string; variant: string; quantity: number; price: number; tone: string };
type Order = {
  id: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  email: string;
  total: number;
  status: OrderStatus;
  payment: PaymentStatus;
  paymentMethod: string;
  carrier: "Нова пошта" | "Укрпошта";
  deliveryType: string;
  destination: string;
  apiConnected: boolean;
  tracking?: string;
  comment?: string;
  items: OrderItem[];
};

const statusConfig: Record<OrderStatus, { label: string; short: string }> = {
  new: { label: "Новый", short: "Новые" },
  awaiting: { label: "Ожидает оплаты", short: "Ждут оплату" },
  paid: { label: "Оплачен", short: "Оплачены" },
  processing: { label: "В работе", short: "В работе" },
  ready: { label: "Готов к отправке", short: "К отправке" },
  shipped: { label: "Отправлен", short: "Отправлены" },
  completed: { label: "Выполнен", short: "Выполнены" },
  cancelled: { label: "Отменён", short: "Отменены" },
};

const orders: Order[] = [
  { id: "#1048", date: "1 авг. 2026", time: "12:42", customer: "Анна Смирнова", phone: "+380 67 123 45 67", email: "anna.smyrnova@gmail.com", total: 3520, status: "new", payment: "paid", paymentMethod: "plata by mono", carrier: "Нова пошта", deliveryType: "Отделение", destination: "Одесса, отделение №24", apiConnected: true, comment: "Позвонить перед отправкой", items: [{ name: "Кожаный рюкзак City", variant: "Коньяк · Стандартный", quantity: 1, price: 3520, tone: "cognac" }] },
  { id: "#1047", date: "1 авг. 2026", time: "11:18", customer: "Дмитрий Коваленко", phone: "+380 93 540 28 11", email: "d.kovalenko@ukr.net", total: 5890, status: "awaiting", payment: "requisites", paymentMethod: "Реквизиты ФОП", carrier: "Укрпошта", deliveryType: "Отделение", destination: "Львов, 79007", apiConnected: false, items: [{ name: "Сумка-мессенджер Ralph", variant: "Кофе", quantity: 1, price: 5890, tone: "coffee" }] },
  { id: "#1046", date: "1 авг. 2026", time: "10:36", customer: "Ольга Петрова", phone: "+380 50 887 41 02", email: "olga.petrova@gmail.com", total: 2450, status: "paid", payment: "paid", paymentMethod: "LiqPay", carrier: "Нова пошта", deliveryType: "Почтомат", destination: "Киев, почтомат №30211", apiConnected: true, items: [{ name: "Кожаная поясная сумка", variant: "Чёрный", quantity: 1, price: 2450, tone: "black" }] },
  { id: "#1045", date: "31 июл. 2026", time: "18:04", customer: "Сергей Иванов", phone: "+380 68 201 76 43", email: "serhii.ivanov@gmail.com", total: 7100, status: "processing", payment: "paid", paymentMethod: "WayForPay", carrier: "Нова пошта", deliveryType: "Курьер", destination: "Днепр, ул. Воскресенская, 18", apiConnected: true, items: [{ name: "Дорожная сумка Weekender", variant: "Коньяк · Большой", quantity: 1, price: 7100, tone: "cognac" }] },
  { id: "#1044", date: "31 июл. 2026", time: "16:27", customer: "Елена Васильева", phone: "+380 97 332 14 08", email: "elena.v@gmail.com", total: 4300, status: "ready", payment: "paid", paymentMethod: "plata by mono", carrier: "Нова пошта", deliveryType: "Отделение", destination: "Харьков, отделение №71", apiConnected: true, items: [{ name: "Женская сумка Annabel", variant: "Рыжий", quantity: 1, price: 4300, tone: "ginger" }] },
  { id: "#1043", date: "31 июл. 2026", time: "13:51", customer: "Мария Бондаренко", phone: "+380 63 177 52 09", email: "m.bondarenko@icloud.com", total: 6840, status: "shipped", payment: "paid", paymentMethod: "LiqPay", carrier: "Нова пошта", deliveryType: "Отделение", destination: "Полтава, отделение №9", apiConnected: true, tracking: "20450987654321", items: [{ name: "Рюкзак Hunter", variant: "Кофе", quantity: 1, price: 6840, tone: "coffee" }] },
  { id: "#1042", date: "30 июл. 2026", time: "17:12", customer: "Андрей Мельник", phone: "+380 66 908 33 15", email: "a.melnyk@gmail.com", total: 4970, status: "completed", payment: "paid", paymentMethod: "WayForPay", carrier: "Укрпошта", deliveryType: "Международная", destination: "Warszawa, 00-001, Poland", apiConnected: false, tracking: "RT392184705UA", items: [{ name: "Кожаный портфель Simon", variant: "Тёмно-синий", quantity: 1, price: 4970, tone: "navy" }] },
  { id: "#1041", date: "30 июл. 2026", time: "12:33", customer: "Наталья Шевченко", phone: "+380 95 442 71 90", email: "nata.shevchenko@gmail.com", total: 2190, status: "cancelled", payment: "awaiting", paymentMethod: "Реквизиты ФОП", carrier: "Укрпошта", deliveryType: "Отделение", destination: "Черкассы, 18001", apiConnected: false, items: [{ name: "Кожаный кошелёк", variant: "Зелёный", quantity: 1, price: 2190, tone: "green" }] },
];

const paymentLabel: Record<PaymentStatus, string> = { paid: "Оплачено", awaiting: "Не оплачено", requisites: "Ждём перевод" };
const formatMoney = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₴`;

export function OrdersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selectedId, setSelectedId] = useState("#1048");
  const [statusByOrder, setStatusByOrder] = useState<Record<string, OrderStatus>>({});
  const [trackingByOrder, setTrackingByOrder] = useState<Record<string, string>>({});
  const [showWaybill, setShowWaybill] = useState(false);
  const [showManualTracking, setShowManualTracking] = useState(false);
  const [manualTracking, setManualTracking] = useState("");
  const [notice, setNotice] = useState("");

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const status = statusByOrder[order.id] ?? order.status;
    const matchesFilter = filter === "all" || status === filter;
    const needle = query.trim().toLowerCase();
    const tracking = trackingByOrder[order.id] ?? order.tracking ?? "";
    const matchesSearch = !needle || [order.id, order.customer, order.phone, order.email, tracking].some((value) => value.toLowerCase().includes(needle));
    return matchesFilter && matchesSearch;
  }), [filter, query, statusByOrder, trackingByOrder]);

  const selected = orders.find((order) => order.id === selectedId) ?? visibleOrders[0] ?? orders[0];
  const selectedStatus = statusByOrder[selected.id] ?? selected.status;
  const selectedTracking = trackingByOrder[selected.id] ?? selected.tracking;
  const statusCount = (status: OrderStatus) => orders.filter((order) => (statusByOrder[order.id] ?? order.status) === status).length;

  const updateStatus = (status: OrderStatus) => {
    setStatusByOrder((current) => ({ ...current, [selected.id]: status }));
    setNotice(`Статус заказа ${selected.id} изменён на «${statusConfig[status].label}».`);
  };

  const createWaybill = () => {
    setTrackingByOrder((current) => ({ ...current, [selected.id]: "20450987654321" }));
    setStatusByOrder((current) => ({ ...current, [selected.id]: "shipped" }));
    setShowWaybill(false);
    setNotice("Накладная создана. Трек‑номер добавлен в заказ и готов к отправке покупателю.");
  };

  const saveManualTracking = () => {
    if (!manualTracking.trim()) return;
    setTrackingByOrder((current) => ({ ...current, [selected.id]: manualTracking.trim() }));
    setStatusByOrder((current) => ({ ...current, [selected.id]: "shipped" }));
    setShowManualTracking(false);
    setNotice("Трек‑номер сохранён и отправлен покупателю.");
  };

  return <section className="ord-page uk-animation-fade">
    <header className="ord-hero">
      <div><p className="eyebrow">Продажи</p><h1>Заказы</h1><p>Находите заказы по номеру, покупателю, телефону или трек‑номеру и ведите их от оплаты до доставки.</p></div>
      <button type="button" className="ord-export"><FileText size={15} /> Экспорт заказов</button>
    </header>

    <section className="ord-summary">
      <article><span className="new"><ShoppingBag size={17} /></span><p><small>Новые</small><strong>{statusCount("new")}</strong></p></article>
      <article><span className="paid"><CircleDollarSign size={17} /></span><p><small>Оплачены</small><strong>{orders.filter((order) => order.payment === "paid").length}</strong></p></article>
      <article><span className="ready"><PackageCheck size={17} /></span><p><small>К отправке</small><strong>{statusCount("ready")}</strong></p></article>
      <article><span className="shipped"><Truck size={17} /></span><p><small>В пути</small><strong>{statusCount("shipped")}</strong></p></article>
    </section>

    <section className="ord-workspace">
      <div className="ord-list-panel">
        <div className="ord-toolbar">
          <label className="ord-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Номер, покупатель, телефон или трек‑номер" />{query && <button type="button" aria-label="Очистить поиск" onClick={() => setQuery("")}><X size={14} /></button>}</label>
          <button type="button" className="ord-filter-button"><Filter size={14} /> Фильтры <ChevronDown size={13} /></button>
        </div>
        <div className="ord-status-tabs">
          <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Все <b>{orders.length}</b></button>
          {(["new", "awaiting", "paid", "processing", "ready", "shipped", "completed", "cancelled"] as OrderStatus[]).map((status) => <button type="button" className={filter === status ? "active" : ""} onClick={() => setFilter(status)} key={status}>{statusConfig[status].short}<b>{statusCount(status)}</b></button>)}
        </div>

        <div className="ord-table-head"><span>Заказ</span><span>Покупатель</span><span>Оплата</span><span>Доставка</span><span>Статус</span><span>Сумма</span></div>
        <div className="ord-list">
          {visibleOrders.map((order) => {
            const status = statusByOrder[order.id] ?? order.status;
            const tracking = trackingByOrder[order.id] ?? order.tracking;
            return <button type="button" className={`ord-row ${selected.id === order.id ? "selected" : ""}`} onClick={() => { setSelectedId(order.id); setNotice(""); }} key={order.id}>
              <span className="ord-order-id"><strong>{order.id}</strong><small>{order.date} · {order.time}</small></span>
              <span className="ord-customer"><b>{order.customer.slice(0, 1)}</b><span><strong>{order.customer}</strong><small>{order.phone}</small></span></span>
              <span className={`ord-payment ${order.payment}`}><i />{paymentLabel[order.payment]}</span>
              <span className="ord-delivery"><strong>{order.carrier}</strong><small>{tracking || order.deliveryType}</small></span>
              <span><em className={`ord-status ${status}`}>{statusConfig[status].label}</em></span>
              <span className="ord-total"><strong>{formatMoney(order.total)}</strong><ChevronRight size={15} /></span>
            </button>;
          })}
          {!visibleOrders.length && <div className="ord-empty"><Search size={24} /><strong>Заказы не найдены</strong><small>Измените запрос или выберите другой статус.</small></div>}
        </div>
      </div>

      <aside className="ord-details">
        <header><div><p className="eyebrow">Заказ</p><h2>{selected.id}</h2><small>{selected.date} в {selected.time}</small></div><em className={`ord-status ${selectedStatus}`}>{statusConfig[selectedStatus].label}</em></header>
        {notice && <p className="ord-notice"><Check size={14} />{notice}<button type="button" onClick={() => setNotice("")}><X size={13} /></button></p>}
        <div className="ord-status-control"><label><span>Статус заказа</span><select value={selectedStatus} onChange={(event) => updateStatus(event.target.value as OrderStatus)}>{(Object.keys(statusConfig) as OrderStatus[]).map((status) => <option value={status} key={status}>{statusConfig[status].label}</option>)}</select></label></div>

        <section className="ord-detail-block buyer"><header><span><UserRound size={15} /></span><strong>Покупатель</strong></header><p><b>{selected.customer}</b><a><Phone size={13} />{selected.phone}</a><a><Mail size={13} />{selected.email}</a></p></section>
        <section className="ord-detail-block"><header><span><Box size={15} /></span><strong>Товары</strong><em>{selected.items.reduce((sum, item) => sum + item.quantity, 0)} шт.</em></header>{selected.items.map((item) => <div className="ord-product" key={item.name}><span className={`ord-product-art ${item.tone}`}><ShoppingBag size={18} /></span><p><strong>{item.name}</strong><small>{item.variant} · {item.quantity} шт.</small></p><b>{formatMoney(item.price)}</b></div>)}<div className="ord-order-total"><span>Итого</span><strong>{formatMoney(selected.total)}</strong></div></section>
        <section className="ord-detail-block"><header><span><CreditCard size={15} /></span><strong>Оплата</strong><em className={`ord-payment ${selected.payment}`}><i />{paymentLabel[selected.payment]}</em></header><dl><div><dt>Способ</dt><dd>{selected.paymentMethod}</dd></div><div><dt>Сумма</dt><dd>{formatMoney(selected.total)}</dd></div></dl></section>
        <section className="ord-detail-block delivery"><header><span><Truck size={15} /></span><strong>Доставка</strong><em className={selected.apiConnected ? "api" : "manual"}>{selected.apiConnected ? "API подключён" : "Ручной режим"}</em></header><dl><div><dt>Служба</dt><dd>{selected.carrier} · {selected.deliveryType}</dd></div><div><dt>Куда</dt><dd>{selected.destination}</dd></div>{selectedTracking && <div><dt>Трек‑номер</dt><dd className="tracking">{selectedTracking}<button type="button" aria-label="Копировать трек-номер"><Copy size={12} /></button></dd></div>}</dl>
          {selectedTracking ? <div className="ord-shipping-actions"><button type="button"><Printer size={14} /> Печать накладной</button><button type="button"><Send size={14} /> Отправить покупателю</button></div> : selected.apiConnected ? <button type="button" className="ord-create-waybill" onClick={() => setShowWaybill(true)}><Plus size={15} /> Создать накладную</button> : <button type="button" className="ord-create-waybill manual" onClick={() => { setManualTracking(""); setShowManualTracking(true); }}><Plus size={15} /> Добавить трек‑номер</button>}
          {!selected.apiConnected && !selectedTracking && <p className="ord-manual-hint"><Info size={13} />Накладную создайте в кабинете службы, затем добавьте трек‑номер сюда.</p>}
        </section>
        {selected.comment && <section className="ord-comment"><Info size={14} /><p><strong>Комментарий покупателя</strong><span>{selected.comment}</span></p></section>}
      </aside>
    </section>

    {showWaybill && <div className="ord-modal-backdrop" role="presentation"><section className="ord-waybill-modal" role="dialog" aria-modal="true" aria-labelledby="waybill-title"><header><div><p className="eyebrow">{selected.carrier} · API</p><h2 id="waybill-title">Создать накладную</h2></div><button type="button" aria-label="Закрыть" onClick={() => setShowWaybill(false)}><X size={18} /></button></header><div className="ord-waybill-order"><span><Truck size={18} /></span><p><strong>{selected.id} · {selected.customer}</strong><small>{selected.destination}</small></p><em>Данные заполнены из заказа</em></div><div className="ord-waybill-fields"><label><span>Вес посылки</span><div><input defaultValue="1" inputMode="decimal" /><b>кг</b></div></label><label><span>Количество мест</span><input defaultValue="1" inputMode="numeric" /></label><label><span>Объявленная стоимость</span><div><input defaultValue={selected.total} inputMode="numeric" /><b>₴</b></div></label><label><span>Плательщик за доставку</span><select defaultValue="buyer"><option value="buyer">Получатель</option><option value="seller">Отправитель</option></select></label><label className="full"><span>Описание отправления</span><input defaultValue="Кожаные изделия" /></label></div><p className="ord-waybill-info"><Info size={14} />Получатель, телефон, город и отделение уже подставлены из заказа.</p><footer><button type="button" className="secondary" onClick={() => setShowWaybill(false)}>Отмена</button><button type="button" className="primary" onClick={createWaybill}><Truck size={15} /> Создать накладную</button></footer></section></div>}

    {showManualTracking && <div className="ord-modal-backdrop" role="presentation"><section className="ord-tracking-modal" role="dialog" aria-modal="true" aria-labelledby="tracking-title"><header><div><p className="eyebrow">Ручной режим</p><h2 id="tracking-title">Добавить трек‑номер</h2></div><button type="button" aria-label="Закрыть" onClick={() => setShowManualTracking(false)}><X size={18} /></button></header><p>Вставьте номер после создания отправления в кабинете «{selected.carrier}».</p><label><span>Трек‑номер <b>*</b></span><input autoFocus value={manualTracking} onChange={(event) => setManualTracking(event.target.value)} placeholder="Например, RT392184705UA" /></label><footer><button type="button" className="secondary" onClick={() => setShowManualTracking(false)}>Отмена</button><button type="button" className="primary" disabled={!manualTracking.trim()} onClick={saveManualTracking}>Сохранить и отправить</button></footer></section></div>}
  </section>;
}
