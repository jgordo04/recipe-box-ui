import { useEffect, useState } from 'react';
import { fetchRecipes, fetchTags, deleteRecipe } from '../api';
import RecipeCard from '../components/RecipeCard';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags().then(setTags).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchRecipes(selectedTag || undefined)
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTag]);

  async function handleDelete(id) {
    if (!confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recipes</h1>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
