import { X } from 'lucide-react';
import { useEffect } from 'react';

type DeleteLearningResourceDialogProps = {
  resourceTitle: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteLearningResourceDialog({
  resourceTitle,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteLearningResourceDialogProps) {
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

  return (
    <div className="learning-modal-backdrop" onClick={onCancel}>
      <section
        className="learning-confirm-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="learning-confirm-header">
          <button type="button" onClick={onCancel} aria-label="Close">
            <X size={18} strokeWidth={2.6} />
          </button>
        </div>

        <div className="learning-confirm-body">
          <h2>Delete learning resource?</h2>
          <p>
            <strong>{resourceTitle}</strong> will be removed from your learning library.
          </p>
        </div>

        <div className="learning-confirm-footer">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteLearningResourceDialog;