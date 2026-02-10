import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-emerald-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Recipe Box
        </Link>
        <Link
          to="/recipes/new"
          className="bg-white text-emerald-900 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-50 transition"
        >
          + New Recipe
        </Link>
      </div>
    </nav>
  );
}
