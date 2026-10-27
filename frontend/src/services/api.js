const API_BASE = '/api/recipes';

export async function getRecipes(category, search) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch recipes');
  }
  return data.data || [];
}

export async function getRecipeById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch recipe details');
  }
  return data.data;
}

export async function createRecipe(recipeData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create recipe');
  }
  return data;
}

export async function updateRecipe(id, recipeData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update recipe');
  }
  return data;
}

export async function deleteRecipe(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete recipe');
  }
  return data;
}
