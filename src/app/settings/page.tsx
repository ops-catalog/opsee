"use client";

"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import classNames from 'classnames'; // Import classnames

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const getButtonClass = (buttonTheme: string) => { // Renamed currentTheme to buttonTheme for clarity
    const isActive = theme === buttonTheme;
    return classNames(
      'px-4 py-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800', // Changed rounded-md to rounded-lg
      {
        'bg-blue-600 text-white hover:bg-blue-700': isActive,
        'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600': !isActive,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-8"> {/* Adjusted background, added sm:p-8 */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900 dark:text-gray-100">Settings</h1> {/* Increased size and margin */}

        <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg"> {/* Increased padding, rounded-xl, shadow-lg */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Appearance</h2> {/* Increased size and margin */}
          
          <div>
            <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200">Theme</h3> {/* Increased size and margin */}
            <div className="flex flex-wrap gap-3"> {/* Added flex-wrap and gap */}
              <button onClick={() => setTheme('light')} className={getButtonClass('light')}>
                Light
              </button>
              <button onClick={() => setTheme('dark')} className={getButtonClass('dark')}>
                Dark
              </button>
              <button onClick={() => setTheme('system')} className={getButtonClass('system')}>
                System
              </button>
            </div>
            <p className="mt-5 text-sm text-gray-600 dark:text-gray-400"> {/* Increased margin */}
              Current system theme: <span className="font-semibold">{resolvedTheme}</span> {/* Changed "actual theme" to "system theme" for clarity */}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
