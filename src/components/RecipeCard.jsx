import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, onDelete }) {
  return (
    <div className="bg-violet-50 rounded-lg shadow hover:shadow-md transition p-5 flex flex-col">
      <Link to={`/recipes/${recipe.id}`} className="text-lg font-semibold text-gray-900 hover:text-emerald-900">
        {recipe.title}
      </Link>
      {recipe.description && (
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {recipe.tags?.map((tag) => (
          <span key={tag.id} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-400">
        <span>
          {[
            recipe.prep_time_minutes && `${recipe.prep_time_minutes}m prep`,
            recipe.cook_time_minutes && `${recipe.cook_time_minutes}m cook`,
          ]
            .filter(Boolean)
            .join(' · ') || '\u00A0'}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(recipe.id);
          }}
          className="text-red-400 hover:text-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
