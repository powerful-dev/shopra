// statisticsChart.js

import * as echarts from 'echarts';

const summaries = {
    today: {
        revenue: '27 430 ₴',
        labels: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', 'Сейчас'],
        revenueData: [2.1, 2.8, 3.4, 3.1, 4.2, 3.7, 4.6, 2.2, 1.33],
    },
};

export function initStatisticsChart(node) {
    if (!node) {
        return null;
    }

    const chart = echarts.init(node);
    const summary = summaries.today;

    chart.setOption({
        grid: {
            left: 54,
            right: 22,
            top: 24,
            bottom: 42,
        },

        tooltip: {
            trigger: 'axis',
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: summary.labels,
        },

        yAxis: {
            type: 'value',
        },

        series: [
            {
                type: 'line',
                data: summary.revenueData,
                symbol: 'circle',
                symbolSize: 7,

                lineStyle: {
                    width: 2.5,
                    color: '#b84f18',
                },

                itemStyle: {
                    color: '#fff',
                    borderColor: '#b84f18',
                    borderWidth: 2,
                },

                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(184,79,24,.16)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(184,79,24,0)',
                            },
                        ]
                    ),
                },
            },
        ],
    });

    const observer = new ResizeObserver(() => {
        chart.resize();
    });

    observer.observe(node);

    return () => {
        observer.disconnect();
        chart.dispose();
    };
}