const summaries = [
    ['Новые', '1', 'bg-[#fff0e7] text-[color:var(--color-accent)]', 'bag'],
    ['Оплачены', '6', 'bg-[color:var(--color-success-soft)] text-[color:var(--color-success)]', 'paid'],
    ['К отправке', '1', 'bg-[#fff1e8] text-[#b55720]', 'ready'],
    ['В пути', '1', 'bg-[#eaf0f8] text-[#42658e]', 'truck'],
];
const filters = ['Все', 'Новые', 'Ждут оплату', 'Оплачены', 'В работе', 'К отправке', 'Отправлены', 'Выполнены', 'Отменены'];
const orders = [
    ['#1048','1 авг. 2026 · 12:42','А','Анна Смирнова','+380 67 123 45 67','Оплачено','text-[color:var(--color-success)]','Нова пошта','Отделение','Новый','status-badge--new','3 520 ₴',true],
    ['#1047','1 авг. 2026 · 11:18','Д','Дмитрий Коваленко','+380 93 540 28 11','Ждём перевод','text-[#a46b35]','Укрпошта','Отделение','Ожидает оплаты','bg-[#fff5de] text-[#9a6a14]','5 890 ₴'],
    ['#1046','1 авг. 2026 · 10:36','О','Ольга Петрова','+380 50 887 41 02','Оплачено','text-[color:var(--color-success)]','Нова пошта','Почтомат','Оплачен','status-badge--paid','2 450 ₴'],
    ['#1045','31 июл. 2026 · 18:04','С','Сергей Иванов','+380 68 201 76 43','Оплачено','text-[color:var(--color-success)]','Нова пошта','Курьер','В работе','bg-[#f1ecf8] text-[#77559a]','7 100 ₴'],
    ['#1044','31 июл. 2026 · 16:27','Е','Елена Васильева','+380 97 332 14 08','Оплачено','text-[color:var(--color-success)]','Нова пошта','Отделение','Готов к отправке','bg-[#fff1e8] text-[#b55720]','4 300 ₴'],
    ['#1043','31 июл. 2026 · 13:51','М','Мария Бондаренко','+380 63 177 52 09','Оплачено','text-[color:var(--color-success)]','Нова пошта','20450987654321','Отправлен','bg-[#eaf0f8] text-[#42658e]','6 840 ₴'],
    ['#1042','30 июл. 2026 · 17:12','А','Андрей Мельник','+380 66 908 33 15','Оплачено','text-[color:var(--color-success)]','Укрпошта','RT392184705UA','Выполнен','bg-[#e9f5ec] text-[#347647]','4 970 ₴'],
    ['#1041','30 июл. 2026 · 12:33','Н','Наталья Шевченко','+380 95 442 71 90','Не оплачено','text-[#837a73]','Укрпошта','Отделение','Отменён','bg-[#fff0ef] text-[#b7483f]','2 190 ₴'],
];
const rowClass = 'data-list__item !min-h-[150px] !grid-cols-[1fr_auto] !gap-2 !rounded-none !border-x-0 !border-b !border-t-0 !px-[11px] !py-2 max-md:!rounded-[10px] max-md:!border max-md:!p-[10px] md:!min-h-[150px] md:!grid-cols-[1fr_auto] md:!gap-[7px] md:!rounded-[10px] md:!border md:!p-[10px] 2xl:!min-h-[68px] 2xl:!grid-cols-[95px_minmax(135px,1.1fr)_85px_95px_minmax(125px,max-content)_76px] 2xl:!rounded-none 2xl:!border-x-0 2xl:!border-t-0 2xl:!px-[11px] 2xl:!py-2';

