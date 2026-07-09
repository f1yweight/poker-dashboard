import { useState } from 'react';

type DailyEntryFormProps = {
  currentMonth: Date;
  selectedDay: number;
};

type DailyEntryFormData = {
  mttHours: string;
  mttPlayed: string;
  handsPlayed: string;
  evBb100: string;
  profit: string;
  abi: string;
  learningHours: string;
  sportHours: string;
  comment: string;
};

type DailyEntryPayload = {
  entryDate: string;
  mttHours: number | null;
  mttPlayed: number | null;
  handsPlayed: number | null;
  evBb100: number | null;
  profit: number | null;
  abi: number | null;
  learningHours: number | null;
  sportHours: number | null;
  comment: string;
};

function formatDateForApi(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toNumberOrNull(value: string) {
  if (value.trim() === '') {
    return null;
  }

  return Number(value);
}

function DailyEntryForm({ currentMonth, selectedDay }: DailyEntryFormProps) {
  const selectedDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDay,
  );

  const selectedDateLabel = selectedDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const [formData, setFormData] = useState<DailyEntryFormData>({
    mttHours: '',
    mttPlayed: '',
    handsPlayed: '',
    evBb100: '',
    profit: '',
    abi: '',
    learningHours: '',
    sportHours: '',
    comment: '',
  });

  function handleFieldChange(field: keyof DailyEntryFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: DailyEntryPayload = {
      entryDate: formatDateForApi(selectedDate),
      mttHours: toNumberOrNull(formData.mttHours),
      mttPlayed: toNumberOrNull(formData.mttPlayed),
      handsPlayed: toNumberOrNull(formData.handsPlayed),
      evBb100: toNumberOrNull(formData.evBb100),
      profit: toNumberOrNull(formData.profit),
      abi: toNumberOrNull(formData.abi),
      learningHours: toNumberOrNull(formData.learningHours),
      sportHours: toNumberOrNull(formData.sportHours),
      comment: formData.comment,
    };

    console.log(payload);
  }

  return (
    <section className="entry-section">
      <h2>Selected day: {selectedDateLabel}</h2>

      <form className="entry-form" onSubmit={handleSubmit}>
        <label>
          MTT hours
          <input
            type="number"
            step="0.5"
            value={formData.mttHours}
            onChange={(event) => handleFieldChange('mttHours', event.target.value)}
          />
        </label>

        <label>
          MTT played
          <input
            type="number"
            step="1"
            value={formData.mttPlayed}
            onChange={(event) => handleFieldChange('mttPlayed', event.target.value)}
          />
        </label>

        <label>
          Hands played
          <input
            type="number"
            step="1"
            value={formData.handsPlayed}
            onChange={(event) => handleFieldChange('handsPlayed', event.target.value)}
          />
        </label>

        <label>
          EV bb/100
          <input
            type="number"
            step="0.01"
            value={formData.evBb100}
            onChange={(event) => handleFieldChange('evBb100', event.target.value)}
          />
        </label>

        <label>
          Profit
          <input
            type="number"
            step="0.01"
            value={formData.profit}
            onChange={(event) =>
              handleFieldChange('profit', event.target.value)
            }
          />
        </label>

        <label>
          ABI
          <input
            type="number"
            step="0.01"
            value={formData.abi}
            onChange={(event) => handleFieldChange('abi', event.target.value)}
          />
        </label>

        <label>
          Learning hours
          <input
            type="number"
            step="0.5"
            value={formData.learningHours}
            onChange={(event) =>
              handleFieldChange('learningHours', event.target.value)
            }
          />
        </label>

        <label>
          Sport hours
          <input
            type="number"
            step="0.5"
            value={formData.sportHours}
            onChange={(event) =>
              handleFieldChange('sportHours', event.target.value)
            }
          />
        </label>

        <label>
          Comment
          <textarea
            rows={4}
            value={formData.comment}
            onChange={(event) =>
              handleFieldChange('comment', event.target.value)
            }
          />
        </label>

        <button type="submit">Save day</button>
      </form>
    </section>
  );
}

export default DailyEntryForm;