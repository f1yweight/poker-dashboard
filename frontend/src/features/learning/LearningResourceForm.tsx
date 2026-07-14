import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type {
  LearningResource,
  LearningResourcePayload,
  LearningResourceStatus,
} from './learningTypes';

type LearningResourceFormProps = {
  resource?: LearningResource;
  isSaving: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onSave: (payload: LearningResourcePayload) => void;
};

type LearningResourceFormData = {
  title: string;
  url: string;
  description: string;
  category: string;
  status: LearningResourceStatus;
};

const emptyFormData: LearningResourceFormData = {
  title: '',
  url: '',
  description: '',
  category: '',
  status: 'TO_WATCH',
};

function resourceToFormData(
  resource: LearningResource,
): LearningResourceFormData {
  return {
    title: resource.title,
    url: resource.url,
    description: resource.description ?? '',
    category: resource.category ?? '',
    status: resource.status,
  };
}

function toPayload(formData: LearningResourceFormData): LearningResourcePayload {
  return {
    title: formData.title.trim(),
    url: formData.url.trim(),
    description:
      formData.description.trim() === ''
        ? null
        : formData.description.trim(),
    category:
      formData.category.trim() === '' ? null : formData.category.trim(),
    status: formData.status,
  };
}

function LearningResourceForm({
  resource,
  isSaving,
  errorMessage,
  onCancel,
  onSave,
}: LearningResourceFormProps) {
  const [formData, setFormData] = useState<LearningResourceFormData>(() => {
    if (resource) {
      return resourceToFormData(resource);
    }

    return emptyFormData;
  });

  const formTitle = resource ? 'Edit learning resource' : 'Add learning resource';
  const formSubtitle = resource
    ? 'Update saved material details and progress.'
    : 'Save a video, article, review or study note.';
  const submitLabel = resource ? 'Save changes' : 'Save link';

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  function handleFieldChange(
    field: keyof LearningResourceFormData,
    value: string,
  ) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave(toPayload(formData));
  }

  return (
    <div className="learning-modal-backdrop" onClick={onCancel}>
      <section
        className="learning-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="learning-modal-header">
          <div>
            <h2>{formTitle}</h2>
            <p>{formSubtitle}</p>
          </div>

          <button type="button" onClick={onCancel} aria-label="Close">
            <X size={20} strokeWidth={2.6} />
          </button>
        </div>

        <form className="learning-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={formData.title}
              onChange={(event) =>
                handleFieldChange('title', event.target.value)
              }
              required
            />
          </label>

          <label>
            URL
            <input
              type="url"
              value={formData.url}
              onChange={(event) => handleFieldChange('url', event.target.value)}
              required
            />
          </label>

          <label>
            Category
            <input
              type="text"
              value={formData.category}
              onChange={(event) =>
                handleFieldChange('category', event.target.value)
              }
              placeholder="RvBB, MTT, ICM..."
            />
          </label>

          <label>
            Status
            <select
              value={formData.status}
              onChange={(event) =>
                handleFieldChange(
                  'status',
                  event.target.value as LearningResourceStatus,
                )
              }
            >
              <option value="TO_WATCH">To watch</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
          </label>

          <label className="learning-form-full">
            Description
            <textarea
              rows={4}
              value={formData.description}
              onChange={(event) =>
                handleFieldChange('description', event.target.value)
              }
            />
          </label>

          {errorMessage && <p className="learning-error">{errorMessage}</p>}

          <div className="learning-modal-footer">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LearningResourceForm;