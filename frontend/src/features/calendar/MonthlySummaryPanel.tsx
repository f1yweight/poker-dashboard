import {
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Clock,
  DollarSign,
  Dumbbell,
  Hand,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

type MonthlySummary = {
  sessions: number;
  totalMttPlayed: number;
  totalHandsPlayed: number;
  averageEvBb100: number;
  totalProfit: number;
  averageAbi: number;
  totalMttHours: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlySummaryPanelProps = {
  summary: MonthlySummary;
};

type SummaryCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: 'neutral' | 'profit' | 'ev' | 'abi' | 'learning' | 'sport';
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
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

function getValueToneClass(value: number) {
  if (value > 0) {
    return 'summary-value-positive';
  }

  if (value < 0) {
    return 'summary-value-negative';
  }

  return '';
}

function MonthlySummaryPanel({ summary }: MonthlySummaryPanelProps) {
  const cards: SummaryCard[] = [
    {
      label: 'Sessions',
      value: formatInteger(summary.sessions),
      icon: CalendarDays,
      tone: 'neutral',
    },
    {
      label: 'Total MTT',
      value: formatInteger(summary.totalMttPlayed),
      icon: Trophy,
      tone: 'neutral',
    },
    {
      label: 'Total hands',
      value: formatInteger(summary.totalHandsPlayed),
      icon: Hand,
      tone: 'neutral',
    },
    {
      label: 'EV BB/100',
      value: formatNumber(summary.averageEvBb100),
      icon: TrendingUp,
      tone: 'ev',
    },
    {
      label: 'Total profit',
      value: formatProfit(summary.totalProfit),
      icon: DollarSign,
      tone: 'profit',
    },
    {
      label: 'ABI',
      value: formatNumber(summary.averageAbi),
      icon: CircleDollarSign,
      tone: 'abi',
    },
    {
      label: 'MTT hours',
      value: formatNumber(summary.totalMttHours),
      icon: Clock,
      tone: 'neutral',
    },
    {
      label: 'Learning hours',
      value: formatNumber(summary.totalLearningHours),
      icon: BookOpen,
      tone: 'learning',
    },
    {
      label: 'Sport hours',
      value: formatNumber(summary.totalSportHours),
      icon: Dumbbell,
      tone: 'sport',
    },
  ];

  return (
    <section className="monthly-summary-panel">
      <h2>Monthly summary</h2>

      <div className="monthly-summary-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          const valueToneClass =
            card.tone === 'profit' || card.tone === 'ev'
              ? getValueToneClass(
                  card.tone === 'profit'
                    ? summary.totalProfit
                    : summary.averageEvBb100,
                )
              : '';

          return (
            <article className="summary-card" key={card.label}>
              <div className="summary-card-header">
                <span className={`summary-icon summary-icon-${card.tone}`}>
                  <Icon size={16} strokeWidth={2.4} />
                </span>

                <span>{card.label}</span>
              </div>

              <strong className={`summary-value ${valueToneClass}`}>
                {card.value}
              </strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MonthlySummaryPanel;