const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Recipe name must be at least 2 characters'],
      maxlength: [100, 'Recipe name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Other'],
        message: '{VALUE} is not a valid category'
      }
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0 && val.some((item) => item.trim().length > 0);
        },
        message: 'At least one ingredient is required'
      }
    },
    preparationSteps: {
      type: [String],
      required: [true, 'Preparation steps are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0 && val.some((item) => item.trim().length > 0);
        },
        message: 'At least one preparation step is required'
      }
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be a positive number of minutes (at least 1)']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
