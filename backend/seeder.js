const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

const Recipe = require('./models/Recipe');

const sampleRecipes = [
  {
    name: 'Fluffy Buttermilk Pancakes',
    category: 'Breakfast',
    cookingTime: 20,
    ingredients: [
      '2 cups all-purpose flour',
      '2 tablespoons sugar',
      '2 teaspoons baking powder',
      '1/2 teaspoon salt',
      '2 large eggs',
      '1 3/4 cups buttermilk',
      '1/4 cup melted butter',
      'Maple syrup for serving'
    ],
    preparationSteps: [
      'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
      'In a separate bowl, whisk together eggs, buttermilk, and melted butter.',
      'Pour wet ingredients into dry ingredients and mix gently until just combined (small lumps are okay).',
      'Heat a lightly oiled griddle or nonstick skillet over medium-high heat.',
      'Pour 1/4 cup batter per pancake. Cook until bubbles form on surface, then flip and cook until golden brown.',
      'Serve warm topped with maple syrup and fresh berries.'
    ]
  },
  {
    name: 'Classic Caesar Salad',
    category: 'Lunch',
    cookingTime: 15,
    ingredients: [
      '1 large head romaine lettuce, chopped',
      '1/2 cup freshly grated Parmesan cheese',
      '1 cup garlic croutons',
      '3 tablespoons olive oil',
      '2 tablespoons mayonnaise',
      '1 tablespoon lemon juice',
      '1 teaspoon Dijon mustard',
      '1 minced garlic clove'
    ],
    preparationSteps: [
      'Wash and dry the romaine lettuce thoroughly, then chop into bite-sized pieces.',
      'In a small bowl, whisk together mayonnaise, olive oil, lemon juice, Dijon mustard, and minced garlic.',
      'In a large salad bowl, toss the lettuce with the freshly prepared dressing.',
      'Top generously with garlic croutons and shaved Parmesan cheese before serving.'
    ]
  },
  {
    name: 'Creamy Garlic Butter Tuscan Salmon',
    category: 'Dinner',
    cookingTime: 25,
    ingredients: [
      '2 fresh salmon fillets',
      '2 tablespoons unsalted butter',
      '3 cloves garlic, minced',
      '1/2 cup sun-dried tomatoes, drained and sliced',
      '1 1/2 cups fresh baby spinach',
      '3/4 cup heavy cream',
      '1/4 cup grated Parmesan cheese',
      'Salt and black pepper to taste'
    ],
    preparationSteps: [
      'Season salmon fillets on both sides with salt and pepper.',
      'Melt butter in a large skillet over medium-high heat. Sear salmon for 5 minutes per side until cooked through, then transfer to a plate.',
      'In the same skillet, sauté minced garlic and sun-dried tomatoes for 1 minute until fragrant.',
      'Add baby spinach and cook until wilted.',
      'Reduce heat to low, stir in heavy cream and Parmesan cheese, simmering until sauce thickens slightly.',
      'Return salmon fillets to the skillet, spoon sauce over fillets, and serve hot.'
    ]
  },
  {
    name: 'Crispy Guacamole & Chips',
    category: 'Snack',
    cookingTime: 10,
    ingredients: [
      '3 ripe Haas avocados',
      '1/2 cup finely diced red onion',
      '1 roma tomato, seeded and diced',
      '1 fresh lime, juiced',
      '1/4 cup chopped fresh cilantro',
      '1/2 teaspoon kosher salt',
      '1 bag crispy corn tortilla chips'
    ],
    preparationSteps: [
      'Cut avocados in half, remove the pit, and scoop the flesh into a medium mixing bowl.',
      'Mash avocados with a fork to your desired consistency (smooth or slightly chunky).',
      'Gently fold in diced red onion, diced tomato, chopped cilantro, lime juice, and salt.',
      'Taste and adjust seasoning with extra lime juice or salt as needed.',
      'Serve immediately with warm crispy tortilla chips.'
    ]
  },
  {
    name: 'Warm Molten Lava Chocolate Cake',
    category: 'Dessert',
    cookingTime: 30,
    ingredients: [
      '100g dark baking chocolate (70% cocoa)',
      '1/2 cup unsalted butter',
      '2 whole eggs + 2 egg yolks',
      '1/3 cup granulated sugar',
      '2 tablespoons all-purpose flour',
      'Pinch of salt',
      'Vanilla ice cream for serving'
    ],
    preparationSteps: [
      'Preheat oven to 200°C (400°F). Grease ramekins with butter and dust with cocoa powder.',
      'Melt dark chocolate and butter together in a heatproof bowl set over simmering water; stir until smooth.',
      'In another bowl, beat eggs, egg yolks, and sugar together until pale and slightly thick.',
      'Fold the chocolate mixture and flour gently into the eggs.',
      'Divide batter into prepared ramekins and bake for 12 minutes until edges are set but center remains soft.',
      'Run a butter knife around edges, invert onto dessert plates, and serve immediately with vanilla ice cream.'
    ]
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_book';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas for seeding.');

    await Recipe.deleteMany({});
    console.log('Cleared existing recipes.');

    await Recipe.insertMany(sampleRecipes);
    console.log(`Successfully seeded ${sampleRecipes.length} recipes!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
