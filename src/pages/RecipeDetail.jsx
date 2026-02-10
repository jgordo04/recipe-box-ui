import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRecipe, deleteRecipe } from '../api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe(id)
      .then(setRecipe)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (!recipe) return <p className="text-red-500">Recipe not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
        <div className="flex gap-2 shrink-0">
          <Link
            to={`/recipes/${id}/edit`}
            className="bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {recipe.description && <p className="text-gray-600 mb-4">{recipe.description}</p>}

      <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
        {recipe.servings && <span>Servings: {recipe.servings}</span>}
        {recipe.prep_time_minutes && <span>· Prep: {recipe.prep_time_minutes} min</span>}
        {recipe.cook_time_minutes && <span>· Cook: {recipe.cook_time_minutes} min</span>}
      </div>

      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {recipe.tags.map((tag) => (
            <span key={tag.id} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {recipe.ingredients?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ingredients</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {recipe.steps
              .slice()
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((step) => (
                <li key={step.id}>{step.instruction}</li>
              ))}
          </ol>
        </section>
      )}
    </div>
  );
}
