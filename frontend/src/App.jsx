import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import RecipeCard from './components/RecipeCard';
import RecipeFormModal from './components/RecipeFormModal';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from './services/api';
import { Plus, BookOpen, Clock, Layers, Sparkles, RefreshCw } from 'lucide-react';
import './App.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage'];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch recipes from REST API
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRecipes(selectedCategory, searchTerm);
      setRecipes(data);
    } catch (err) {
      showToast(err.message || 'Error fetching recipes from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Handle Add / Edit Submission
  const handleFormSubmit = async (formData, recipeId) => {
    try {
      if (recipeId) {
        // Update existing recipe
        const res = await updateRecipe(recipeId, formData);
        showToast(res.message || 'Recipe updated successfully!', 'success');
        // If currently viewing the updated recipe, update the preview modal too
        if (viewingRecipe && viewingRecipe._id === recipeId) {
          setViewingRecipe(res.data);
        }
      } else {
        // Create new recipe
        const res = await createRecipe(formData);
        showToast(res.message || 'Recipe added successfully!', 'success');
      }
      // Auto-refresh the list without manual page reload
      await loadRecipes();
    } catch (err) {
      throw err;
    }
  };

  // Open Edit Modal
  const handleEditClick = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  // Open Add Modal
  const handleAddClick = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingRecipe) return;
    try {
      setIsDeleting(true);
      const res = await deleteRecipe(deletingRecipe._id);
      showToast(res.message || 'Recipe deleted successfully!', 'success');
      setDeletingRecipe(null);
      // Auto-refresh the list without manual page reload
      await loadRecipes();
    } catch (err) {
      showToast(err.message || 'Failed to delete recipe', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalCount = recipes.length;
  const avgCookTime = totalCount
    ? Math.round(recipes.reduce((acc, r) => acc + (r.cookingTime || 0), 0) / totalCount)
    : 0;

  return (
    <div className="app-layout">
      {/* Navbar with search and quick actions */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAddModal={handleAddClick}
      />

      <main className="main-content">
        <div className="container">
          {/* Hero / Header Section */}
          <section className="hero-banner">
            <div className="hero-content">
              <h2 className="hero-title">Recipe Collection</h2>
              <p className="hero-subtitle">
                Save and organize your favorite recipes, cooking times, and preparation instructions.
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon-wrap icon-purple">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="stat-number">{totalCount}</div>
                  <div className="stat-label">Total Recipes</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap icon-amber">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="stat-number">{avgCookTime}m</div>
                  <div className="stat-label">Avg. Cook Time</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap icon-emerald">
                  <Layers size={20} />
                </div>
                <div>
                  <div className="stat-number">{CATEGORIES.length - 1}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter Pills & Refresh */}
          <div className="filter-bar">
            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              className="btn btn-ghost"
              onClick={loadRecipes}
              title="Refresh Recipes"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Recipes Grid / States */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching delicious recipes from MongoDB Atlas...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍳</div>
              <h3 className="empty-state-title">No Recipes Found</h3>
              <p className="empty-state-text">
                {searchTerm || selectedCategory !== 'All'
                  ? 'No recipes match your current search or category filter. Try clearing your filters!'
                  : 'Your recipe book is currently empty. Start by adding your first delicious recipe!'}
              </p>
              <button className="btn btn-primary btn-lg" onClick={handleAddClick}>
                <Plus size={20} />
                <span>Add Your First Recipe</span>
              </button>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onView={setViewingRecipe}
                  onEdit={handleEditClick}
                  onDelete={setDeletingRecipe}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>Recipe Book App</p>
          <p className="footer-subtext">React • Node.js • Express • MongoDB</p>
        </div>
      </footer>

      {/* Add / Edit Recipe Modal */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingRecipe}
      />

      {/* View Recipe Details Modal */}
      <RecipeDetailsModal
        recipe={viewingRecipe}
        onClose={() => setViewingRecipe(null)}
        onEdit={handleEditClick}
        onDelete={setDeletingRecipe}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        recipe={deletingRecipe}
        onCancel={() => setDeletingRecipe(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
