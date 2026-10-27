import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ recipe, onConfirm, onCancel, isDeleting }) {
  if (!recipe) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="delete-modal-content">
          <div className="delete-icon-wrapper">
            <AlertTriangle size={32} className="delete-warning-icon" />
          </div>
          <h3 className="delete-modal-title">Delete Recipe</h3>
          <p className="delete-modal-text">
            Are you sure you want to delete <strong>"{recipe.name}"</strong>? This action cannot be undone.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
