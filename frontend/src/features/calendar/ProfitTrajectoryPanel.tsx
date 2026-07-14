import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DollarSign } from 'lucide-react';

import type { DailyEntryPayload } from '../daily-entry/dailyEntryTypes';

type ProfitTrajectoryPanelProps = {
  entriesByDate: Record<string, DailyEntryPayload>;
};

type ChartPoint = {
  day: string;
  profit: number;
};

function buildChartData(
  entriesByDate: Record<string, DailyEntryPayload>,
): ChartPoint[] {
  const sortedEntries = Object.values(entriesByDate).sort((first, second) =>
    first.entryDate.localeCompare(second.entryDate),
  );

  let cumulativeProfit = 0;

  return sortedEntries.map((entry) => {
    cumulativeProfit += entry.profit ?? 0;

    const day = Number(entry.entryDate.slice(-2));

    return {
      day: String(day),
      profit: cumulativeProfit,
    };
  });
}

function formatProfit(value: number) {
  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  if (value > 0) {
    return `+${formattedValue}`;
  }

  if (value < 0) {
    return `-${formattedValue}`;
  }

  return formattedValue;
}

function getYAxisStep(minProfit: number, maxProfit: number) {
  const range = maxProfit - minProfit;

  if (range <= 1000) {
    return 250;
  }

  if (range <= 2500) {
    return 500;
  }

  if (range <= 6000) {
    return 1000;
  }

  if (range <= 15000) {
    return 2000;
  }

  return 5000;
}

function getYAxisConfig(chartData: ChartPoint[]) {
  if (chartData.length === 0) {
    return {
      domain: [0, 1000] as [number, number],
      ticks: [0, 500, 1000],
    };
  }

  const profitValues = chartData.map((point) => point.profit);
  const minProfit = Math.min(0, ...profitValues);
  const maxProfit = Math.max(0, ...profitValues);
  const yAxisStep = getYAxisStep(minProfit, maxProfit);

  const minDomain = Math.floor(minProfit / yAxisStep) * yAxisStep;
  const maxDomain = Math.ceil(maxProfit / yAxisStep) * yAxisStep;

  const normalizedMaxDomain =
    minDomain === maxDomain ? minDomain + yAxisStep : maxDomain;

  const ticks: number[] = [];

  for (
    let tick = minDomain;
    tick <= normalizedMaxDomain;
    tick += yAxisStep
  ) {
    ticks.push(tick);
  }

  return {
    domain: [minDomain, normalizedMaxDomain] as [number, number],
    ticks,
  };
}

function ProfitTrajectoryPanel({ entriesByDate }: ProfitTrajectoryPanelProps) {
  const chartData = buildChartData(entriesByDate);
  const hasChartData = chartData.length > 0;
  const finalProfit = hasChartData
    ? chartData[chartData.length - 1].profit
    : 0;

  const yAxisConfig = getYAxisConfig(chartData);

  return (
    <section className="profit-trajectory-panel">
      <div className="profit-trajectory-header">
        <h2>Profit trajectory</h2>

        <strong
          className={
            finalProfit >= 0
              ? 'profit-trajectory-value positive'
              : 'profit-trajectory-value negative'
          }
        >
          {formatProfit(finalProfit)}
          <DollarSign size={18} strokeWidth={2.6} />
        </strong>
      </div>

      <div className="profit-chart">
        {hasChartData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 8, bottom: 18, left: 8 }}
            >
              <defs>
                <linearGradient id="profitFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f5b700" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#f5b700" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(138, 160, 189, 0.14)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8aa0bd', fontSize: 12, fontWeight: 700 }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#8aa0bd',
                  fontSize: 12,
                  fontWeight: 700,
                  dx: -8,
                }}
                tickFormatter={formatProfit}
                width={78}
                domain={yAxisConfig.domain}
                ticks={yAxisConfig.ticks}
              />

              <Tooltip
                cursor={{ stroke: '#f5b700', strokeOpacity: 0.35 }}
                contentStyle={{
                  border: '1px solid #243044',
                  borderRadius: '8px',
                  background: '#101419',
                  color: '#ffffff',
                }}
                formatter={(value) => [
                  formatProfit(Number(value)),
                  'Profit',
                ]}
                labelFormatter={(label) => `Day ${label}`}
              />

              <Area
                type="monotone"
                dataKey="profit"
                stroke="#f5b700"
                strokeWidth={3}
                fill="url(#profitFill)"
                dot={{
                  r: 3,
                  fill: '#101419',
                  stroke: '#f5b700',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: '#f5b700',
                  stroke: '#ffd166',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p>Profit chart will be here</p>
        )}
      </div>
    </section>
  );
}

export default ProfitTrajectoryPanel;