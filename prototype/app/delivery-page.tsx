"use client";

import {
  Box,
  Check,
  ChevronRight,
  CircleDollarSign,
  Eye,
  EyeOff,
  Globe2,
  Info,
  KeyRound,
  MapPin,
  PackageCheck,
  Plus,
  Printer,
  Send,
  Store,
  Truck,
  UserRound,
  Warehouse,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";

type CarrierId = "nova" | "ukr";
type CarrierState = Record<CarrierId, boolean>;
type DeliveryMode = "manual" | "api";
type DeliveryModes = Record<CarrierId, DeliveryMode>;
type Credentials = {
  novaApiKey: string;
  novaGlobalKey: string;
  ukrBearer: string;
  ukrToken: string;
  ukrCounterparty: string;
  ukrTrackingBearer: string;
};

const carriers = {
  nova: {
    name: "Нова пошта",
    mark: "НП",
    tone: "nova",
    description: "Отделения, почтоматы и курьерская доставка по Украине и за границу.",
    domestic: ["Отделение", "Почтомат", "Курьер"],
    international: ["Отделение", "Курьер"],
  },
  ukr: {
    name: "Укрпошта",
    mark: "УП",
    tone: "ukr",
    description: "Доставка по Украине и международные отправления из одного подключения.",
    domestic: ["Отделение", "Курьер"],
    international: ["Отделение", "Курьер"],
  },
} as const;

function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return <button type="button" className={`shp-switch ${checked ? "active" : ""}`} aria-pressed={checked} aria-label={label} onClick={onChange} disabled={disabled}><span /></button>;
}

