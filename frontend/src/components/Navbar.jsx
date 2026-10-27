import React from 'react';
import { ChefHat, Search, PlusCircle, X } from 'lucide-react';

export default function Navbar({ searchTerm, onSearchChange, onOpenAddModal }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <ChefHat size={26} className="brand-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">RecipeBook</h1>
            <span className="brand-subtitle">My Recipes</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Add Recipe Action Button */}
        <div className="navbar-actions">
          <button className="btn btn-primary btn-add-recipe" onClick={onOpenAddModal}>
            <PlusCircle size={18} />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>
    </header>
  );
}
