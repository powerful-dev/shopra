(function () {
  const summaries = {
    today: { revenue: '27 430 ₴', orders: '8', visits: '246', conversion: '3,3%', delta: '+8%', labels: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', 'Сейчас'], revenueData: [2.1, 2.8, 3.4, 3.1, 4.2, 3.7, 4.6, 2.2, 1.33], ordersData: [0, 1, 1, 1, 2, 1, 1, 1, 0], visitsData: [14, 21, 25, 31, 36, 39, 34, 28, 18] },
    7: { revenue: '126 480 ₴', orders: '37', visits: '1 420', conversion: '2,6%', delta: '+12%', labels: ['26 июл.', '27 июл.', '28 июл.', '29 июл.', '30 июл.', '31 июл.', '1 авг.'], revenueData: [15, 21, 18, 17, 23, 20, 12.48], ordersData: [4, 6, 5, 5, 7, 6, 4], visitsData: [170, 245, 220, 205, 248, 225, 107] },
    30: { revenue: '492 760 ₴', orders: '142', visits: '5 890', conversion: '2,4%', delta: '+18%', labels: ['3 июл.', '5 июл.', '8 июл.', '10 июл.', '13 июл.', '16 июл.', '18 июл.', '21 июл.', '24 июл.', '26 июл.', '29 июл.', '1 авг.'], revenueData: [34.2, 41.8, 38.5, 44.1, 39.6, 48.3, 42.9, 51.7, 45.6, 49.9, 39.7, 16.46], ordersData: [9, 11, 10, 12, 11, 14, 12, 15, 13, 14, 15, 6], visitsData: [390, 480, 450, 520, 470, 570, 530, 600, 550, 580, 630, 120] },
    year: { revenue: '3 842 900 ₴', orders: '1 086', visits: '46 240', conversion: '2,3%', delta: '+31%', labels: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.'], revenueData: [480, 530, 505, 575, 610, 660, 482.9], ordersData: [135, 148, 142, 160, 170, 183, 148], visitsData: [5950, 6400, 6100, 6800, 7200, 7600, 6190] },
  };
  const campaigns = [
    { kind: 'sale', name: 'Летняя распродажа', detail: 'Распродажа · Выбранные модификации', discount: '−20%', result: '86 покупок', orders: 34, revenue: '38 420 ₴', status: 'Активна' },
    { kind: 'offer', name: 'Брошенная корзина', detail: 'Автопредложение · Отправлено 78', discount: '−15%', result: '15,4% конверсия', orders: 12, revenue: '15 980 ₴', status: 'Активно' },
    { kind: 'offer', name: 'После добавления в избранное', detail: 'Автопредложение · Отправлено 202', discount: '−10%', result: '8,9% конверсия', orders: 18, revenue: '22 240 ₴', status: 'Активно' },
    { kind: 'offer', name: 'Для тех, кто уже покупал', detail: 'Автопредложение · Отправлено 20', discount: '−15%', result: '30% конверсия', orders: 6, revenue: '8 940 ₴', status: 'Активно' },
    { kind: 'promo', name: 'WELCOME10', detail: 'Промокод · Использован 41 раз', discount: '−10%', result: '41 использование', orders: 41, revenue: '52 380 ₴', status: 'Активен' },
  ];
  const products = [
    { name: 'Кожаный рюкзак FOREST', category: 'Рюкзаки', tone: 'olive', views: 1284, favorites: 146, carts: 58, orders: 31, revenue: 170190, conversion: '2,4%' },
    { name: 'Сумка через плечо ALICE', category: 'Сумки', tone: 'cognac', views: 1086, favorites: 128, carts: 47, orders: 27, revenue: 103950, conversion: '2,5%' },
    { name: 'Мессенджер HUNTER', category: 'Мессенджеры', tone: 'coffee', views: 842, favorites: 91, carts: 36, orders: 22, revenue: 103180, conversion: '2,6%' },
    { name: 'Мини-рюкзак HANNA', category: 'Рюкзаки', tone: 'wine', views: 718, favorites: 84, carts: 29, orders: 18, revenue: 59220, conversion: '2,5%' },
    { name: 'Сумка для ноутбука RALPH', category: 'Для ноутбука', tone: 'navy', views: 602, favorites: 52, carts: 21, orders: 12, revenue: 61800, conversion: '2,0%' },
  ];
  const chartNode = document.querySelector('[data-statistics-chart]');
  if (!chartNode || !window.echarts) return;
  const chart = window.echarts.init(chartNode);
  let period = 'today';
  let metric = 'revenue';

  function chartOption() {
    const summary = summaries[period] || summaries[30];
    const data = summary[`${metric}Data`];
    return { animationDuration: 350, grid: { left: 54, right: 22, top: 24, bottom: 42 }, tooltip: { trigger: 'axis', backgroundColor: '#2f2925', borderWidth: 0, textStyle: { color: '#fff', fontSize: 12 }, padding: [8, 10], valueFormatter: (value) => metric === 'revenue' ? `${new Intl.NumberFormat('ru-RU').format(value * 1000)} ₴` : new Intl.NumberFormat('ru-RU').format(value) }, xAxis: { type: 'category', boundaryGap: false, data: summary.labels, axisLine: { lineStyle: { color: '#ded8d2' } }, axisTick: { show: false }, axisLabel: { color: '#8d857e', fontSize: 11, hideOverlap: true } }, yAxis: { type: 'value', splitNumber: 4, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#eee9e5' } }, axisLabel: { color: '#8d857e', fontSize: 11, formatter: (value) => metric === 'revenue' ? `${value} тыс.` : value } }, series: [{ type: 'line', data, smooth: false, symbol: 'circle', symbolSize: 7, lineStyle: { width: 2.5, color: '#b84f18' }, itemStyle: { color: '#fff', borderColor: '#b84f18', borderWidth: 2 }, areaStyle: { color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(184,79,24,.16)' }, { offset: 1, color: 'rgba(184,79,24,0)' }]) }, emphasis: { scale: 1.4 } }] };
  }
  function renderChart() { chart.setOption(chartOption(), true); }
  function updateSummary() {
    const summary = summaries[period] || summaries[30];
    ['revenue', 'orders', 'visits', 'conversion'].forEach((key) => { const node = document.querySelector(`[data-kpi="${key}"]`); if (node) node.textContent = summary[key]; });
    document.querySelector('[data-kpi-delta]').textContent = `${summary.delta} к прошлому периоду`;
    const names = { revenue: 'Выручка', orders: 'Заказы', visits: 'Посещения' };
    document.querySelector('[data-chart-title]').textContent = names[metric];
    document.querySelector('[data-chart-total]').textContent = metric === 'revenue' ? summary.revenue : metric === 'orders' ? `${summary.orders} заказов` : `${summary.visits} посещений`;
    renderChart();
  }
  function setActive(nodes, selected, activeClasses) { nodes.forEach((node) => { const active = node === selected; node.setAttribute('aria-pressed', String(active)); activeClasses.forEach((name) => node.classList.toggle(name, active)); }); }
  function customLabels(from, to, count) {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return summaries[30].labels;
    return Array.from({ length: count }, (_, index) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(start.getTime() + ((end - start) * index) / (count - 1))));
  }
  document.addEventListener('click', (event) => {
    const periodButton = event.target.closest('[data-period]');
    if (periodButton) { period = periodButton.dataset.period; if (period === 'custom') { summaries.custom = { ...summaries[30], labels: customLabels(document.querySelector('[data-date-from]').value, document.querySelector('[data-date-to]').value, summaries[30].labels.length) }; } const buttons = document.querySelectorAll('[data-period]'); setActive(buttons, periodButton, 'bg-white text-[color:var(--color-accent)] shadow-[0_2px_7px_rgba(59,40,28,.08)]'.split(' ')); buttons.forEach((node) => node.classList.toggle('text-[#756c65]', node !== periodButton)); updateSummary(); }
    const metricButton = event.target.closest('[data-metric]');
    if (metricButton) { metric = metricButton.dataset.metric; document.querySelectorAll('[data-metric]').forEach((node) => { const active = node === metricButton; node.setAttribute('aria-pressed', String(active)); node.classList.toggle('border-[#d7a88e]', active); node.classList.toggle('bg-[#fffaf7]', active); }); updateSummary(); }
    const promoButton = event.target.closest('[data-promo]'); if (promoButton) { document.querySelectorAll('[data-promo]').forEach((node) => { const active = node === promoButton; node.classList.toggle('border-[#e3c0ab]', active); node.classList.toggle('bg-[#fff6f0]', active); node.classList.toggle('text-[color:var(--color-accent)]', active); }); renderCampaigns(promoButton.dataset.promo); }
  });
  function campaignIcon(kind) {
    if (kind === 'sale') return '<span class="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-[#f9eee7] text-[color:var(--color-accent)] max-md:col-start-1 max-md:row-start-1"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1 0-6.76Z"></path><path d="m15 9-6 6"></path><path d="M9 9h.01"></path><path d="M15 15h.01"></path></svg></span>';
    if (kind === 'offer') return '<span class="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-[#f6edf2] text-[#a14f78] max-md:col-start-1 max-md:row-start-1"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></span>';
    return '<span class="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-[#edf3fa] text-[#42658e] max-md:col-start-1 max-md:row-start-1"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg></span>';
  }
  function productArt(tone) {
    const colors = { olive: ['#5f654a', '#454a36'], cognac: ['#a75b32', '#81431f'], coffee: ['#5a392b', '#40281e'], wine: ['#70423b', '#4f2f2a'], navy: ['#344759', '#25333f'] }[tone];
    return `<span class="relative inline-block h-[49px] w-[41px] flex-none overflow-hidden rounded-lg bg-[linear-gradient(150deg,#eee8e2,#faf8f6)] align-middle"><i class="absolute bottom-1 left-[9px] right-[9px] h-[34px] rounded-[6px_6px_8px_8px]" style="background:${colors[0]};box-shadow:inset 0 -7px rgba(50,25,14,.1)"><span class="absolute -top-[10px] left-[5px] h-[15px] w-[11px] rounded-t-lg border-2 border-b-0" style="border-color:${colors[1]}"></span><b class="absolute left-1 right-1 top-2 h-px bg-[rgba(255,255,255,.35)]"></b><em class="absolute left-[9px] top-3 h-[6px] w-[6px] rounded-sm bg-[#d8a274]"></em></i></span>`;
  }
  function dataListStat(label, value, mobilePlacement, extra = '') { return `<span class="flex items-center justify-between gap-2 text-left text-[11px] ${mobilePlacement} max-md:w-full max-md:border-t max-md:border-[#f0ece8] max-md:pt-[5px]" data-label="${label}"><small class="hidden text-[11px] text-[#9a928b] max-md:block">${label}</small><span class="text-left text-[11px] ${extra}">${value}</span></span>`; }
  function campaignStat(label, value, extra = '') { return dataListStat(label, value, 'max-md:col-start-2 max-md:col-span-2', extra); }
  function renderCampaigns(filter = 'all') { document.querySelector('[data-promo-rows]').innerHTML = campaigns.filter((item) => filter === 'all' || item.kind === filter).map((item) => `<div class="data-list__item !min-h-[67px] !grid-cols-[38px_minmax(215px,1.4fr)_65px_105px_50px_95px_78px] !gap-2 !rounded-none !border-x-0 !border-t !border-b-0 !px-[15px] !py-[7px] !text-left !text-[11px] max-md:!min-h-0 max-md:!grid-cols-[35px_minmax(0,1fr)_auto] max-md:!gap-[7px] max-md:!px-[11px] max-md:!py-[10px]" role="row">${campaignIcon(item.kind)}<span class="flex min-w-0 flex-col max-md:col-start-2 max-md:col-span-2"><strong class="truncate text-[11px] text-[#3f3934]">${item.name}</strong><small class="mt-0.5 text-[11px] text-[#9a928b]">${item.detail}</small></span>${campaignStat('Скидка', item.discount, 'font-bold text-[color:var(--color-accent-dark)]')}${campaignStat('Результат', item.result, 'text-[#716860]')}${campaignStat('Заказы', item.orders)}${campaignStat('Выручка', item.revenue, 'font-bold text-[#3f3934]')}${campaignStat('Статус', `<em class="flex w-fit items-center gap-[3px] rounded-full bg-[#eef8ee] px-[6px] py-[5px] text-[11px] font-bold not-italic text-[#2e8b45]"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>${item.status}</em>`)}</div>`).join(''); }
  function productStat(label, value, extra = '') { return dataListStat(label, value, 'max-md:col-start-3 max-md:col-span-1', extra); }
  function renderProducts() { const query = document.querySelector('[data-product-search]').value.toLowerCase(); const sort = document.querySelector('[data-product-sort]').value; document.querySelector('[data-product-rows]').innerHTML = products.filter((item) => item.name.toLowerCase().includes(query)).sort((a, b) => b[sort] - a[sort]).map((item, index) => `<div class="data-list__item !min-h-[72px] !grid-cols-[24px_45px_minmax(205px,1.5fr)_repeat(4,minmax(70px,.55fr))_minmax(95px,.7fr)_65px] !gap-2 !rounded-none !border-x-0 !border-t-0 !px-[15px] !py-[7px] !text-left !text-[11px] max-md:!min-h-0 max-md:!grid-cols-[21px_44px_minmax(0,1fr)] max-md:!gap-[7px] max-md:!px-[11px] max-md:!py-[10px]"><b class="text-left text-[10px] font-bold text-[#a59d97]">${index + 1}</b>${productArt(item.tone)}<span class="flex min-w-0 flex-col"><strong class="truncate text-[11px] text-[#3f3934]">${item.name}</strong><small class="mt-0.5 text-[11px] text-[#9a928b]">${item.category}</small></span>${productStat('Просмотры', item.views.toLocaleString('ru-RU'))}${productStat('Избранное', item.favorites)}${productStat('В корзину', item.carts)}${productStat('Продано', item.orders, 'font-bold text-[#3f3934]')}${productStat('Выручка', `${item.revenue.toLocaleString('ru-RU')} ₴`, 'font-bold text-[#4e4741]')}${productStat('Конверсия', item.conversion, 'font-bold text-[color:var(--color-success)]')}</div>`).join(''); }
  document.querySelector('[data-product-search]').addEventListener('input', renderProducts);
  document.querySelector('[data-product-sort]').addEventListener('change', renderProducts);
  new ResizeObserver(() => chart.resize()).observe(chartNode);
  renderCampaigns(); renderProducts(); updateSummary();
  window.shopraStatistics = { chart, summaries, setData(next) { Object.assign(summaries, next); updateSummary(); } };
})();
