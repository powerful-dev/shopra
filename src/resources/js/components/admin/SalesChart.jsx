import { useMemo, useState } from 'react';

export default function SalesChart({ series }) {
    const [period, setPeriod] = useState(7);
    const data = series[period];
    const points = useMemo(() => {
        const max = Math.max(...data);
        return data.map((value, index) => `${20 + index * 460 / (data.length - 1)},${190 - value / max * 150}`).join(' ');
    }, [data]);
    const labels = period === 7 ? ['19 июл.', '20 июл.', '21 июл.', '22 июл.', '23 июл.', '24 июл.', '25 июл.'] : ['26 июн.', '1 июл.', '6 июл.', '11 июл.', '16 июл.', '21 июл.', '25 июл.'];

    return <><div className="shopra-range-switch"><button className={period === 7 ? 'is-active' : ''} type="button" onClick={() => setPeriod(7)}>7 дней</button><button className={period === 30 ? 'is-active' : ''} type="button" onClick={() => setPeriod(30)}>30 дней</button></div><div className="shopra-chart"><div className="shopra-chart-y"><span>30K ₴</span><span>20K ₴</span><span>10K ₴</span><span>0 ₴</span></div><svg viewBox="0 0 500 220" role="img" aria-label={`График продаж за ${period} дней`}><defs><linearGradient id="shopraChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c55a1d" stopOpacity=".2" /><stop offset="1" stopColor="#c55a1d" stopOpacity="0" /></linearGradient></defs>{[40, 90, 140, 190].map((y) => <line key={y} x1="20" y1={y} x2="480" y2={y} />)}<polygon points={`20,190 ${points} 480,190`} fill="url(#shopraChartFill)" /><polyline points={points} />{data.map((value, index) => { const max = Math.max(...data); const x = 20 + index * 460 / (data.length - 1); const y = 190 - value / max * 150; return <circle key={`${x}-${value}`} cx={x} cy={y} r="3.8"><title>{`${value} 000 ₴`}</title></circle>; })}</svg><div className="shopra-chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div><div className="shopra-chart-callout"><span>Сегодня</span><strong>{period === 7 ? '27 430 ₴' : '31 240 ₴'}</strong></div></div></>;
}
