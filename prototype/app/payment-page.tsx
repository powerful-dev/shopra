"use client";

import {
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Landmark,
  Mail,
  ReceiptText,
  Send,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";

type ProviderId = "requisites" | "liqpay" | "wayforpay" | "mono";
type ProviderState = Record<ProviderId, boolean>;
type ProviderCredentials = {
  liqpayPublic: string;
  liqpayPrivate: string;
  wayMerchant: string;
  waySecret: string;
  monoToken: string;
};

const providers = {
  requisites: {
    name: "Оплата на реквизиты ФОП",
    short: "IBAN",
    tone: "iban",
    description: "Без API и комиссии сервиса. Реквизиты приходят покупателю на почту.",
    meta: "Ручная проверка оплаты",
  },
  liqpay: {
    name: "LiqPay",
    short: "LQ",
    tone: "liqpay",
    description: "Оплата картой, Apple Pay и Google Pay на странице оплаты.",
    meta: "Public key + Private key",
  },
  wayforpay: {
    name: "WayForPay",
    short: "W",
    tone: "way",
    description: "Карты, электронные кошельки и другие способы онлайн‑оплаты.",
    meta: "Merchant Account + Secret Key",
  },
  mono: {
    name: "plata by mono",
    short: "mono",
    tone: "mono",
    description: "Интернет‑эквайринг mono с автоматическим статусом платежа.",
    meta: "API‑токен",
  },
} as const;

function PaymentSwitch({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <button type="button" className={`pay-switch ${checked ? "active" : ""}`} aria-label={label} aria-pressed={checked} onClick={onChange}><span /></button>;
}

export function PaymentPage() {
  const [selected, setSelected] = useState<ProviderId>("requisites");
  const [enabled, setEnabled] = useState<ProviderState>({ requisites: false, liqpay: false, wayforpay: false, mono: false });
  const [showSecrets, setShowSecrets] = useState(false);
  const [message, setMessage] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [autoEmail, setAutoEmail] = useState(true);
  const [showOnSuccess, setShowOnSuccess] = useState(true);
  const [requisites, setRequisites] = useState({ owner: "", iban: "", taxId: "", bank: "", purpose: "Оплата заказа №{order_number}", subject: "Реквизиты для оплаты заказа №{order_number}", note: "После оплаты ответьте на это письмо или дождитесь подтверждения магазина." });
  const [credentials, setCredentials] = useState<ProviderCredentials>({ liqpayPublic: "", liqpayPrivate: "", wayMerchant: "", waySecret: "", monoToken: "" });

  const activeCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);
  const provider = providers[selected];

  const setRequisite = (field: keyof typeof requisites, value: string) => {
    setRequisites((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const setCredential = (field: keyof ProviderCredentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const methodIsReady = (id: ProviderId) => {
    if (id === "requisites") return Boolean(requisites.owner.trim() && requisites.iban.trim() && requisites.taxId.trim() && requisites.purpose.trim());
    if (id === "liqpay") return Boolean(credentials.liqpayPublic.trim() && credentials.liqpayPrivate.trim());
    if (id === "wayforpay") return Boolean(credentials.wayMerchant.trim() && credentials.waySecret.trim());
    return Boolean(credentials.monoToken.trim());
  };

  const connectMethod = () => {
    if (!methodIsReady(selected)) {
      setEnabled((current) => ({ ...current, [selected]: false }));
      setMessage("Заполните все обязательные поля — они отмечены звёздочкой.");
      return;
    }
    setEnabled((current) => ({ ...current, [selected]: true }));
    setMessage(selected === "requisites" ? "Реквизиты сохранены. Способ оплаты готов к работе." : "Данные проверены. Онлайн‑оплата подключена.");
  };

  const toggleMethod = (id: ProviderId) => {
    setSelected(id);
    setMessage("");
    if (enabled[id]) setEnabled((current) => ({ ...current, [id]: false }));
  };

  return (
    <section className="pay-page uk-animation-fade">
      <header className="pay-hero">
        <div>
          <p className="eyebrow">Настройки магазина</p>
          <h1>Оплата</h1>
          <p>Добавьте хотя бы один способ оплаты. Для начала можно просто отправлять покупателю реквизиты ФОП — без API и сложного подключения.</p>
        </div>
        <div className={`pay-readiness ${activeCount ? "ready" : ""}`}>
          <span>{activeCount ? <Check size={20} /> : <CreditCard size={20} />}</span>
          <p><small>{activeCount ? "Можно принимать заказы" : "Обязательная настройка"}</small><strong>{activeCount ? `${activeCount} ${activeCount === 1 ? "способ включён" : "способа включено"}` : "Добавьте способ оплаты"}</strong></p>
        </div>
      </header>

      <section className="pay-start-note">
        <span><Info size={16} /></span>
        <p><strong>Для запуска магазина нужен минимум один способ</strong><small>Самый простой — реквизиты ФОП. Онлайн‑эквайринг можно подключить позже.</small></p>
        <b>Обязательно</b>
      </section>

      <section className="pay-methods-section">
        <header className="pay-section-head"><div><p className="eyebrow">Готовые способы</p><h2>Как покупатель сможет оплатить</h2></div><span>{activeCount} активно</span></header>
        <div className="pay-method-layout">
          <div className="pay-method-list">
            {(Object.keys(providers) as ProviderId[]).map((id) => {
              const item = providers[id];
              return <article className={`pay-method-card ${selected === id ? "selected" : ""} ${id === "requisites" ? "recommended" : ""}`} key={id}>
                {id === "requisites" && <em>Самый простой</em>}
                <button type="button" className="pay-method-open" onClick={() => { setSelected(id); setMessage(""); }}>
                  <span className={`pay-provider-mark ${item.tone}`}>{item.short}</span>
                  <p><strong>{item.name}</strong><small>{item.description}</small></p>
                  <ChevronRight size={17} />
                </button>
                <div className="pay-method-meta"><span>{id === "requisites" ? <Mail size={12} /> : <ShieldCheck size={12} />}{item.meta}</span><b className={enabled[id] ? "active" : ""}>{enabled[id] ? "Включено" : "Не настроено"}</b><PaymentSwitch checked={enabled[id]} label={`${enabled[id] ? "Выключить" : "Настроить"} ${item.name}`} onChange={() => toggleMethod(id)} /></div>
              </article>;
            })}
          </div>

          <aside className="pay-settings-panel">
            <header><span className={`pay-provider-mark large ${provider.tone}`}>{provider.short}</span><div><p className="eyebrow">Настройка способа</p><h3>{provider.name}</h3></div><em className={enabled[selected] ? "active" : ""}>{enabled[selected] ? "Активен" : "Выключен"}</em></header>

            {selected === "requisites" ? <div className="pay-requisites-form">
              <div className="pay-simple-banner"><span><Landmark size={17} /></span><p><strong>Без ключей и платёжного сервиса</strong><small>Shopra только передаст покупателю ваши реквизиты. Оплату вы проверяете в банке и отмечаете вручную.</small></p></div>
              <div className="pay-field-grid">
                <label className="full"><span>Получатель — ФОП или компания <b>*</b></span><input value={requisites.owner} onChange={(event) => setRequisite("owner", event.target.value)} placeholder="Например, ФОП Панасенко Вадим" /></label>
                <label className="full"><span>IBAN <b>*</b></span><input value={requisites.iban} onChange={(event) => setRequisite("iban", event.target.value)} placeholder="UA00 0000 0000 0000 0000 0000 000" /></label>
                <label><span>ИНН / ЕДРПОУ <b>*</b></span><input value={requisites.taxId} onChange={(event) => setRequisite("taxId", event.target.value)} placeholder="Код получателя" /></label>
                <label><span>Название банка</span><input value={requisites.bank} onChange={(event) => setRequisite("bank", event.target.value)} placeholder="Например, АТ КБ ПриватБанк" /></label>
                <label className="full"><span>Назначение платежа <b>*</b></span><input value={requisites.purpose} onChange={(event) => setRequisite("purpose", event.target.value)} /><small>Переменная {"{order_number}"} автоматически заменится номером заказа.</small></label>
              </div>
              <div className="pay-send-options">
                <div><PaymentSwitch checked={autoEmail} label="Отправлять реквизиты на почту" onChange={() => setAutoEmail((value) => !value)} /><p><strong>Отправлять на почту</strong><small>Сразу после оформления заказа</small></p><Mail size={16} /></div>
                <div><PaymentSwitch checked={showOnSuccess} label="Показывать реквизиты после заказа" onChange={() => setShowOnSuccess((value) => !value)} /><p><strong>Показывать после заказа</strong><small>На странице «Заказ принят»</small></p><ReceiptText size={16} /></div>
              </div>
            </div> : <div className="pay-api-form">
              <div className="pay-api-title"><span><KeyRound size={17} /></span><p><strong>Данные подключения</strong><small>Поля обязательны, секреты хранятся в зашифрованном виде</small></p><button type="button" aria-label={showSecrets ? "Скрыть ключи" : "Показать ключи"} onClick={() => setShowSecrets((value) => !value)}>{showSecrets ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
              {selected === "liqpay" && <div className="pay-field-grid"><label className="full"><span>Public key <b>*</b></span><input value={credentials.liqpayPublic} onChange={(event) => setCredential("liqpayPublic", event.target.value)} placeholder="Публичный ключ компании" /></label><label className="full"><span>Private key <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.liqpayPrivate} onChange={(event) => setCredential("liqpayPrivate", event.target.value)} placeholder="Секретный ключ API" /></label></div>}
              {selected === "wayforpay" && <div className="pay-field-grid"><label className="full"><span>Merchant Account <b>*</b></span><input value={credentials.wayMerchant} onChange={(event) => setCredential("wayMerchant", event.target.value)} placeholder="Идентификатор магазина" /></label><label className="full"><span>Merchant Secret Key <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.waySecret} onChange={(event) => setCredential("waySecret", event.target.value)} placeholder="Секретный ключ магазина" /></label></div>}
              {selected === "mono" && <div className="pay-field-grid"><label className="full"><span>API‑токен эквайринга <b>*</b></span><input type={showSecrets ? "text" : "password"} value={credentials.monoToken} onChange={(event) => setCredential("monoToken", event.target.value)} placeholder="Токен из веб‑кабинета mono" /><small>Веб‑кабинет → Интеграции → На мой сайт.</small></label></div>}
              <div className="pay-test-mode"><PaymentSwitch checked={testMode} label="Тестовый режим" onChange={() => setTestMode((value) => !value)} /><p><strong>Тестовый режим</strong><small>Проверьте оплату до включения реальных платежей</small></p><em>{testMode ? "Включён" : "Боевой режим"}</em></div>
              <p className="pay-api-capabilities"><WalletCards size={15} /><span><strong>Статус заказа обновится автоматически</strong> после подтверждения платежа сервисом.</span></p>
            </div>}

            {message && <p className={`pay-form-message ${enabled[selected] ? "success" : "warning"}`}>{enabled[selected] ? <Check size={14} /> : <Info size={14} />}{message}</p>}
            <div className="pay-save-actions"><button type="button" className="primary" onClick={connectMethod}>{enabled[selected] ? "Сохранить изменения" : selected === "requisites" ? "Сохранить и включить" : "Проверить и подключить"}</button>{selected !== "requisites" && <button type="button">Где взять ключи?</button>}</div>
          </aside>
        </div>
      </section>

      {selected === "requisites" && <section className="pay-email-preview">
        <header><span><Mail size={18} /></span><div><p className="eyebrow">Письмо покупателю</p><h2>Как придут реквизиты</h2></div><button type="button"><Copy size={14} /> Копировать текст</button></header>
        <div className="pay-email-card"><div className="pay-email-top"><span><Building2 size={15} /></span><p><small>Тема письма</small><strong>{requisites.subject}</strong></p></div><div className="pay-email-body"><p>Здравствуйте! Ваш заказ <strong>№1048</strong> принят.</p><p>Для оплаты используйте реквизиты:</p><dl><div><dt>Получатель</dt><dd>{requisites.owner || "ФОП / компания"}</dd></div><div><dt>IBAN</dt><dd>{requisites.iban || "UA•• •••• •••• •••• •••• •••• •••"}</dd></div><div><dt>ИНН / ЕДРПОУ</dt><dd>{requisites.taxId || "••••••••••"}</dd></div><div><dt>Назначение</dt><dd>{requisites.purpose.replace("{order_number}", "1048")}</dd></div></dl><p className="note">{requisites.note}</p></div></div>
      </section>}

      <footer className="pay-footer-note"><CircleDollarSign size={18} /><p><strong>Shopra не хранит данные карт покупателей</strong><small>Онлайн‑оплату обрабатывает выбранный платёжный сервис, а в Shopra возвращается только статус платежа.</small></p><Send size={16} /></footer>
    </section>
  );
}
