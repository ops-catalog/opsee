import React from 'react';
import { CatalogItem } from '@/types/catalog';

interface FilterSidebarProps {
  items: CatalogItem[];
  selectedFilters: {
    kinds: string[];
    classes: string[];
    domains: string[];
    teams: string[];
  };
  onFilterChange: (filterType: 'kinds' | 'classes' | 'domains' | 'teams', value: string) => void;
}

export default function FilterSidebar({ items, selectedFilters, onFilterChange }: FilterSidebarProps) {
  // Extract unique values for each filter category
  const uniqueKinds = Array.from(new Set(items.map(item => item.kind)));
  const uniqueClasses = Array.from(new Set(items.map(item => item.class)));
  const uniqueDomains = Array.from(new Set(items.map(item => item.classification.domain).filter(Boolean)));
  const uniqueTeams = Array.from(new Set(items.map(item => item.classification.team).filter(Boolean)));

  return (
    <div className="bg-white p-4 border-r border-gray-200 h-full overflow-y-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Kind</h3>
          <div className="space-y-1">
            {uniqueKinds.map(kind => (
              <label key={kind} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedFilters.kinds.includes(kind)}
                  onChange={() => onFilterChange('kinds', kind)}
                />
                <span className="ml-2 text-sm text-gray-700">{kind}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Class</h3>
          <div className="space-y-1">
            {uniqueClasses.map(cls => (
              <label key={cls} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedFilters.classes.includes(cls)}
                  onChange={() => onFilterChange('classes', cls)}
                />
                <span className="ml-2 text-sm text-gray-700">{cls}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Domain</h3>
          <div className="space-y-1">
            {uniqueDomains.map(domain => (
              <label key={domain} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedFilters.domains.includes(domain)}
                  onChange={() => onFilterChange('domains', domain)}
                />
                <span className="ml-2 text-sm text-gray-700">{domain}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Team</h3>
          <div className="space-y-1">
            {uniqueTeams.map(team => (
              <label key={team} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedFilters.teams.includes(team)}
                  onChange={() => onFilterChange('teams', team)}
                />
                <span className="ml-2 text-sm text-gray-700">{team}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 