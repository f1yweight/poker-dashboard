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
  Smile,
  Frown,
  type LucideIcon,
} from 'lucide-react';

type MonthlySummary = {
  sessions: number;
  totalMttPlayed: number;
  totalHandsPlayed: number;
  averageEvBb100: number | null;
  totalProfit: number;
  averageAbi: number | null;
  totalMttHours: number;
  totalLearningHours: number;
  totalSportHours: number;
};

type MonthlySummaryPanelProps = {
  summary: MonthlySummary;
};

type SummaryStatus = {
  label: string;
  tone: 'good' | 'warning' | 'bad' | 'neutral';
  icon?: LucideIcon;
};

type SummaryCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: 'neutral' | 'profit' | 'ev' | 'abi' | 'learning' | 'sport';
  featured?: boolean;
  primary?: boolean;
  scoreClassName?: string;
  status?: SummaryStatus;
};

function formatNumber(value: number | null) {
  if (value === null) {
    return '-';
  }

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

function getTotalMttScoreClass(value: number) {
  if (value >= 400) {
    return 'summary-card-score-good';
  }

  if (value >= 300) {
    return 'summary-card-score-warning';
  }

  return 'summary-card-score-bad';
}

function getEvBb100ScoreClass(value: number) {
  if (value >= 10) {
    return 'summary-card-score-good';
  }

  if (value >= 5) {
    return 'summary-card-score-warning';
  }

  return 'summary-card-score-bad';
}

function getTotalMttStatus(value: number): SummaryStatus {
  if (value >= 400) {
    return {
      label: 'Strong',
      tone: 'good',
    };
  }

  if (value >= 300) {
    return {
      label: 'Solid',
      tone: 'warning',
    };
  }

  return {
    label: 'Low',
    tone: 'bad',
  };
}

function getEvBb100Status(value: number): SummaryStatus {
  if (value >= 10) {
    return {
      label: 'Strong',
      tone: 'good',
    };
  }

  if (value >= 5) {
    return {
      label: 'Solid',
      tone: 'warning',
    };
  }

  return {
    label: 'Needs work',
    tone: 'bad',
  };
}

function getProfitStatus(value: number): SummaryStatus {
  if (value > 0) {
    return {
      label: 'Winning month',
      tone: 'good',
      icon: Smile,
    };
  }

  return {
    label: 'Losing month',
    tone: 'bad',
    icon: Frown,
  };
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
      label: 'Total MTT',
      value: formatInteger(summary.totalMttPlayed),
      icon: Trophy,
      tone: 'neutral',
      featured: true,
      scoreClassName: getTotalMttScoreClass(summary.totalMttPlayed),
      status: getTotalMttStatus(summary.totalMttPlayed),
    },
    {
      label: 'Total profit',
      value: formatProfit(summary.totalProfit),
      icon: DollarSign,
      tone: 'profit',
      featured: true,
      primary: true,
      status: getProfitStatus(summary.totalProfit),
    },
    {
      label: 'EV BB/100',
      value: formatNumber(summary.averageEvBb100),
      icon: TrendingUp,
      tone: 'ev',
      featured: true,
      scoreClassName:
        summary.averageEvBb100 === null
          ? undefined
          : getEvBb100ScoreClass(summary.averageEvBb100),
      status:
        summary.averageEvBb100 === null
          ? undefined
          : getEvBb100Status(summary.averageEvBb100),
    },
    {
      label: 'Sessions',
      value: formatInteger(summary.sessions),
      icon: CalendarDays,
      tone: 'neutral',
    },
    {
      label: 'Total hands',
      value: formatInteger(summary.totalHandsPlayed),
      icon: Hand,
      tone: 'neutral',
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

  const featuredCards = cards.filter((card) => card.featured);
  const detailCards = cards.filter((card) => !card.featured);

  function renderCard(card: SummaryCard) {
    const Icon = card.icon;
    const StatusIcon = card.status?.icon;
    const valueToneClass =
      card.tone === 'profit' ? getValueToneClass(summary.totalProfit) : '';

    return (
      <article
        className={[
          'summary-card',
          card.featured ? 'summary-card-featured' : '',
          card.primary ? 'summary-card-primary' : '',
          card.scoreClassName ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        key={card.label}
      >
        <div className="summary-card-header">
          <span className={`summary-icon summary-icon-${card.tone}`}>
            <Icon size={16} strokeWidth={2.4} />
          </span>

          <span>{card.label}</span>
        </div>

        <div className="summary-card-body">
          <strong className={`summary-value ${valueToneClass}`}>
            {card.value}
          </strong>

          {card.status && (
            <span
              className={`summary-status summary-status-${card.status.tone}`}
              title={card.status.label}
            >
              {StatusIcon ? (
                <StatusIcon size={26} strokeWidth={2.4} />
              ) : (
                card.status.label
              )}
            </span>
          )}
        </div>
      </article>
    );
  }

  return (
    <section className="monthly-summary-panel">
      <h2>Monthly summary</h2>

      <div className="monthly-summary-groups">
        <div className="monthly-summary-group">
          <h3>Key results</h3>

          <div className="monthly-summary-grid monthly-summary-grid-featured">
            {featuredCards.map(renderCard)}
          </div>
        </div>

        <div className="monthly-summary-group">
          <h3>Details</h3>

          <div className="monthly-summary-grid monthly-summary-grid-details">
            {detailCards.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MonthlySummaryPanel;