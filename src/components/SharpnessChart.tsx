import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { F_STOPS } from '../data/presets';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/presets';

interface SharpnessChartProps {
  dataPoints: number[];
  currentFStopIndex: number;
  isDark: boolean;
  lang: Language;
}

export const SharpnessChart: React.FC<SharpnessChartProps> = ({
  dataPoints,
  currentFStopIndex,
  isDark,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dynLineColor = isDark ? '#E2E2E2' : '#1A1A1A';
    const dynGridColor = isDark ? 'rgba(226, 226, 226, 0.1)' : 'rgba(85, 85, 85, 0.2)';
    const dynTickColor = isDark ? '#9CA3AF' : '#555555';
    const dynPointBorder = isDark ? '#222222' : '#E2E2E2';

    const t = TRANSLATIONS[lang];

    // Destroy existing instance to avoid duplicate listeners or memory leaks
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: F_STOPS.map(f => `f/${f}`),
        datasets: [
          {
            data: dataPoints,
            borderColor: dynLineColor,
            borderWidth: 2,
            pointBackgroundColor: '#E85002',
            pointBorderColor: dynPointBorder,
            pointBorderWidth: F_STOPS.map((_, i) => (i === currentFStopIndex ? 2 : 0)),
            pointRadius: F_STOPS.map((_, i) => (i === currentFStopIndex ? 6 : 0)),
            pointHoverRadius: F_STOPS.map((_, i) => (i === currentFStopIndex ? 8 : 0)),
            fill: false,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const val = Number(context.parsed.y).toFixed(1);
                return ` Sharpness Index: ${val}%`;
              },
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            display: true,
            grid: {
              color: dynGridColor,
              lineWidth: 1,
              tickLength: 0,
            },
            border: { display: false },
            afterBuildTicks: (axis) => {
              axis.ticks = [
                { value: 87.5 },
                { value: 62.5 },
                { value: 37.5 },
                { value: 12.5 },
              ];
            },
            ticks: {
              color: dynTickColor,
              font: { family: 'Roboto Mono', size: 9, weight: 'bold' },
              padding: 4,
              callback: (value) => {
                if (value === 87.5) return t.s_sharp;
                if (value === 62.5) return t.s_optimal;
                if (value === 37.5) return t.s_soft;
                if (value === 12.5) return t.s_blur;
                return '';
              },
            },
          },
          x: {
            grid: { color: dynGridColor },
            border: { display: false },
            ticks: {
              color: dynTickColor,
              font: { family: 'Roboto Mono', size: 9 },
              maxTicksLimit: 9,
              padding: 4,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [dataPoints, currentFStopIndex, isDark, lang]);

  return (
    <div className="h-52 sm:h-64 w-full relative">
      <canvas ref={canvasRef} />
    </div>
  );
};
