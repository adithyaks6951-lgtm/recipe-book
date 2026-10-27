const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// In-memory fallback store initialized with sample recipes if Atlas is offline/unreachable
let inMemoryRecipes = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Fluffy Buttermilk Pancakes',
    category: 'Breakfast',
    cookingTime: 20,
    ingredients: [
      '2 cups all-purpose flour',
      '2 tbsp sugar',
      '2 tsp baking powder',
      '1/2 tsp salt',
      '2 large eggs',
      '1 3/4 cups buttermilk',
      '1/4 cup melted butter'
    ],
    preparationSteps: [
      'Whisk dry ingredients in a bowl.',
      'In a separate bowl, whisk buttermilk, eggs, and melted butter.',
      'Combine wet and dry mixtures gently.',
      'Cook on a hot griddle until bubbles form, then flip until golden.',
      'Serve warm with maple syrup and fresh fruit.'
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Creamy Tuscan Garlic Salmon',
    category: 'Dinner',
    cookingTime: 25,
    ingredients: [
      '2 fresh salmon fillets',
      '2 tbsp butter',
      '3 cloves minced garlic',
      '1/2 cup sun-dried tomatoes',
      '2 cups fresh baby spinach',
      '3/4 cup heavy cream',
      '1/4 cup grated Parmesan cheese'
    ],
    preparationSteps: [
      'Season salmon with salt and pepper, then sear in skillet for 5 mins per side.',
      'Remove salmon. Sauté garlic and sun-dried tomatoes in remaining butter.',
      'Add fresh baby spinach and stir until wilted.',
      'Pour heavy cream and Parmesan, simmering until sauce thickens.',
      'Return salmon to pan, spoon sauce over fillets, and serve hot.'
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Classic Caesar Salad',
    category: 'Lunch',
    cookingTime: 15,
    ingredients: [
      '1 head romaine lettuce, chopped',
      '1/2 cup shaved Parmesan cheese',
      '1 cup garlic croutons',
      '3 tbsp olive oil',
      '2 tbsp mayonnaise',
      '1 tbsp lemon juice',
      '1 tsp Dijon mustard'
    ],
    preparationSteps: [
      'Wash, dry, and chop the romaine lettuce.',
      'Whisk olive oil, mayonnaise, lemon juice, and Dijon mustard in a small bowl.',
      'Toss chopped romaine with dressing in a large bowl.',
      'Top with garlic croutons and shaved Parmesan.'
    ],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to normalize array input (string with newlines or commas, or array)
const normalizeArray = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }
  if (typeof input === 'string') {
    return input
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return [];
};

// @desc    Get all recipes (with optional category & search filter)
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search && search.trim() !== '') {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { ingredients: { $regex: search.trim(), $options: 'i' } }
        ];
      }
      const recipes = await Recipe.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes,
        storage: 'MongoDB Atlas'
      });
    }

    // Fallback: In-memory store
    let filtered = [...inMemoryRecipes];
    if (category && category !== 'All') {
      filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.ingredients.some((ing) => ing.toLowerCase().includes(term))
      );
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      storage: 'In-Memory (Atlas connecting / offline)'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: error.message
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Recipe ID format'
        });
      }
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: recipe
      });
    }

    // In-memory fallback
    const recipe = inMemoryRecipes.find((r) => String(r._id) === String(id));
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe details',
      error: error.message
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    // Validation
    const errors = [];
    if (!name || !name.trim()) {
      errors.push('Recipe name is required');
    }

    if (!category || !category.trim()) {
      errors.push('Category is required');
    }

    const parsedIngredients = normalizeArray(ingredients);
    if (parsedIngredients.length === 0) {
      errors.push('At least one ingredient is required');
    }

    const parsedSteps = normalizeArray(preparationSteps);
    if (parsedSteps.length === 0) {
      errors.push('At least one preparation step is required');
    }

    const parsedTime = Number(cookingTime);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      errors.push('Cooking time must be a positive number greater than 0');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
        errors
      });
    }

    if (isDbConnected()) {
      const newRecipe = await Recipe.create({
        name: name.trim(),
        category: category.trim(),
        ingredients: parsedIngredients,
        preparationSteps: parsedSteps,
        cookingTime: parsedTime
      });

      return res.status(201).json({
        success: true,
        message: 'Recipe created successfully',
        data: newRecipe
      });
    }

    // In-memory fallback
    const newRecipe = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: name.trim(),
      category: category.trim(),
      ingredients: parsedIngredients,
      preparationSteps: parsedSteps,
      cookingTime: parsedTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryRecipes.unshift(newRecipe);

    return res.status(201).json({
      success: true,
      message: 'Recipe added successfully!',
      data: newRecipe
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while creating recipe',
      error: error.message
    });
  }
};

// @desc    Update recipe by ID
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    const errors = [];
    if (name !== undefined && !name.trim()) {
      errors.push('Recipe name cannot be empty');
    }

    if (category !== undefined && !category.trim()) {
      errors.push('Category cannot be empty');
    }

    let parsedIngredients;
    if (ingredients !== undefined) {
      parsedIngredients = normalizeArray(ingredients);
      if (parsedIngredients.length === 0) {
        errors.push('At least one ingredient is required');
      }
    }

    let parsedSteps;
    if (preparationSteps !== undefined) {
      parsedSteps = normalizeArray(preparationSteps);
      if (parsedSteps.length === 0) {
        errors.push('At least one preparation step is required');
      }
    }

    let parsedTime;
    if (cookingTime !== undefined) {
      parsedTime = Number(cookingTime);
      if (isNaN(parsedTime) || parsedTime <= 0) {
        errors.push('Cooking time must be a positive number greater than 0');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
        errors
      });
    }

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Recipe ID format'
        });
      }

      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      if (name !== undefined) recipe.name = name.trim();
      if (category !== undefined) recipe.category = category.trim();
      if (parsedIngredients !== undefined) recipe.ingredients = parsedIngredients;
      if (parsedSteps !== undefined) recipe.preparationSteps = parsedSteps;
      if (parsedTime !== undefined) recipe.cookingTime = parsedTime;

      const updatedRecipe = await recipe.save();

      return res.status(200).json({
        success: true,
        message: 'Recipe updated successfully',
        data: updatedRecipe
      });
    }

    // In-memory fallback
    const index = inMemoryRecipes.findIndex((r) => String(r._id) === String(id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const current = inMemoryRecipes[index];
    const updatedRecipe = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      category: category !== undefined ? category.trim() : current.category,
      ingredients: parsedIngredients !== undefined ? parsedIngredients : current.ingredients,
      preparationSteps: parsedSteps !== undefined ? parsedSteps : current.preparationSteps,
      cookingTime: parsedTime !== undefined ? parsedTime : current.cookingTime,
      updatedAt: new Date().toISOString()
    };
    inMemoryRecipes[index] = updatedRecipe;

    return res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updatedRecipe
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while updating recipe',
      error: error.message
    });
  }
};

// @desc    Delete recipe by ID
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Recipe ID format'
        });
      }

      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      await recipe.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully'
      });
    }

    // In-memory fallback
    const index = inMemoryRecipes.findIndex((r) => String(r._id) === String(id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    inMemoryRecipes.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting recipe',
      error: error.message
    });
  }
};