export default function OrdersPage() {
    return <>
        <section className="mb-[18px] flex flex-wrap items-end justify-between gap-6 max-sm:items-start">
            <div className="max-w-[720px]"><p className="mb-[3px] text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)]">Продажи</p><h1 className="m-0 text-[32px] font-[760] tracking-[-0.05em] text-[color:var(--color-primary)] max-sm:text-[27px]">Заказы</h1><p className="mt-[5px] text-[13px] leading-[1.5] text-[color:var(--color-secondary)]">Находите заказы по номеру, покупателю, телефону или трек‑номеру и ведите их от оплаты до доставки.</p></div>
            <button type="button" className="button button--secondary min-h-[41px] whitespace-nowrap max-sm:w-full"><Icon type="file" />Экспорт заказов</button>
        </section>
        <section className="mb-3 grid grid-cols-2 gap-2 sm:gap-[10px] xl:grid-cols-4">{summaries.map(([label,value,tone,icon]) => <article key={label} className="flex items-center gap-[10px] rounded-[13px] border border-[color:var(--color-border)] bg-white px-[13px] py-[12px] shadow-[0_8px_24px_rgba(70,47,31,.035)]"><span className={`grid h-9 w-9 flex-none place-items-center rounded-[10px] ${tone}`}><Icon type={icon} /></span><p className="m-0 flex flex-col"><small className="text-[11px] font-[700] text-[#756d67]">{label}</small><strong className="mt-[2px] text-[18px] leading-none tracking-[-0.04em]">{value}</strong></p></article>)}</section>
        <section className="grid items-start gap-3 2xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,.65fr)]">
            <div className="min-w-0 overflow-hidden rounded-[15px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-[7px] border-b border-[#eee9e5] p-[11px] max-sm:grid max-sm:grid-cols-1"><label className="flex h-[39px] min-w-0 flex-1 items-center gap-2 rounded-[9px] border border-[color:var(--color-border)] bg-white px-2 text-[#958c85] focus-within:border-[#c78661] focus-within:shadow-[0_0_0_3px_rgba(184,79,24,.06)]"><Icon type="search" /><input className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-[#514943] outline-none" placeholder="Номер, покупатель, телефон или трек‑номер" /></label><button type="button" className="button button--outline min-h-[39px] px-[10px] text-[11px] max-sm:w-full"><Icon type="filter" />Фильтры<Icon type="down" /></button></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#eee9e5] p-[8px_10px] [scrollbar-width:none]">{filters.map((filter,i) => <button type="button" key={filter} className={`flex min-h-[30px] flex-none items-center gap-[5px] rounded-[7px] border px-2 text-[11px] font-[690] ${i === 0 ? 'border-[#e3c0ab] bg-[#fff6f0] text-[color:var(--color-accent)]' : 'border-transparent text-[#7d746d]'}`}>{filter}<b className={`${i === 0 ? 'min-w-[17px] bg-white py-[2px]' : 'bg-[#f1edeb]'} rounded-full px-1`}>{i === 0 ? 8 : 1}</b></button>)}</div>
                <div className="grid min-h-[35px] grid-cols-[95px_minmax(135px,1.1fr)_85px_95px_minmax(125px,max-content)_76px] items-center gap-2 border-b border-[#eee9e5] bg-[#faf8f6] px-[11px] text-[11px] font-[760] uppercase tracking-[.035em] text-[#9a918a] max-2xl:hidden"><span>Заказ</span><span>Покупатель</span><span>Оплата</span><span>Доставка</span><span>Статус</span><span>Сумма</span></div>
                <div className="data-list data-list--uniform-typography grid !min-h-0 gap-2 bg-[#faf8f6] !p-2 md:grid-cols-2 2xl:block 2xl:gap-0 2xl:bg-transparent 2xl:!p-0">{orders.map((order) => <OrderRow key={order[0]} order={order} />)}</div>
            </div>
            <OrderDetails />
        </section>
    </>;
}

function OrderRow({ order: [id,date,initial,customer,phone,payment,paymentTone,delivery,deliveryDetail,status,statusTone,amount,selected] }) {
    return <button type="button" className={`${rowClass} ${selected ? '!bg-[#fffaf6] !shadow-[inset_3px_0_var(--color-accent)]' : ''}`}>
        <span className="flex min-w-0 flex-col"><strong className="text-[12px] text-[#413b36]">{id}</strong><small className="mt-[3px] text-[11px] text-[#958c85]">{date}</small></span>
        <span className="col-span-2 grid min-w-0 grid-cols-[30px_minmax(0,1fr)] items-center gap-[7px] 2xl:col-span-1"><b className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-[#f3efec] text-[12px] text-[#796f68]">{initial}</b><span className="flex min-w-0 flex-col"><strong className="truncate text-[11px] text-[#524a44]">{customer}</strong><small className="mt-[3px] text-[11px] text-[#958c85]">{phone}</small></span></span>
        <span className={`flex items-center gap-1 text-[11px] font-[690] before:h-[6px] before:w-[6px] before:rounded-full before:bg-current before:content-[''] ${paymentTone}`}>{payment}</span>
        <span className="col-span-2 flex min-w-0 flex-col 2xl:col-span-1"><strong className="truncate text-[11px]">{delivery}</strong><small className="mt-[3px] text-[11px] text-[#958c85]">{deliveryDetail}</small></span>
        <span className={`status-badge col-start-2 row-start-3 2xl:col-auto 2xl:row-auto ${statusTone}`}>{status}</span>
        <span className={selected
            ? 'flex items-center justify-between gap-1 md:col-span-2 md:border-t md:border-[#eee9e5] md:pt-[7px] 2xl:col-span-1 2xl:border-0 2xl:pt-0'
            : 'col-span-2 flex justify-between border-t pt-[7px] 2xl:col-span-1 2xl:border-0 2xl:pt-0'}><strong className="text-[11px]">{amount}</strong><Icon type="right" /></span>
    </button>;
}

function OrderDetails() {
    return <aside className="sticky top-[86px] overflow-hidden rounded-[15px] border border-[color:var(--color-border)] bg-[#faf8f6] shadow-[var(--shadow-sm)] max-2xl:static max-2xl:grid max-2xl:grid-cols-2 max-md:grid-cols-1">
        <header className="col-span-full flex min-h-[72px] items-center justify-between gap-[9px] border-b border-[#eae5e1] bg-white p-[11px_12px]"><div><p className="m-0 text-[10px] font-[760] uppercase tracking-[.08em] text-[color:var(--color-accent)]">Заказ</p><h2 className="mt-0.5 text-[15px]">#1048</h2><small className="text-[11px] text-[#928981]">1 авг. 2026 в 12:42</small></div><span className="status-badge status-badge--new">Новый</span></header>
        <div className="col-span-full m-[9px_10px_0] grid grid-cols-[16px_minmax(0,1fr)] gap-[5px] rounded-lg bg-[color:var(--color-success-soft)] p-2 text-[11px] leading-[1.4] text-[#3e7949]"><Icon type="info" /><span>Оплата получена. Заказ можно передавать в работу.</span></div>
        <div className="col-span-full px-[11px] pt-[10px]"><label className="flex flex-col gap-1"><span className="text-[11px] font-[740] text-[#756c65]">Статус заказа</span><select defaultValue="Новый" className="h-9 rounded-lg border border-[color:var(--color-border)] bg-white px-2 text-[11px] text-[#514943] outline-none">{['Новый','Ожидает оплаты','Оплачен','В работе','Готов к отправке','Отправлен','Выполнен','Отменён'].map(s => <option key={s}>{s}</option>)}</select></label></div>
        <Card icon="user" title="Покупатель"><p className="m-0 flex flex-col pl-[35px]"><b className="text-[11px]">Анна Смирнова</b><a className="mt-1 text-[11px] text-[#817871]" href="tel:+380671234567">+380 67 123 45 67</a><a className="mt-1 text-[11px] text-[#817871]" href="mailto:anna.smyrnova@gmail.com">anna.smyrnova@gmail.com</a></p></Card>
        <Card icon="box" title="Товары" extra="1 шт."><div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2 border-t border-[#f0ece8] py-[7px]"><span className="grid h-[38px] w-[38px] place-items-center rounded-lg bg-[#b6784f] text-white">C</span><p className="m-0 flex min-w-0 flex-col"><strong className="text-[11px]">Кожаный рюкзак City</strong><small className="mt-[3px] text-[11px] text-[#938a83]">Коньяк · Стандартный · 1 шт.</small></p><b className="text-[11px]">3 520 ₴</b></div><div className="flex justify-between border-t border-[#f0ece8] pt-[7px] text-[11px]"><strong>Итого</strong><b>3 520 ₴</b></div></Card>
        <Card icon="card" title="Оплата" extra="Оплачено" extraClass="text-[color:var(--color-success)]"><Rows rows={[['Способ','plata by mono'],['Сумма','3 520 ₴']]} /></Card>
        <Card icon="truck" title="Доставка" extra="API подключён" extraClass="rounded-full bg-[#eaf6ec] px-[6px] py-1 text-[color:var(--color-success)]"><Rows rows={[['Служба','Нова пошта · Отделение'],['Куда','Одесса, отделение №24']]} /><button type="button" className="button button--primary mt-2 min-h-9 w-full text-[16px]"><Icon type="plus" />Создать накладную</button></Card>
        <div className="col-span-full m-[8px_10px_10px] flex items-start gap-[7px] rounded-[9px] bg-[#fff8f3] p-[9px] text-[color:var(--color-accent)]"><Icon type="info" /><p className="m-0 flex flex-col"><strong className="text-[11px] text-[#5a514b]">Комментарий покупателя</strong><span className="mt-[3px] text-[11px] text-[#80766f]">Позвонить перед отправкой</span></p></div>
    </aside>;
}
function Card({ icon,title,extra,extraClass='text-[#918880]',children }) { return <section className="m-[8px_10px_0] rounded-[10px] border border-[color:var(--color-border)] bg-white p-[9px]"><header className="mb-2 flex items-center gap-[7px]"><span className="grid h-7 w-7 place-items-center rounded-[7px] bg-[#f4efeb] text-[color:var(--color-accent)]"><Icon type={icon} /></span><strong className="mr-auto text-[11px]">{title}</strong>{extra && <em className={`text-[11px] not-italic ${extraClass}`}>{extra}</em>}</header>{children}</section>; }
function Rows({ rows }) { return <dl className="m-0">{rows.map(([term,value]) => <div key={term} className="grid grid-cols-[66px_1fr] gap-2 border-t border-[#f0ece8] py-[5px] text-[11px]"><dt className="text-[#978e87]">{term}</dt><dd className="m-0 text-right font-[680]">{value}</dd></div>)}</dl>; }

const paths = {
 file:<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/></>,
 bag:<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0"/>,
 paid:<><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6"/></>,
 ready:<path d="m16 16 2 2 4-4M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M3.29 7 12 12l8.71-5"/>,
 truck:<><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></>,
 search:<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>, filter:<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>, down:<path d="m6 9 6 6 6-6"/>, right:<path d="m9 18 6-6-6-6"/>, info:<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>, user:<><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></>, box:<><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></>, card:<><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></>, plus:<path d="M5 12h14M12 5v14"/>
};
function Icon({ type }) { const size = ['file','box','card','user','truck','plus'].includes(type) ? 15 : type === 'down' ? 13 : type === 'filter' ? 14 : type === 'right' ? 15 : type === 'info' ? 16 : 17; return <svg className="flex-none" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>; }
