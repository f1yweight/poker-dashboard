import { useState } from 'react';

import { formatDateForApi } from '../../shared/date/dateUtils';
import type {
  DailyEntryFormData,
  DailyEntryPayload,
} from './dailyEntryTypes';

type DailyEntryFormProps = {
  currentMonth: Date;
  selectedDay: number;
  selectedEntry?: DailyEntryPayload;
  isSaved: boolean;
  isSaving: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onSave: (payload: DailyEntryPayload) => void;
};

const emptyFormData: DailyEntryFormData = {
  mttHours: '',
  mttPlayed: '',
  handsPlayed: '',
  evBb100: '',
  profit: '',
  abi: '',
  learningHours: '',
  sportHours: '',
  comment: '',
};

const selectedDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

function toFormValue(value: number | null) {
  return value === null ? '' : String(value);
}

function payloadToFormData(payload: DailyEntryPayload): DailyEntryFormData {
  return {
    mttHours: toFormValue(payload.mttHours),
    mttPlayed: toFormValue(payload.mttPlayed),
    handsPlayed: toFormValue(payload.handsPlayed),
    evBb100: toFormValue(payload.evBb100),
    profit: toFormValue(payload.profit),
    abi: toFormValue(payload.abi),
    learningHours: toFormValue(payload.learningHours),
    sportHours: toFormValue(payload.sportHours),
    comment: payload.comment,
  };
}

function toNumberOrNull(value: string) {
  if (value.trim() === '') {
    return null;
  }

  return Number(value);
}

function DailyEntryForm({
  currentMonth,
  selectedDay,
  selectedEntry,
  isSaved,
  isSaving,
  isLoading,
  errorMessage,
  onSave,
}: DailyEntryFormProps) {
  const selectedDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDay,
  );

  const selectedDateLabel = selectedDateFormatter.format(selectedDate);

  const [formData, setFormData] = useState<DailyEntryFormData>(() => {
    if (selectedEntry) {
      return payloadToFormData(selectedEntry);
    }

    return emptyFormData;
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

    onSave(payload);
  }

  return (
    <section className="entry-section">
      <h2>Selected day: {selectedDateLabel}</h2>

      {isLoading && <p className="entry-loading">Loading day...</p>}

      <form className="entry-form" onSubmit={handleSubmit}>
        <label>
          MTT hours
          <input
            type="number"
            step="0.5"
            value={formData.mttHours}
            onChange={(event) =>
              handleFieldChange('mttHours', event.target.value)
            }
          />
        </label>

        <label>
          MTT played
          <input
            type="number"
            step="1"
            value={formData.mttPlayed}
            onChange={(event) =>
              handleFieldChange('mttPlayed', event.target.value)
            }
          />
        </label>

        <label>
          Hands played
          <input
            type="number"
            step="1"
            value={formData.handsPlayed}
            onChange={(event) =>
              handleFieldChange('handsPlayed', event.target.value)
            }
          />
        </label>

        <label>
          EV bb/100
          <input
            type="number"
            step="0.01"
            value={formData.evBb100}
            onChange={(event) =>
              handleFieldChange('evBb100', event.target.value)
            }
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

        {errorMessage && <p className="entry-error">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Save day'}
          </button>

          {isSaved && <span className="save-status">Saved</span>}
        </div>
      </form>
    </section>
  );
}

export default DailyEntryForm;