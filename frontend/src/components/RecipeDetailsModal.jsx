import React from 'react';
import { X, Clock, Tag, Edit3, Trash2, CheckCircle } from 'lucide-react';

const CATEGORY_COLORS = {
  Breakfast: 'badge-breakfast',
  Lunch: 'badge-lunch',
  Dinner: 'badge-dinner',
  Snack: 'badge-snack',
  Dessert: 'badge-dessert',
  Beverage: 'badge-beverage',
  Other: 'badge-other'
};

export default function RecipeDetailsModal({ recipe, onClose, onEdit, onDelete }) {
  if (!recipe) return null;

  const categoryClass = CATEGORY_COLORS[recipe.category] || 'badge-other';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className={`badge ${categoryClass}`}>
              <Tag size={13} style={{ marginRight: '4px' }} />
              {recipe.category}
            </span>
            <h2 className="modal-title">{recipe.name}</h2>
            <div className="recipe-meta-pill">
              <Clock size={16} />
              <span>{recipe.cookingTime} Minutes Total Time</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        <div className="modal-body details-body">
          {/* Ingredients Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="section-icon">🥗</span>
              Ingredients ({recipe.ingredients ? recipe.ingredients.length : 0})
            </h3>
            <ul className="ingredients-list">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="ingredient-item">
                    <CheckCircle size={16} className="ingredient-bullet" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted">No ingredients listed.</li>
              )}
            </ul>
          </div>

          {/* Preparation Steps Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="section-icon">🍳</span>
              Preparation Steps ({recipe.preparationSteps ? recipe.preparationSteps.length : 0})
            </h3>
            <ol className="steps-list">
              {recipe.preparationSteps && recipe.preparationSteps.length > 0 ? (
                recipe.preparationSteps.map((step, idx) => (
                  <li key={idx} className="step-item">
                    <span className="step-number">{idx + 1}</span>
                    <div className="step-text">{step}</div>
                  </li>
                ))
              ) : (
                <li className="text-muted">No preparation steps listed.</li>
              )}
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-left">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                onClose();
                onDelete(recipe);
              }}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                onClose();
                onEdit(recipe);
              }}
            >
              <Edit3 size={16} />
              <span>Edit Recipe</span>
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
