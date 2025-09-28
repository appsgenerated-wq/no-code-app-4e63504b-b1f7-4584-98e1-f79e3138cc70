import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import config from '../constants.js';
import { StarIcon } from '@heroicons/react/24/solid';

const LandingPage = ({ onLogin }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const manifest = new Manifest();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await manifest.from('Recipe').find({
          filter: { isPublished: true },
          include: ['chef', 'reviews'],
          perPage: 6,
          sort: { createdAt: 'desc' },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
            alt="Assortment of delicious food"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">PlatePalette</h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">Discover, create, and share amazing recipes from chefs around the world.</p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <button
                onClick={() => onLogin('chef@example.com', 'password')}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 sm:px-8 transition-colors"
              >
                Login as Chef
              </button>
              <a
                href={config.BACKEND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-orange-600 bg-white hover:bg-orange-50 sm:px-8 transition-colors"
              >
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Recipes Section */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Latest Creations</h2>
          {loading ? (
            <div className="text-center">Loading recipes...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  <img className="h-56 w-full object-cover" src={recipe.mainImage} alt={recipe.title} />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">by {recipe.chef?.name || 'Anonymous'}</p>
                     <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-gray-600 ml-1 text-sm">{recipe.reviews?.length > 0 ? (recipe.reviews.reduce((acc, r) => acc + r.rating, 0) / recipe.reviews.length).toFixed(1) : 'No reviews'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
