const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Initial sample recipes used if database is offline
let inMemoryRecipes = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Kerala Egg Roast with Appam',
    category: 'Breakfast',
    cookingTime: 25,
    ingredients: [
      '4 hard-boiled eggs, sliced in halves',
      '3 large red onions, thinly sliced',
      '2 tomatoes, finely chopped',
      '1 green chili, slit',
      '1 tsp ginger-garlic paste',
      '1/2 tsp turmeric powder',
      '1 tbsp Kashmiri chili powder',
      '1 tsp garam masala',
      'Fresh curry leaves and coconut oil'
    ],
    preparationSteps: [
      'Heat coconut oil in a pan, add fresh curry leaves and sliced onions.',
      'Sauté onions on medium heat with a pinch of salt until deeply golden brown.',
      'Add ginger-garlic paste and green chili; cook for 1 minute until raw aroma fades.',
      'Stir in turmeric powder, Kashmiri chili powder, and garam masala on low flame.',
      'Add chopped tomatoes and cook until soft and oil separates from the masala.',
      'Gently place the boiled egg halves into the rich gravy and coat them thoroughly.',
      'Simmer for 3 minutes and serve hot with fluffy fermented appams or parottas.'
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Homestyle Paneer Butter Masala',
    category: 'Lunch',
    cookingTime: 30,
    ingredients: [
      '250g fresh paneer cubes',
      '4 ripe tomatoes, puréed',
      '2 medium onions, finely chopped',
      '10 whole cashew nuts, soaked and blended into paste',
      '2 tbsp unsalted butter',
      '1 tbsp cooking oil',
      '1 tsp cumin seeds',
      '1 tbsp ginger-garlic paste',
      '1/2 cup fresh cream',
      '1 tsp crushed kasuri methi'
    ],
    preparationSteps: [
      'Heat 1 tbsp butter and oil in a heavy-bottomed kadai. Crackle cumin seeds.',
      'Sauté chopped onions until golden, then add ginger-garlic paste and cook for 1 minute.',
      'Pour in fresh tomato purée along with chili powder, coriander powder, and salt.',
      'Stir in cashew paste with warm water to create a velvety gravy base.',
      'Gently drop in fresh paneer cubes and simmer on low heat for 5 minutes.',
      'Finish with butter, fresh cream, and crushed kasuri methi before serving.'
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Thalassery Chicken Biryani',
    category: 'Dinner',
    cookingTime: 45,
    ingredients: [
      '500g chicken, cut into curry pieces',
      '2 cups Kaima (Jeerakasala) rice',
      '3 large onions, sliced and fried crisp',
      '1/2 cup thick fresh curd (yogurt)',
      '1 tbsp crushed ginger, garlic, and green chilis',
      '1/4 cup chopped mint leaves',
      '1/4 cup chopped fresh coriander',
      '3 tbsp pure ghee',
      'Whole spices: cloves, cardamom, cinnamon, star anise'
    ],
    preparationSteps: [
      'Marinate chicken with yogurt, crushed aromatics, and spices for 30 minutes.',
      'Cook marinated chicken with fried onions, mint, and coriander until tender.',
      'Cook seasoned kaima rice in ghee and whole spices until 85% done.',
      'Layer fragrant rice over the chicken masala.',
      'Garnish with golden fried onions, cashews, raisins, and ghee.',
      'Seal tightly with lid and dum-cook on low heat for 15 minutes.'
    ],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to normalize input into clean list of strings
const parseItemList = (input) => {
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

// Get all recipes with search and category filtering
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
        data: recipes
      });
    }

    // In-memory fallback
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
      data: filtered
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

// Get single recipe by ID
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
      message: 'Failed to fetch recipe details',
      error: error.message
    });
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    const errors = [];
    if (!name || !name.trim()) errors.push('Recipe name is required');
    if (!category || !category.trim()) errors.push('Category is required');

    const parsedIngredients = parseItemList(ingredients);
    if (parsedIngredients.length === 0) errors.push('At least one ingredient is required');

    const parsedSteps = parseItemList(preparationSteps);
    if (parsedSteps.length === 0) errors.push('At least one preparation step is required');

    const parsedTime = Number(cookingTime);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      errors.push('Cooking time must be a positive number of minutes');
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
      message: 'Recipe created successfully',
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
      message: 'Failed to create recipe',
      error: error.message
    });
  }
};

// Update recipe by ID
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    const errors = [];
    if (name !== undefined && !name.trim()) errors.push('Recipe name cannot be empty');
    if (category !== undefined && !category.trim()) errors.push('Category cannot be empty');

    let parsedIngredients;
    if (ingredients !== undefined) {
      parsedIngredients = parseItemList(ingredients);
      if (parsedIngredients.length === 0) errors.push('At least one ingredient is required');
    }

    let parsedSteps;
    if (preparationSteps !== undefined) {
      parsedSteps = parseItemList(preparationSteps);
      if (parsedSteps.length === 0) errors.push('At least one preparation step is required');
    }

    let parsedTime;
    if (cookingTime !== undefined) {
      parsedTime = Number(cookingTime);
      if (isNaN(parsedTime) || parsedTime <= 0) {
        errors.push('Cooking time must be a positive number of minutes');
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
      message: 'Recipe updated successfully',
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
      message: 'Failed to update recipe',
      error: error.message
    });
  }
};

// Delete recipe by ID
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
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message
    });
  }
};
