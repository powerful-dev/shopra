const points = [
    [18, 166.923077, '2 000 ₴'], [75.75, 143.846154, '4 000 ₴'], [133.5, 155.384615, '3 000 ₴'],
    [191.25, 109.230769, '7 000 ₴'], [249, 132.307692, '5 000 ₴'], [306.75, 86.153846, '9 000 ₴'],
    [364.5, 97.692308, '8 000 ₴'], [422.25, 62.961538, '11 000 ₴'], [480, 40, '13 000 ₴'],
];

export default function SalesChart() {
    return (
        <div className="chart-wrap">
            <div className="chart-y"><span>30K ₴</span><span>20K ₴</span><span>10K ₴</span><span>0 ₴</span></div>
            <svg className="sales-chart" viewBox="0 0 500 220" role="img" aria-label="График продаж за сегодня">
                <defs><linearGradient id="dashboardChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c55a1d" stopOpacity=".2" /><stop offset="100%" stopColor="#c55a1d" stopOpacity="0" /></linearGradient></defs>
                {[40, 90, 140, 190].map((y) => <line key={y} x1="18" y1={y} x2="480" y2={y} className="chart-grid" />)}
                <polygon points="18,190 18,166.923077 75.75,143.846154 133.5,155.384615 191.25,109.230769 249,132.307692 306.75,86.153846 364.5,97.692308 422.25,62.961538 480,40 480,190" fill="url(#dashboardChartFill)" />
                <polyline points="18,166.923077 75.75,143.846154 133.5,155.384615 191.25,109.230769 249,132.307692 306.75,86.153846 364.5,97.692308 422.25,62.961538 480,40" className="chart-line" />
                {points.map(([cx, cy, title]) => <circle key={title} cx={cx} cy={cy} r="4" className="chart-dot"><title>{title}</title></circle>)}
            </svg>
            <div className="chart-labels">{['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', 'Сейчас'].map((label) => <span key={label}>{label}</span>)}</div>
            <div className="chart-callout"><span>Сейчас</span><strong>13 780 ₴</strong></div>
        </div>
    );
}
