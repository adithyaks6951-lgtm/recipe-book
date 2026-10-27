import React, { useState, useEffect } from 'react';
import { X, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'];

export default function RecipeFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditing = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    cookingTime: '',
    ingredients: '',
    preparationSteps: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Breakfast',
        cookingTime: initialData.cookingTime !== undefined ? initialData.cookingTime : '',
        ingredients: Array.isArray(initialData.ingredients)
          ? initialData.ingredients.join('\n')
          : initialData.ingredients || '',
        preparationSteps: Array.isArray(initialData.preparationSteps)
          ? initialData.preparationSteps.join('\n')
          : initialData.preparationSteps || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Breakfast',
        cookingTime: '',
        ingredients: '',
        preparationSteps: ''
      });
    }
    setErrors({});
    setServerError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Recipe name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Recipe name must be at least 2 characters long.';
    }

    if (!formData.category) {
      errs.category = 'Please select a category.';
    }

    const timeNum = Number(formData.cookingTime);
    if (!formData.cookingTime || isNaN(timeNum)) {
      errs.cookingTime = 'Please enter cooking time in minutes.';
    } else if (timeNum <= 0) {
      errs.cookingTime = 'Cooking time must be a positive number greater than 0.';
    }

    const ingList = formData.ingredients
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    if (ingList.length === 0) {
      errs.ingredients = 'Please provide at least one ingredient.';
    }

    const stepList = formData.preparationSteps
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (stepList.length === 0) {
      errs.preparationSteps = 'Please provide at least one preparation step.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      cookingTime: Number(formData.cookingTime),
      ingredients: formData.ingredients
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
      preparationSteps: formData.preparationSteps
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    };

    try {
      await onSubmit(payload, initialData?._id);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">
              {isEditing ? '✏️ Edit Recipe' : '✨ Add New Recipe'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update the recipe details below'
                : 'Fill in the information below to save your recipe'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {serverError && (
          <div className="alert-box alert-danger">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Recipe Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Recipe Name <span className="required-star">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Classic Margherita Pizza"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Category & Cooking Time Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="cookingTime" className="form-label">
                Cooking Time (mins) <span className="required-star">*</span>
              </label>
              <input
                id="cookingTime"
                name="cookingTime"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 25"
                value={formData.cookingTime}
                onChange={handleChange}
                className={`form-control ${errors.cookingTime ? 'is-invalid' : ''}`}
              />
              {errors.cookingTime && <span className="error-text">{errors.cookingTime}</span>}
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <div className="label-with-hint">
              <label htmlFor="ingredients" className="form-label">
                Ingredients <span className="required-star">*</span>
              </label>
              <span className="field-hint">One ingredient per line</span>
            </div>
            <textarea
              id="ingredients"
              name="ingredients"
              rows="4"
              placeholder="2 cups all-purpose flour&#10;1 tsp active dry yeast&#10;1/2 cup tomato sauce&#10;200g mozzarella cheese"
              value={formData.ingredients}
              onChange={handleChange}
              className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
            />
            {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}
          </div>

          {/* Preparation Steps */}
          <div className="form-group">
            <div className="label-with-hint">
              <label htmlFor="preparationSteps" className="form-label">
                Preparation Steps <span className="required-star">*</span>
              </label>
              <span className="field-hint">One step per line</span>
            </div>
            <textarea
              id="preparationSteps"
              name="preparationSteps"
              rows="4"
              placeholder="Knead dough and let it rest for 1 hour.&#10;Spread the tomato sauce evenly over the dough.&#10;Add sliced mozzarella and bake at 220°C for 12 minutes."
              value={formData.preparationSteps}
              onChange={handleChange}
              className={`form-control ${errors.preparationSteps ? 'is-invalid' : ''}`}
            />
            {errors.preparationSteps && (
              <span className="error-text">{errors.preparationSteps}</span>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Add Recipe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
