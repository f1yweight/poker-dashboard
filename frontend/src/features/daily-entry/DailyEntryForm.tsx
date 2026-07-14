import { useEffect, useState } from 'react';

import { formatDateForApi } from '../../shared/date/dateUtils';
import type {
  DailyEntryFormData,
  DailyEntryPayload,
} from './dailyEntryTypes';

import {
  Activity,
  BookOpen,
  CircleDollarSign,
  Dumbbell,
  FileText,
  Hand,
  Timer,
  Trophy,
  TrendingUp,
} from 'lucide-react';

type DailyEntryFormProps = {
  currentMonth: Date;
  selectedDay: number;
  selectedEntry?: DailyEntryPayload;
  isSaved: boolean;
  isSaving: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onSave: (payload: DailyEntryPayload) => void;
  onClose: () => void;
};

const emptyFormData: DailyEntryFormData = {
  mttHours: '0',
  mttPlayed: '0',
  handsPlayed: '0',
  evBb100: '0',
  profit: '0',
  abi: '0',
  learningHours: '0',
  sportHours: '0',
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
  onClose,
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
    <div
      className="entry-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
        <section
            className="entry-section"
            onClick={(event) => event.stopPropagation()}
          >
          <div className="entry-modal-header">
            <div>
              <h2>{selectedDateLabel}</h2>
              <p>
                Log Session <span>›</span> <strong>Daily Entry</strong>
              </p>
            </div>

            <button className="entry-modal-close" type="button" onClick={onClose}>
              ×
            </button>
          </div>

          {isLoading && <p className="entry-loading">Loading day...</p>}

          <form className="entry-form" onSubmit={handleSubmit}>
            <div className="entry-form-section">
              <h3>Poker session</h3>

              <div className="entry-form-grid">
                <label>
                  <span className="entry-field-label">
                      <Timer size={15} strokeWidth={2.4} />
                      MTT hours
                  </span>
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
                  <span className="entry-field-label">
                      <Trophy size={15} strokeWidth={2.4} />
                      MTT played
                  </span>
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
                  <span className="entry-field-label">
                      <Hand size={15} strokeWidth={2.4} />
                      Hands played
                  </span>
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
                  <span className="entry-field-label">
                      <TrendingUp size={15} strokeWidth={2.4} />
                      EV BB/100
                  </span>
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
                  <span className="entry-field-label">
                      <CircleDollarSign size={15} strokeWidth={2.4} />
                      Profit / Loss
                  </span>
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
                  <span className="entry-field-label">
                      <Activity size={15} strokeWidth={2.4} />
                      ABI
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.abi}
                    onChange={(event) => handleFieldChange('abi', event.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="entry-form-section">
              <h3>Off-table</h3>

              <div className="entry-form-grid">
                <label>
                  <span className="entry-field-label">
                      <BookOpen size={15} strokeWidth={2.4} />
                      Learning hours
                  </span>
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
                  <span className="entry-field-label">
                      <Dumbbell size={15} strokeWidth={2.4} />
                      Sport hours
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.sportHours}
                    onChange={(event) =>
                      handleFieldChange('sportHours', event.target.value)
                    }
                  />
                </label>
              </div>
            </div>

            <div className="entry-form-section">
              <h3>Notes</h3>

              <label>
                <span className="entry-field-label">
                    <FileText size={15} strokeWidth={2.4} />
                    Comment
                </span>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(event) =>
                    handleFieldChange('comment', event.target.value)
                  }
                />
              </label>
            </div>

            {errorMessage && <p className="entry-error">{errorMessage}</p>}

            <div className="entry-modal-footer">
              {isSaved && <span className="save-status">Saved</span>}

              <button className="entry-cancel-button" type="button" onClick={onClose}>
                Cancel
              </button>

              <button className="entry-save-button" type="submit" disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </section>
    </div>
  );
}

export default DailyEntryForm;