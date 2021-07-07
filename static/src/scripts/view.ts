import { build, append } from './util';
import { Chart } from 'chart.js';

const tabs = document.body.querySelector('#tabs') as HTMLElement;

const ctx = (document.getElementById('data') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;

interface Metric {
    name: string;
    description: string;
    type: 'text' | 'boolean' | 'number';
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    initialised: number;
    lastLog: number;
}

interface Metrics {
    metrics: { metrics: Metric[] };
    error: string;
}

interface Log {
    value: string;
    storedAt: number;
}

interface Logs {
    logs: { name: string; logs: Log[] };
    error: string;
}

const fetchData = async <T>(metric: string): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            // todo: change back to /logs/latest/${metric}
            const data = await fetch(`/logs/latest/Number`, { headers: { 'Content-Type': 'application/json' } });
            resolve(await data.json());
        } catch (err) {
            reject(err);
        }
    });
};

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

(async function () {
    try {
        const r = await fetch('/metrics', { headers: { 'Content-Type': 'application/json' } });
        const metricsList: Metrics = await r.json();
        const metrics = metricsList.metrics.metrics
            .map((i) => i.name)
            .map((i, idx) => {
                const $el = build('span', { text: i, class: 'tab' });
                if (idx == 0) $el.classList.add('focused');
                return $el;
            });
        append(tabs, ...metrics);

        const current = metricsList.metrics.metrics[0].name;
        const data: Logs = await fetchData(current);

        const config = {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: current,
                        backgroundColor: '#ff155e',
                        borderColor: '#ff155e',
                        data: data.logs.logs.map((i) => i.value),
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: '',
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month',
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value',
                            },
                        },
                    ],
                },
            },
        };

        new Chart(ctx, config);
    } catch (err) {}
})();
