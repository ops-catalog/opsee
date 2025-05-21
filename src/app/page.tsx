"use client";

"use client";

import React, { useState, useEffect } from 'react';
import { getCatalogData } from '@/utils/catalog';
import { CatalogItem as CatalogItemType } from '@/types/catalog';
import Header from '@/components/Header';
import FilterSidebar from '@/components/FilterSidebar';
import CatalogItem from '@/components/CatalogItem';
import CatalogItemDetails from '@/components/CatalogItemDetails';
import { FunnelIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Added InformationCircleIcon, XMarkIcon

export default function Home() {
  const [catalogItems, setCatalogItems] = useState<CatalogItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItemType | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    kinds: [] as string[],
    classes: [] as string[],
    domains: [] as string[],
    teams: [] as string[],
  });

  useEffect(() => {
    async function loadCatalogData() {
      try {
        const data = await getCatalogData();
        setCatalogItems(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading catalog data:', err);
        setError('Failed to load catalog data');
        setLoading(false);
      }
    }

    loadCatalogData();
  }, []);

  const handleFilterChange = (filterType: 'kinds' | 'classes' | 'domains' | 'teams', value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = [...prev[filterType]];
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilters, value]
        };
      }
    });
  };

  const filteredItems = catalogItems.filter(item => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !item.metadata.name.toLowerCase().includes(query) &&
        !item.class.toLowerCase().includes(query) &&
        !item.kind.toLowerCase().includes(query) &&
        !(item.classification.domain && item.classification.domain.toLowerCase().includes(query)) &&
        !(item.classification.team && item.classification.team.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    // Apply checkbox filters
    if (selectedFilters.kinds.length > 0 && !selectedFilters.kinds.includes(item.kind)) {
      return false;
    }
    if (selectedFilters.classes.length > 0 && !selectedFilters.classes.includes(item.class)) {
      return false;
    }
    if (selectedFilters.domains.length > 0 && !selectedFilters.domains.includes(item.classification.domain)) {
      return false;
    }
    if (selectedFilters.teams.length > 0 && !selectedFilters.teams.includes(item.classification.team)) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8"> {/* Added padding to text-center div */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 dark:border-blue-500 mx-auto"></div> {/* Made spinner border thicker and adjusted dark mode color */}
          <p className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading catalog data...</p> {/* Adjusted text, margin */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Changed bg-gray-50 to bg-gray-100 */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex">
        {/* Mobile filter button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-30"> {/* Increased bottom/right positioning, higher z-index */}
          <button
            type="button"
            className="bg-blue-600 dark:bg-blue-700 p-4 rounded-full text-white shadow-xl hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-150" // Increased padding, shadow, added focus ring
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FunnelIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Filter sidebar - mobile */}
        {showSidebar && (
          <div className="fixed inset-0 z-40 lg:hidden"> {/* Higher z-index */}
            <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-60" onClick={() => setShowSidebar(false)}></div> {/* Darker overlay */}
            <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 z-50 shadow-xl"> {/* Increased width, added shadow */}
              <div className="h-full flex flex-col">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"> {/* Increased padding */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2> {/* Matched FilterSidebar title style */}
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500" // Styled like panel close button
                    onClick={() => setShowSidebar(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2"> {/* Added small padding to content */}
                  <FilterSidebar
                    items={catalogItems}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter sidebar - desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16">
          <FilterSidebar
            items={catalogItems}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in catalog
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <CatalogItem 
                key={item.id} 
                item={item} 
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16"> {/* Increased padding */}
              <InformationCircleIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" /> {/* Icon and styling */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No items found</h3> {/* Adjusted text style */}
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters.</p> {/* Adjusted text style */}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <CatalogItemDetails 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