export function DeliveryPage() {
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierId>("nova");
  const [enabled, setEnabled] = useState<CarrierState>({ nova: true, ukr: true });
  const [deliveryMode, setDeliveryMode] = useState<DeliveryModes>({ nova: "manual", ukr: "manual" });
  const [ukraineEnabled, setUkraineEnabled] = useState<CarrierState>({ nova: true, ukr: true });
  const [worldEnabled, setWorldEnabled] = useState<CarrierState>({ nova: true, ukr: true });
  const [credentials, setCredentials] = useState<Credentials>({ novaApiKey: "", novaGlobalKey: "", ukrBearer: "", ukrToken: "", ukrCounterparty: "", ukrTrackingBearer: "" });
  const [showSecrets, setShowSecrets] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [autoWaybill, setAutoWaybill] = useState(false);
  const [notifyBuyer, setNotifyBuyer] = useState(true);
  const [localPickup, setLocalPickup] = useState(false);
  const [pricingMode, setPricingMode] = useState("fixed");

  const enabledCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);
  const hasApiCarrier = useMemo(() => (enabled.nova && deliveryMode.nova === "api") || (enabled.ukr && deliveryMode.ukr === "api"), [deliveryMode, enabled]);
  const carrier = carriers[selectedCarrier];
  const enabledLabel = enabledCount === 0 ? "Способы ещё не включены" : enabledCount === 1 ? "1 способ включён" : "2 способа включены";

  const toggleCarrierState = (setter: Dispatch<SetStateAction<CarrierState>>, id: CarrierId) => {
    setter((current) => ({ ...current, [id]: !current[id] }));
  };

  const setCredential = (field: keyof Credentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }));
    setConnectionMessage("");
  };

  const connectCarrier = () => {
    const novaReady = credentials.novaApiKey.trim() && (!worldEnabled.nova || credentials.novaGlobalKey.trim());
    const ukrReady = credentials.ukrBearer.trim() && credentials.ukrToken.trim() && credentials.ukrCounterparty.trim() && credentials.ukrTrackingBearer.trim();
    const ready = selectedCarrier === "nova" ? novaReady : ukrReady;
    if (!ready) {
      setConnectionMessage("Заполните обязательные поля — они отмечены звёздочкой.");
      setEnabled((current) => ({ ...current, [selectedCarrier]: false }));
      return;
    }
    setEnabled((current) => ({ ...current, [selectedCarrier]: true }));
    setDeliveryMode((current) => ({ ...current, [selectedCarrier]: "api" }));
    setConnectionMessage("Соединение проверено. Служба готова к созданию отправлений.");
  };

  const handleCarrierToggle = (id: CarrierId) => {
    setSelectedCarrier(id);
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
    setConnectionMessage("");
  };

  const selectDeliveryMode = (mode: DeliveryMode) => {
    setDeliveryMode((current) => ({ ...current, [selectedCarrier]: mode }));
    setEnabled((current) => ({ ...current, [selectedCarrier]: true }));
    setConnectionMessage("");
    if (mode === "manual") setAutoWaybill(false);
  };

  return (
    <section className="shp-page uk-animation-fade">
      <header className="shp-hero">
        <div>
          <p className="eyebrow">Настройки магазина</p>
          <h1>Доставка</h1>
          <p>Включите готовую службу без ключей — покупатель укажет город, отделение или адрес, а вы увидите всё в заказе.</p>
        </div>
        <div className="shp-ready">
          <span><PackageCheck size={20} /></span>
          <p><small>{enabledCount ? "Готово принимать адреса" : "Нужна настройка"}</small><strong>{enabledLabel}</strong></p>
        </div>
      </header>

      <section className="shp-required-setup">
        <header><div><p className="eyebrow">Перед началом работы</p><h2>Минимальная настройка</h2></div><span>API необязательно</span></header>
        <div>
          <article className={enabledCount ? "done" : "current"}><b>{enabledCount ? <Check size={14} /> : <Truck size={14} />}</b><p><strong>1. Служба доставки</strong><small>Включите «Нова пошта» или «Укрпошта»</small></p></article>
          <article className="done"><b><Check size={14} /></b><p><strong>2. Стоимость</strong><small>Фиксированная, бесплатная или по тарифу API</small></p></article>
          <article><b><UserRound size={14} /></b><p><strong>Данные отправителя — позже</strong><small>Понадобятся только для создания накладной</small></p></article>
        </div>
      </section>

      <section className="shp-carriers-section">
        <header className="shp-section-head">
          <div><p className="eyebrow">Готовые подключения</p><h2>Службы доставки</h2><p>Все необходимые способы уже собраны — остаётся включить нужные.</p></div>
          <button type="button" className="shp-add-carrier"><Plus size={15} /> Добавить свою доставку</button>
        </header>

        <div className="shp-carrier-layout">
          <div className="shp-carrier-list">
            {(Object.keys(carriers) as CarrierId[]).map((id) => {
              const item = carriers[id];
              return (
                <article className={`shp-carrier-card ${selectedCarrier === id ? "selected" : ""}`} key={id}>
                  <button type="button" className="shp-carrier-open" onClick={() => { setSelectedCarrier(id); setConnectionMessage(""); }}>
                    <span className={`shp-carrier-mark ${item.tone}`}>{item.mark}</span>
                    <p><strong>{item.name}</strong><small>{item.description}</small></p>
                    <ChevronRight size={17} />
                  </button>
                  <div className="shp-carrier-meta">
                    <span><MapPin size={12} /> По Украине</span>
                    <span><Globe2 size={12} /> За границу</span>
                    <em className={enabled[id] ? "connected" : "needs-setup"}>{enabled[id] ? <><Check size={11} /> {deliveryMode[id] === "manual" ? "Ручной режим" : "Подключено"}</> : "Выключено"}</em>
                    <Switch checked={enabled[id]} label={`${enabled[id] ? "Выключить" : "Настроить"} ${item.name}`} onChange={() => handleCarrierToggle(id)} />
                  </div>
                </article>
              );
            })}

            <article className="shp-simple-method">
              <span><Store size={18} /></span>
              <p><strong>Самовывоз</strong><small>Покупатель забирает заказ по вашему адресу</small></p>
              <Switch checked={localPickup} label="Включить самовывоз" onChange={() => setLocalPickup((value) => !value)} />
            </article>
          </div>

          <aside className="shp-carrier-settings">
            <header>
              <span className={`shp-carrier-mark large ${carrier.tone}`}>{carrier.mark}</span>
              <div><p className="eyebrow">Способ работы</p><h3>{carrier.name}</h3></div>
              <em className={enabled[selectedCarrier] ? "connected" : ""}>{enabled[selectedCarrier] ? "Активна" : "Выключена"}</em>
            </header>

            <div className="shp-mode-picker">
              <button type="button" className={deliveryMode[selectedCarrier] === "manual" ? "active" : ""} onClick={() => selectDeliveryMode("manual")}>
                <span><Check size={15} /></span>
                <p><strong>Просто, без API</strong><small>Покупатель вводит адрес — вы оформляете отправку вручную</small></p>
                <em>Рекомендуем</em>
              </button>
              <button type="button" className={deliveryMode[selectedCarrier] === "api" ? "active" : ""} onClick={() => selectDeliveryMode("api")}>
                <span><KeyRound size={15} /></span>
                <p><strong>Автоматически</strong><small>Тарифы, накладные и статусы через кабинет службы</small></p>
              </button>
            </div>

            {deliveryMode[selectedCarrier] === "manual" ? (
              <div className="shp-manual-setup">
                <div className="shp-manual-success"><span><Check size={15} /></span><p><strong>Ключи и договор не нужны</strong><small>Этого режима достаточно, чтобы понимать, куда отправлять заказ.</small></p></div>
                <div className="shp-manual-grid">
                  <div className="shp-buyer-fields">
                    <p className="eyebrow">Что заполнит покупатель</p>
                    <strong>По Украине</strong>
                    <ul><li>Получатель и телефон</li><li>Город и отделение или почтомат</li><li>Адрес — если выбрана доставка курьером</li></ul>
                    <strong>За границу</strong>
                    <ul><li>Получатель латиницей и телефон</li><li>Страна, индекс, город</li><li>Улица, дом и квартира</li></ul>
                  </div>
                  <div className="shp-order-preview">
                    <p className="eyebrow">Так это выглядит в заказе</p>
                    <header><span className={`shp-carrier-mark mini ${carrier.tone}`}>{carrier.mark}</span><p><strong>{carrier.name} · Отделение</strong><small>Доставка оплачивается получателем</small></p></header>
                    <dl><div><dt>Куда</dt><dd>Одесса, отделение № 24</dd></div><div><dt>Получатель</dt><dd>Анна Смирнова</dd></div><div><dt>Телефон</dt><dd>+380 67 123 45 67</dd></div></dl>
                  </div>
                </div>
                <p className="shp-manual-explain"><Info size={14} /><span>Shopra сохраняет и показывает данные доставки в заказе. Накладную вы создаёте в кабинете {carrier.name}, а готовый трек‑номер добавляете в заказ вручную.</span></p>
              </div>
            ) : <div className="shp-api-setup">
              <div className="shp-api-title">
                <span><KeyRound size={17} /></span>
                <p><strong>Доступ к кабинету</strong><small>Секретные ключи сохраняются в зашифрованном виде</small></p>
                <button type="button" aria-label={showSecrets ? "Скрыть ключи" : "Показать ключи"} onClick={() => setShowSecrets((value) => !value)}>{showSecrets ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>

              {selectedCarrier === "nova" ? (
                <div className="shp-api-fields">
                  <label className="full"><span>API‑ключ «Нова пошта» <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.novaApiKey} onChange={(event) => setCredential("novaApiKey", event.target.value)} placeholder="Вставьте ключ из бизнес‑кабинета" /><small>Кабинет → Настройки → Безопасность → Создать ключ</small></label>
                  {worldEnabled.nova && <label className="full"><span>Ключ Nova Post International <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.novaGlobalKey} onChange={(event) => setCredential("novaGlobalKey", event.target.value)} placeholder="Ключ международного API" /><small>Нужен только при включённой доставке за границу</small></label>}
                </div>
              ) : (
                <div className="shp-api-fields two-columns">
                  <label><span>Bearer eCom <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.ukrBearer} onChange={(event) => setCredential("ukrBearer", event.target.value)} placeholder="PRODUCTION BEARER eCom" /></label>
                  <label><span>User token <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.ukrToken} onChange={(event) => setCredential("ukrToken", event.target.value)} placeholder="PROD COUNTERPARTY TOKEN" /></label>
                  <label><span>Counterparty UUID <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.ukrCounterparty} onChange={(event) => setCredential("ukrCounterparty", event.target.value)} placeholder="Идентификатор контрагента" /></label>
                  <label><span>Bearer отслеживания <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.ukrTrackingBearer} onChange={(event) => setCredential("ukrTrackingBearer", event.target.value)} placeholder="BEARER StatusTracking" /></label>
                  <p className="shp-api-help full"><Info size={13} /> Эти данные выдаёт менеджер «Укрпошты» после заключения договора на API‑обслуживание.</p>
                </div>
              )}

              {connectionMessage && <p className={`shp-connection-message ${enabled[selectedCarrier] ? "success" : "warning"}`}>{enabled[selectedCarrier] ? <Check size={13} /> : <Info size={13} />}{connectionMessage}</p>}
              <div className="shp-connect-actions">
                <button type="button" className="primary" onClick={connectCarrier}>{enabled[selectedCarrier] ? "Проверить повторно" : "Проверить и подключить"}</button>
                <button type="button">Где получить данные?</button>
              </div>
            </div>}

            <div className="shp-zone">
              <span className="shp-zone-icon"><MapPin size={18} /></span>
              <p><strong>Доставка по Украине</strong><small>{deliveryMode[selectedCarrier] === "api" ? "Города и отделения обновляются автоматически" : "Покупатель укажет город и отделение вручную"}</small></p>
              <Switch checked={ukraineEnabled[selectedCarrier]} label="Доставка по Украине" onChange={() => toggleCarrierState(setUkraineEnabled, selectedCarrier)} />
              <div className="shp-methods">{carrier.domestic.map((method) => <span key={method}><Check size={10} /> {method}</span>)}</div>
            </div>

            <div className="shp-zone">
              <span className="shp-zone-icon world"><Globe2 size={18} /></span>
              <p><strong>Международная доставка</strong><small>{deliveryMode[selectedCarrier] === "api" ? "Страны и доступные услуги определяются службой" : "Покупатель заполнит полный почтовый адрес"}</small></p>
              <Switch checked={worldEnabled[selectedCarrier]} label="Международная доставка" onChange={() => toggleCarrierState(setWorldEnabled, selectedCarrier)} />
              <div className="shp-methods">{carrier.international.map((method) => <span key={method}><Check size={10} /> {method}</span>)}</div>
            </div>

          </aside>
        </div>
      </section>

      <section className="shp-settings-grid">
        <article className="shp-setting-card sender">
          <header><span><Warehouse size={18} /></span><div><p className="eyebrow">Отправитель · необязательно</p><h3>Откуда отправляем</h3></div><button type="button">Сохранить</button></header>
          <div className="shp-sender-fields">
            <label><span>Тип отправителя <b>*</b></span><select defaultValue="person"><option value="person">Физическое лицо</option><option value="fop">ФОП</option><option value="company">Компания</option></select></label>
            <label><span>Имя отправителя <b>*</b></span><input defaultValue="Вадим Панасенко" /></label>
            <label><span>Телефон <b>*</b></span><input defaultValue="+380" inputMode="tel" /></label>
            <label><span>Город отправки <b>*</b></span><input defaultValue="Одесса" /></label>
            <label className="full"><span>Отделение или адрес забора <b>*</b></span><input placeholder="Например, отделение № 24" /></label>
          </div>
          <p className="shp-hint"><Info size={14} /> В простом режиме можно не заполнять. Эти данные нужны для автоматического создания накладной.</p>
        </article>

        <article className="shp-setting-card prices">
          <header><span><CircleDollarSign size={18} /></span><div><p className="eyebrow">Стоимость</p><h3>Что увидит покупатель</h3></div></header>
          <label><span>Расчёт доставки</span><select value={pricingMode} onChange={(event) => setPricingMode(event.target.value)}><option value="fixed">Фиксированная стоимость</option><option value="free">Всегда бесплатно</option><option value="carrier" disabled={!hasApiCarrier}>По тарифам службы {hasApiCarrier ? "" : "— нужен API"}</option></select></label>
          {pricingMode === "fixed" && <div className="shp-fixed-prices">
            <label><span>По Украине</span><div><input defaultValue="100" inputMode="decimal" aria-label="Стоимость доставки по Украине" /><b>₴</b></div></label>
            <label><span>За границу</span><div><input defaultValue="500" inputMode="decimal" aria-label="Стоимость международной доставки" /><b>₴</b></div></label>
          </div>}
          {pricingMode === "free" && <p className="shp-price-explain"><Check size={14} /> Покупатель увидит бесплатную доставку для всех включённых способов.</p>}
          {pricingMode === "carrier" && <p className="shp-price-explain api"><Info size={14} /> Стоимость рассчитает служба по адресу покупателя, весу и размерам товара.</p>}
          {pricingMode !== "free" && <div className="shp-free-rule">
            <Switch checked={freeDelivery} label="Бесплатная доставка от суммы" onChange={() => setFreeDelivery((value) => !value)} />
            <p><strong>Бесплатно от суммы заказа</strong><small>Для доставки по Украине</small></p>
            <label><input defaultValue="2500" aria-label="Сумма бесплатной доставки" /><b>₴</b></label>
          </div>}
        </article>

        {pricingMode === "carrier" && hasApiCarrier && <article className="shp-setting-card package-defaults">
          <header><span><PackageCheck size={18} /></span><div><p className="eyebrow">Автоматический расчёт</p><h3>Вес и размеры посылки</h3></div><em>Если они не указаны у товара</em></header>
          <p className="shp-package-intro">Служба доставки рассчитывает цену по весу и объёму. Эти значения используются только как запасные — когда у конкретного товара нет своих данных.</p>
          <div className="shp-package-fields">
            <label><span>Вес <b>*</b></span><div><input defaultValue="1" inputMode="decimal" /><b>кг</b></div></label>
            <label><span>Длина</span><div><input defaultValue="30" inputMode="numeric" /><b>см</b></div></label>
            <label><span>Ширина</span><div><input defaultValue="20" inputMode="numeric" /><b>см</b></div></label>
            <label><span>Высота</span><div><input defaultValue="10" inputMode="numeric" /><b>см</b></div></label>
            <label><span>Страна происхождения</span><select defaultValue="UA"><option value="UA">Украина</option><option value="other">Другая страна</option></select></label>
          </div>
          <p className="shp-customs-note"><Globe2 size={14} /><span><strong>Для международной отправки</strong> Shopra возьмёт название, стоимость и вес из заказа. Для таможенной декларации у товара также понадобятся описание содержимого латиницей и код УКТ ЗЕД.</span></p>
        </article>}

        <article className="shp-setting-card automation">
          <header><span><Box size={18} /></span><div><p className="eyebrow">Автоматизация</p><h3>После получения заказа</h3></div></header>
          <div className={`shp-check-row ${hasApiCarrier ? "" : "disabled"}`}><Switch checked={autoWaybill && hasApiCarrier} label="Создавать накладную автоматически" onChange={() => setAutoWaybill((value) => !value)} disabled={!hasApiCarrier} /><span><strong>Создавать накладную</strong><small>{hasApiCarrier ? "Данные заказа подставятся автоматически" : "Доступно после подключения API"}</small></span><Printer size={17} /></div>
          <div className="shp-check-row"><Switch checked={notifyBuyer} label="Отправлять трек-номер покупателю" onChange={() => setNotifyBuyer((value) => !value)} /><span><strong>Отправлять добавленный трек‑номер</strong><small>Покупатель получит его после отправки</small></span><Send size={17} /></div>
        </article>
      </section>

      <footer className="shp-footer-note"><Truck size={18} /><p><strong>{hasApiCarrier ? "В заказе будет кнопка «Создать отправление»" : "В заказе видны все данные для отправки"}</strong><small>{hasApiCarrier ? "После создания можно распечатать накладную и следить за статусом доставки прямо в Shopra." : "Откройте заказ, перенесите адрес в кабинет службы и добавьте полученный трек‑номер."}</small></p></footer>
    </section>
  );
}
