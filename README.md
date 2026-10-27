# Recipe Book (MERN Stack)

A Recipe Book web application built with MongoDB, Express.js, React.js, and Node.js. It allows users to create, view, edit, and delete their favorite recipes with real-time database updates.

## Live Demo
- **Hosted Application**: [https://recipe-book-ten-beta.vercel.app](https://recipe-book-ten-beta.vercel.app)
- **API Health Check**: [https://recipe-book-ten-beta.vercel.app/api/health](https://recipe-book-ten-beta.vercel.app/api/health)

---

## Features
- **Add Recipe**: Form with validation for recipe name, category (Breakfast, Lunch, Dinner, Snack, Dessert, Beverage), cooking time, ingredients, and preparation steps.
- **View Recipes**: Clean card grid displaying recipe name, category tag, and cooking time.
- **Recipe Details**: View full ingredients list and step-by-step instructions in a detail modal.
- **Edit Recipe**: Form pre-filled with existing data to update any recipe in the database.
- **Delete Recipe**: Remove recipes with a confirmation popup before deletion.
- **Search & Filter**: Filter recipes by category or search by name/ingredient.
- **Responsive Design**: Works on mobile, tablet, and desktop screens.

---

## Tech Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (with Mongoose)

---

## Project Structure
```text
recipe-book/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── recipeController.js
│   ├── models/
│   │   └── Recipe.js
│   ├── routes/
│   │   └── recipeRoutes.js
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env
├── package.json
├── render.yaml
└── README.md
```

---

## Environment Variables (.env)
The `.env` file is included in the project for evaluation:
```env
PORT=5000
MONGO_URI=mongodb+srv://adithyaks6951_db_user:Wu1GLPZAMaQNRI8o@cluster0.lajib12.mongodb.net/recipe_book?retryWrites=true&w=majority
```

---

## Setup and Installation

### 1. Install Dependencies
From the root folder:
```bash
npm run install:all
```
Or install separately:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run Backend
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`.

*(Optional) Seed initial recipes:*
```bash
npm run seed
```

### 3. Run Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recipes` | Get all recipes (supports `?category=` and `?search=`) |
| `GET` | `/api/recipes/:id` | Get single recipe details |
| `POST` | `/api/recipes` | Add a new recipe |
| `PUT` | `/api/recipes/:id` | Update recipe by ID |
| `DELETE` | `/api/recipes/:id` | Delete recipe by ID |
| `GET` | `/api/health` | API health check |
