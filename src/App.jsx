import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';

export default function App() {
  return (
    <div className="min-h-screen bg-violet-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
        </Routes>
      </main>
    </div>
  );
}
