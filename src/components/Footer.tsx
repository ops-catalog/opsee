"use client"; // Though not strictly necessary for this simple component, good practice if it might evolve

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} OpsEE Catalog. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline">
            Privacy Policy
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
          <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
