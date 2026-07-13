import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

function ProfitTrajectoryPanel({ entriesByDate }: ProfitTrajectoryPanelProps) {
  const chartData = buildChartData(entriesByDate);
  const hasChartData = chartData.length > 0;
  const finalProfit = hasChartData
    ? chartData[chartData.length - 1].profit
    : 0;

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
        </strong>
      </div>

      <div className="profit-chart">
        {hasChartData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 8, bottom: 4, left: 0 }}
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
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8aa0bd', fontSize: 12, fontWeight: 700 }}
                tickFormatter={formatProfit}
                width={54}
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