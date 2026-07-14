import {
  ExternalLink,
  Library,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import AppHeader from '../../components/AppHeader';
import {
  createLearningResource,
  deleteLearningResource,
  getLearningResources,
  updateLearningResource,
} from './learningApi';
import LearningResourceForm from './LearningResourceForm';
import DeleteLearningResourceDialog from './DeleteLearningResourceDialog';
import type {
  LearningResource,
  LearningResourcePayload,
} from './learningTypes';

type LearningPageProps = {
  onLogout: () => void;
};

function getStatusLabel(status: LearningResource['status']) {
  if (status === 'TO_WATCH') {
    return 'To watch';
  }

  if (status === 'IN_PROGRESS') {
    return 'In progress';
  }

  return 'Done';
}

function LearningPage({ onLogout }: LearningPageProps) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingResource, setEditingResource] =
    useState<LearningResource | null>(null);

  const [isSavingResource, setIsSavingResource] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const [resourcePendingDelete, setResourcePendingDelete] =
    useState<LearningResource | null>(null);
  const [isDeletingResource, setIsDeletingResource] = useState(false);

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getLearningResources();
        setResources(response);
      } catch {
        setErrorMessage('Could not load learning resources.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadResources();
  }, []);

  function closeResourceModal() {
    setIsCreateModalOpen(false);
    setEditingResource(null);
    setSaveErrorMessage(null);
  }

  async function handleCreateResource(payload: LearningResourcePayload) {
    setIsSavingResource(true);
    setSaveErrorMessage(null);

    try {
      const createdResource = await createLearningResource(payload);

      setResources([createdResource, ...resources]);
      closeResourceModal();
    } catch {
      setSaveErrorMessage('Could not save learning resource.');
    } finally {
      setIsSavingResource(false);
    }
  }

  async function handleUpdateResource(payload: LearningResourcePayload) {
    if (!editingResource) {
      return;
    }

    setIsSavingResource(true);
    setSaveErrorMessage(null);

    try {
      const updatedResource = await updateLearningResource(
        editingResource.id,
        payload,
      );

      setResources(
        resources.map((resource) =>
          resource.id === updatedResource.id ? updatedResource : resource,
        ),
      );
      closeResourceModal();
    } catch {
      setSaveErrorMessage('Could not update learning resource.');
    } finally {
      setIsSavingResource(false);
    }
  }

  async function handleDeleteResource() {
    if (!resourcePendingDelete) {
      return;
    }

    setIsDeletingResource(true);

    try {
      await deleteLearningResource(resourcePendingDelete.id);

      setResources(
        resources.filter((resource) => resource.id !== resourcePendingDelete.id),
      );
      setResourcePendingDelete(null);
    } catch {
      setErrorMessage('Could not delete learning resource.');
    } finally {
      setIsDeletingResource(false);
    }
  }

  return (
    <div className="app">
      <AppHeader onLogout={onLogout} />

      <main className="learning-page">
        <section className="learning-panel">
          <div className="learning-header">
            <div>
              <h1>
                <Library size={20} strokeWidth={2.6} />
                Learning library
              </h1>
              <p>Save videos, articles, reviews and poker study materials.</p>
            </div>

            <button
              className="learning-add-button"
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} strokeWidth={2.6} />
              Add link
            </button>
          </div>

          {isLoading && <p className="learning-state">Loading resources...</p>}

          {!isLoading && errorMessage && (
            <p className="learning-error">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && resources.length === 0 && (
            <div className="learning-empty">
              <strong>No learning resources yet</strong>
              <span>Add your first poker video, article or study note.</span>
            </div>
          )}

          {!isLoading && !errorMessage && resources.length > 0 && (
            <div className="learning-list">
              {resources.map((resource) => (
                <article className="learning-card" key={resource.id}>
                  <div className="learning-card-main">
                    <div>
                      <h2>{resource.title}</h2>

                      {resource.description && (
                        <p>{resource.description}</p>
                      )}
                    </div>

                    <span
                      className={`learning-status learning-status-${resource.status.toLowerCase()}`}
                    >
                      {getStatusLabel(resource.status)}
                    </span>
                  </div>

                  <div className="learning-card-footer">
                    <div className="learning-card-meta">
                      {resource.category && (
                        <span className="learning-category">
                          {resource.category}
                        </span>
                      )}

                      <a href={resource.url} target="_blank" rel="noreferrer">
                        Open
                        <ExternalLink size={14} strokeWidth={2.4} />
                      </a>
                    </div>

                    <div className="learning-card-actions">
                      <button
                        type="button"
                        onClick={() => setEditingResource(resource)}
                        aria-label="Edit resource"
                      >
                        <Pencil size={14} strokeWidth={2.4} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setResourcePendingDelete(resource)}
                        aria-label="Delete resource"
                      >
                        <Trash2 size={14} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isCreateModalOpen && (
        <LearningResourceForm
          isSaving={isSavingResource}
          errorMessage={saveErrorMessage}
          onCancel={closeResourceModal}
          onSave={handleCreateResource}
        />
      )}

      {editingResource && (
        <LearningResourceForm
          resource={editingResource}
          isSaving={isSavingResource}
          errorMessage={saveErrorMessage}
          onCancel={closeResourceModal}
          onSave={handleUpdateResource}
        />
      )}

      {resourcePendingDelete && (
        <DeleteLearningResourceDialog
          resourceTitle={resourcePendingDelete.title}
          isDeleting={isDeletingResource}
          onCancel={() => setResourcePendingDelete(null)}
          onConfirm={() => void handleDeleteResource()}
        />
      )}
    </div>
  );
}

export default LearningPage;