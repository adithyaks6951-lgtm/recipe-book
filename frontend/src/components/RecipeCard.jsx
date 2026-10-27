import React from 'react';
import { Clock, Tag, Eye, Edit3, Trash2, Utensils } from 'lucide-react';

const CATEGORY_COLORS = {
  Breakfast: 'badge-breakfast',
  Lunch: 'badge-lunch',
  Dinner: 'badge-dinner',
  Snack: 'badge-snack',
  Dessert: 'badge-dessert',
  Beverage: 'badge-beverage',
  Other: 'badge-other'
};

const CATEGORY_EMOJI = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍲',
  Snack: '🥨',
  Dessert: '🍰',
  Beverage: '🥤',
  Other: '🍽️'
};

export default function RecipeCard({ recipe, onView, onEdit, onDelete }) {
  const categoryClass = CATEGORY_COLORS[recipe.category] || 'badge-other';
  const emoji = CATEGORY_EMOJI[recipe.category] || '🍽️';

  const ingredientsCount = recipe.ingredients ? recipe.ingredients.length : 0;
  const stepsCount = recipe.preparationSteps ? recipe.preparationSteps.length : 0;

  return (
    <div
      className="recipe-card"
      onClick={() => onView(recipe)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onView(recipe);
        }
      }}
    >
      <div className="card-top">
        <span className="card-category-emoji">{emoji}</span>
        <span className={`badge ${categoryClass}`}>
          <Tag size={12} style={{ marginRight: '4px' }} />
          {recipe.category}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={recipe.name}>
          {recipe.name}
        </h3>

        <div className="card-meta">
          <div className="meta-item time-badge">
            <Clock size={15} />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="meta-item count-badge">
            <Utensils size={15} />
            <span>{ingredientsCount} ingredients</span>
          </div>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <p className="card-preview">
            {recipe.ingredients.slice(0, 3).join(', ')}
            {recipe.ingredients.length > 3 ? '...' : ''}
          </p>
        )}
      </div>

      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-card-action btn-view"
          onClick={() => onView(recipe)}
          title="View Recipe Details"
        >
          <Eye size={15} />
          <span>Details</span>
        </button>

        <button
          type="button"
          className="btn-card-action btn-edit"
          onClick={() => onEdit(recipe)}
          title="Edit Recipe"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="btn-card-action btn-delete"
          onClick={() => onDelete(recipe)}
          title="Delete Recipe"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
