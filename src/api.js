const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

export async function fetchRecipes(tag) {
  const url = tag ? `/recipes?tag=${encodeURIComponent(tag)}` : '/recipes';
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch recipes');
  const data = await res.json();
  return data.recipes;
}

export async function fetchRecipe(id) {
  const res = await fetch(`/recipes/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

export async function createRecipe(recipe) {
  const res = await fetch('/recipes', {
    method: 'POST',
    headers,
    body: JSON.stringify(recipe),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.join(', ') || 'Failed to create recipe');
  }
  return res.json();
}

export async function updateRecipe(id, recipe) {
  const res = await fetch(`/recipes/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(recipe),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.join(', ') || 'Failed to update recipe');
  }
  return res.json();
}

export async function deleteRecipe(id) {
  const res = await fetch(`/recipes/${id}`, { method: 'DELETE', headers });
  if (!res.ok) throw new Error('Failed to delete recipe');
}

export async function fetchTags() {
  const res = await fetch('/tags', { headers });
  if (!res.ok) throw new Error('Failed to fetch tags');
  const data = await res.json();
  return data.tags;
}
