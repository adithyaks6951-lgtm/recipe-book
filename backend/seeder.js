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
    ]
  },
  {
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
      'Pour in fresh tomato purée along with chili powder, coriander powder, and salt. Cook until oil leaves sides.',
      'Stir in the cashew paste with half a cup of warm water to create a creamy gravy base.',
      'Gently drop in the fresh paneer cubes and simmer on low heat for 5 minutes.',
      'Finish with remaining butter, fresh cream, and crushed kasuri methi before taking off heat.'
    ]
  },
  {
    name: 'Thalassery Chicken Biryani',
    category: 'Dinner',
    cookingTime: 45,
    ingredients: [
      '500g chicken, cut into curry pieces',
      '2 cups Kaima (Jeerakasala) rice',
      '3 large onions, sliced and fried crisp (bista)',
      '1/2 cup thick fresh curd (yogurt)',
      '1 tbsp crushed ginger, garlic, and green chilis',
      '1/4 cup chopped mint leaves',
      '1/4 cup chopped fresh coriander',
      '3 tbsp pure ghee',
      'Whole spices: cloves, cardamom, cinnamon, star anise'
    ],
    preparationSteps: [
      'Marinate chicken pieces with yogurt, crushed ginger-garlic-chili paste, turmeric, and salt for 30 minutes.',
      'Cook marinated chicken in a wide pot with half of the fried onions, mint, and coriander until tender and juicy.',
      'In a separate pot, heat ghee, temper whole spices, add washed kaima rice, and cook with measured boiling water until 85% done.',
      'Layer the cooked fragrant rice over the chicken masala.',
      'Garnish top layer with remaining golden fried onions, cashews, raisins, and a drizzle of ghee.',
      'Seal pot tightly with a lid and cook on dum (very low heat) for 15 minutes. Mix gently while serving.'
    ]
  },
  {
    name: 'Crispy Banana Fritters (Pazham Pori)',
    category: 'Snack',
    cookingTime: 15,
    ingredients: [
      '3 ripe Nendran bananas, sliced lengthwise',
      '1 cup all-purpose flour (maida)',
      '2 tbsp rice flour (for extra crispiness)',
      '2 tbsp sugar',
      '1/4 tsp turmeric powder (for golden hue)',
      '1/4 tsp crushed cardamom powder',
      'Pinch of baking soda and salt',
      'Coconut oil or vegetable oil for deep frying'
    ],
    preparationSteps: [
      'In a mixing bowl, combine all-purpose flour, rice flour, sugar, turmeric, cardamom powder, and a pinch of salt.',
      'Gradually whisk in water to form a smooth, medium-thick dipping batter (similar to pancake batter).',
      'Heat oil in a deep frying pan over medium heat.',
      'Dip each banana slice into the batter, coating both sides evenly.',
      'Gently drop into hot oil and fry until both sides turn crisp and golden yellow.',
      'Drain on paper towels and serve piping hot with black tea (sulaimani).'
    ]
  },
  {
    name: 'Cardamom Scented Mango Kheer',
    category: 'Dessert',
    cookingTime: 25,
    ingredients: [
      '1 liter full-cream milk',
      '1/4 cup Basmati or Kaima rice, soaked and coarsely broken',
      '1 cup sweet Alphonso mango pulp',
      '1/3 cup sugar or condensed milk',
      '1/2 tsp green cardamom powder',
      '12 roasted slivered almonds and pistachios',
      'A few strands of saffron soaked in warm milk'
    ],
    preparationSteps: [
      'Bring full-cream milk to a rolling boil in a thick-bottomed pot, stirring continuously to prevent scorching.',
      'Add the soaked, coarsely crushed rice and simmer on medium-low heat until rice is tender and milk thickens.',
      'Add sugar and saffron milk, stirring until completely dissolved.',
      'Remove kheer from heat and allow it to cool down to room temperature.',
      'Gently fold in fresh sweet mango pulp and cardamom powder until smooth and vibrant yellow.',
      'Chill in the refrigerator for 1 hour, garnish with roasted slivered almonds and pistachios, and serve cold.'
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
