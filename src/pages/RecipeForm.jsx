import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecipe, fetchTags, createRecipe, updateRecipe } from '../api';

const emptyIngredient = { name: '', quantity: '', unit: '' };
const emptyStep = { instruction: '', position: '' };

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState([{ ...emptyIngredient }]);
  const [steps, setSteps] = useState([{ ...emptyStep }]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTags().then(setAllTags).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetchRecipe(id).then((r) => {
      setTitle(r.title);
      setDescription(r.description || '');
      setServings(r.servings ?? '');
      setPrepTime(r.prep_time_minutes ?? '');
      setCookTime(r.cook_time_minutes ?? '');
      setIngredients(
        r.ingredients.length > 0
          ? r.ingredients.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity || '', unit: i.unit || '' }))
          : [{ ...emptyIngredient }],
      );
      setSteps(
        r.steps.length > 0
          ? r.steps
              .slice()
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((s) => ({ id: s.id, instruction: s.instruction, position: s.position ?? '' }))
          : [{ ...emptyStep }],
      );
      setSelectedTagIds(r.tags.map((t) => t.id));
    });
  }, [id, isEdit]);

  function updateIngredient(index, field, value) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  }

  function updateStep(index, field, value) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function toggleTag(tagId) {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      title,
      description: description || null,
      servings: servings ? Number(servings) : null,
      prep_time_minutes: prepTime ? Number(prepTime) : null,
      cook_time_minutes: cookTime ? Number(cookTime) : null,
      tag_ids: selectedTagIds,
      ingredients_attributes: ingredients
        .filter((i) => i.name.trim())
        .map((i) => ({
          ...(i.id ? { id: i.id } : {}),
          name: i.name,
          quantity: i.quantity || null,
          unit: i.unit || null,
        })),
      steps_attributes: steps
        .filter((s) => s.instruction.trim())
        .map((s, idx) => ({
          ...(s.id ? { id: s.id } : {}),
          instruction: s.instruction,
          position: s.position ? Number(s.position) : idx + 1,
        })),
    };

    try {
      const saved = isEdit ? await updateRecipe(id, payload) : await createRecipe(payload);
      navigate(`/recipes/${saved.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>

      {error && <p className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className={inputClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
            <input className={inputClass} type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
            <input className={inputClass} type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
            <input className={inputClass} type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          </div>
        </div>

        {allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-emerald-800 text-white border-amber-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">Ingredients</legend>
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className={inputClass}
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                  style={{ maxWidth: '5rem' }}
                />
                <input
                  className={inputClass}
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                  style={{ maxWidth: '5rem' }}
                />
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-600 text-lg leading-none"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIngredients((prev) => [...prev, { ...emptyIngredient }])}
            className="mt-2 text-sm text-emerald-900 hover:text-amber-900"
          >
            + Add Ingredient
          </button>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">Steps</legend>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-gray-400 text-sm pt-2 w-6 text-right shrink-0">{idx + 1}.</span>
                <textarea
                  className={`${inputClass} flex-1`}
                  rows={2}
                  placeholder="Instruction"
                  value={step.instruction}
                  onChange={(e) => updateStep(idx, 'instruction', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setSteps((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-600 text-lg leading-none pt-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSteps((prev) => [...prev, { ...emptyStep }])}
            className="mt-2 text-sm text-emerald-900 hover:text-amber-900"
          >
            + Add Step
          </button>
        </fieldset>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-800 text-white px-5 py-2 rounded-md font-semibold hover:bg-emerald-900 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Update Recipe' : 'Create Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
