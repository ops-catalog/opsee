import React from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow dark:border-b dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">OpsEE Catalog</h1>
            </div>
          </div>
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-white dark:bg-gray-700 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Search catalog..."
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="ml-4">
            <Link href="/settings" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Cog6ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 