import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { getRecentItems } from '../services/itemService';

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const response = await getRecentItems(8); // Fetch 8 recent items
        setRecentItems(response.data || response); // Handle both response formats
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent items:', err);
        setError('Failed to load recent items');
        setLoading(false);
      }
    };
    
    fetchRecentItems();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Lost Something?
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                The PICT College Lost & Found portal helps students find their lost belongings. 
                Browse through items that have been found on campus and claim what's yours.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/lost-items"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50"
                >
                  Browse Lost Items
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/pict_clg_image.jpg"
                alt="Lost and Found"
                className="h-96"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-secondary-500 mx-auto">
              Reuniting students with their lost belongings in a few simple steps.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Find Item</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Lost items found on campus are submitted to the security office by students or staff.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Submit Info</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Security personnel log the item with details and photos in our system.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Claim & Collect</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Students can browse, identify their belongings, claim online, and collect items from security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="py-12 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Recently Found Items
            </h2>
            <Link
              to="/lost-items"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Items →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getRecentItems(8)
                    .then(data => {
                      setRecentItems(data.data || data);
                      setLoading(false);
                    })
                    .catch(err => {
                      console.error('Error retrying:', err);
                      setError('Failed to load recent items');
                      setLoading(false);
                    });
                }}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-secondary-500">No items have been found recently.</p>
                  <p className="mt-2 text-sm text-secondary-400">Check back later or contact the lost and found office.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="block">Missing something?</span>
            <span className="block text-primary-200">Check our lost and found database.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/lost-items"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;