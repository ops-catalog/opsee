"use client";

import React, { useState, useEffect } from 'react';
import { getCatalogData } from '@/utils/catalog';
import { CatalogItem as CatalogItemType } from '@/types/catalog';
import Header from '@/components/Header';
import FilterSidebar from '@/components/FilterSidebar';
import CatalogItem from '@/components/CatalogItem';
import CatalogItemDetails from '@/components/CatalogItemDetails';
import { FunnelIcon } from '@heroicons/react/24/outline';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading catalog data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex">
        {/* Mobile filter button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-10">
          <button
            type="button"
            className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-700"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FunnelIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Filter sidebar - mobile */}
        {showSidebar && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowSidebar(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white z-50">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowSidebar(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
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
            <h2 className="text-xl font-semibold text-gray-900">
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
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
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
