import { DollarSign, TrendingUp } from 'lucide-react';
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

type ProfitChartPeriod = 'month' | 'year';

type ProfitTrajectoryPanelProps = {
  entriesByDate: Record<string, DailyEntryPayload>;
  currentMonth: Date;
  period: ProfitChartPeriod;
  isLoading: boolean;
  errorMessage: string | null;
  onPeriodChange: (period: ProfitChartPeriod) => void;
};

type ChartPoint = {
  label: string;
  profit: number;
};

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function buildMonthChartData(
  entriesByDate: Record<string, DailyEntryPayload>,
  currentMonth: Date,
) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const monthLastDay = new Date(year, month + 1, 0).getDate();

  const entryDays = Object.values(entriesByDate)
    .filter((entry) => {
      const entryYear = Number(entry.entryDate.slice(0, 4));
      const entryMonth = Number(entry.entryDate.slice(5, 7)) - 1;

      return entryYear === year && entryMonth === month;
    })
    .map((entry) => Number(entry.entryDate.slice(-2)));

  const lastEntryDay = Math.max(0, ...entryDays);

  const lastDay = isCurrentMonth
    ? today.getDate()
    : Math.min(monthLastDay, lastEntryDay + 1);

  let cumulativeProfit = 0;

  return Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1;
    const entryDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;

    const entry = entriesByDate[entryDate];

    cumulativeProfit += entry?.profit ?? 0;

    return {
      label: String(day),
      profit: cumulativeProfit,
    };
  });
}

function buildYearChartData(
  entriesByDate: Record<string, DailyEntryPayload>,
  year: number,
) {
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();
  const lastMonthIndex = isCurrentYear ? today.getMonth() : 11;
  const monthlyProfits = Array.from({ length: lastMonthIndex + 1 }, () => 0);

  Object.values(entriesByDate).forEach((entry) => {
    const entryYear = Number(entry.entryDate.slice(0, 4));

    if (entryYear !== year) {
      return;
    }

    const monthIndex = Number(entry.entryDate.slice(5, 7)) - 1;

    if (monthIndex > lastMonthIndex) {
      return;
    }

    monthlyProfits[monthIndex] += entry.profit ?? 0;
  });

  let cumulativeProfit = 0;

  return monthlyProfits.map((profit, index) => {
    cumulativeProfit += profit;

    return {
      label: monthLabels[index],
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
  const rawMinProfit = Math.min(0, ...profitValues);
  const rawMaxProfit = Math.max(0, ...profitValues);

  const minProfit = rawMinProfit < 0 ? Math.min(rawMinProfit, -500) : 0;
  const maxProfit = rawMaxProfit > 0 ? Math.max(rawMaxProfit, 500) : 0;

  const yAxisStep = getYAxisStep(minProfit, maxProfit);

  const minDomain = Math.floor(minProfit / yAxisStep) * yAxisStep;
  const maxDomain = Math.ceil(maxProfit / yAxisStep) * yAxisStep;

  const normalizedMaxDomain =
    minDomain === maxDomain ? minDomain + yAxisStep : maxDomain;

  const ticks: number[] = [];

  for (let tick = minDomain; tick <= normalizedMaxDomain; tick += yAxisStep) {
    ticks.push(tick);
  }

  return {
    domain: [minDomain, normalizedMaxDomain] as [number, number],
    ticks,
  };
}

function ProfitTrajectoryPanel({
  entriesByDate,
  currentMonth,
  period,
  isLoading,
  errorMessage,
  onPeriodChange,
}: ProfitTrajectoryPanelProps) {
  const chartData =
    period === 'month'
      ? buildMonthChartData(entriesByDate, currentMonth)
      : buildYearChartData(entriesByDate, currentMonth.getFullYear());

  const hasEntries = Object.values(entriesByDate).some((entry) => {
    const entryYear = Number(entry.entryDate.slice(0, 4));

    if (period === 'year') {
      return entryYear === currentMonth.getFullYear();
    }

    return true;
  });

  const hasChartData = hasEntries;

  const finalProfit = hasChartData
    ? chartData[chartData.length - 1].profit
    : 0;

  const yAxisConfig = getYAxisConfig(chartData);

  return (
    <section className="profit-trajectory-panel">
      <div className="profit-trajectory-header">
        <div className="profit-net-heading">
          <TrendingUp size={15} strokeWidth={2.4} />

          <span>Net earnings</span>

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

        <div className="profit-period-toggle">
          <button
            className={period === 'month' ? 'active' : ''}
            type="button"
            onClick={() => onPeriodChange('month')}
          >
            Month
          </button>

          <button
            className={period === 'year' ? 'active' : ''}
            type="button"
            onClick={() => onPeriodChange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="profit-chart-card">
        <div className="profit-chart">
          {isLoading && <p>Loading profit chart...</p>}

          {!isLoading && errorMessage && <p>{errorMessage}</p>}

          {!isLoading && !errorMessage && hasChartData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 8, bottom: 18, left: 8 }}
              >
                <defs>
                  <linearGradient id="profitFill" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#f5b700"
                      stopOpacity={0.24}
                    />
                    <stop
                      offset="100%"
                      stopColor="#f5b700"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(138, 160, 189, 0.14)"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#8aa0bd',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
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
                  labelFormatter={(label) =>
                    period === 'month' ? `Day ${label}` : String(label)
                  }
                />

                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#f5b700"
                  strokeWidth={2.6}
                  fill="url(#profitFill)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#f5b700',
                    stroke: '#ffd166',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {!isLoading && !errorMessage && !hasChartData && (
            <div className="profit-chart-empty">
              <strong>No daily entries yet</strong>
              <span>Add your first session to see profit trajectory.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfitTrajectoryPanel;