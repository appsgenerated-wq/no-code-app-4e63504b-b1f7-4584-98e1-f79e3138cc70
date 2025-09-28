import React, { useEffect, useState } from 'react';
import Manifest from '@mnfst/sdk';
import config from '../constants.js';
import { UserCircleIcon, ArrowRightOnRectangleIcon, BookOpenIcon, ShoppingCartIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const DashboardPage = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [recipes, setRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const manifest = new Manifest();

  const tabs = [
    { id: 'browse', name: 'Browse Recipes', icon: BookOpenIcon, roles: ['customer', 'chef', 'admin'] },
    ...(user.role === 'chef' || user.role === 'admin' ? [{ id: 'my-recipes', name: 'My Recipes', icon: PencilSquareIcon, roles: ['chef', 'admin'] }] : []),
    ...(user.role === 'customer' || user.role === 'admin' ? [{ id: 'my-orders', name: 'My Orders', icon: ShoppingCartIcon, roles: ['customer', 'admin'] }] : []),
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recipesRes, myRecipesRes, ordersRes] = await Promise.all([
          manifest.from('Recipe').find({ include: ['chef', 'reviews', 'categories'] }),
          (user.role === 'chef' || user.role === 'admin') ? manifest.from('Recipe').find({ filter: { chefId: user.id } }) : Promise.resolve({ data: [] }),
          (user.role === 'customer' || user.role === 'admin') ? manifest.from('Order').find({ filter: { customerId: user.id }, include: ['recipes'] }) : Promise.resolve({ data: [] }),
        ]);
        setRecipes(recipesRes.data);
        setMyRecipes(myRecipesRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id, user.role]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
    }
    switch (activeTab) {
      case 'browse':
        return <RecipeGrid recipes={recipes} title="All Recipes" />;
      case 'my-recipes':
        return <RecipeGrid recipes={myRecipes} title="My Creations" />;
      case 'my-orders':
        return <OrderList orders={orders} />;
      default:
        return <RecipeGrid recipes={recipes} title="All Recipes" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-orange-500">PlatePalette</h1>
        </div>
        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-6 py-3 text-left text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors ${activeTab === tab.id ? 'bg-orange-100 text-orange-700 font-semibold' : ''}`}>
              <tab.icon className="h-6 w-6 mr-3" />
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
            <a href={config.BACKEND_URL} target="_blank" rel="noopener noreferrer" className='flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors'>
                <UserCircleIcon className="h-6 w-6 mr-3" /> Admin Panel
            </a>
            <button onClick={onLogout} className='flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-md transition-colors'>
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{tabs.find(t => t.id === activeTab)?.name}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

const RecipeGrid = ({ recipes, title }) => (
  <div>
    {recipes.length === 0 ? (
      <div className='text-center py-10 bg-white rounded-lg shadow'>
        <p className='text-gray-500'>No recipes found.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <img className="h-56 w-full object-cover" src={recipe.mainImage} alt={recipe.title} />
            <div className="p-5">
              <div className='flex justify-between items-start'>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{recipe.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {recipe.isPublished ? 'Published' : 'Draft'}
                  </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">By {recipe.chef?.name}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{recipe.difficulty}</span>
                <span className='font-bold text-orange-500'>{recipe.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const OrderList = ({ orders }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {orders.length === 0 ? (
      <p className="text-gray-500 p-6">You have no past orders.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {orders.map(order => (
          <li key={order.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Items: {order.recipes.map(r => r.title).join(', ')}</p>
                </div>
                <div className='text-right'>
                    <p className="font-bold text-lg text-gray-900">{order.totalAmount}</p>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardPage;
