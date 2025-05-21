import React from 'react';
import { CatalogItem as CatalogItemType } from '@/types/catalog';
import { getItemIcon, getScoreColor, getKindColor } from '@/utils/catalog';
import classNames from 'classnames';

interface CatalogItemProps {
  item: CatalogItemType;
  onClick: (item: CatalogItemType) => void;
}

export default function CatalogItem({ item, onClick }: CatalogItemProps) {
  const scoreColorClass = getScoreColor(item.score.label);
  const kindColorClass = getKindColor(item.kind);
  
  return (
    <div 
      className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-md dark:hover:shadow-blue-700/50 hover:scale-[1.02] transition-all duration-150 ease-in-out cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="text-3xl mb-3 text-gray-700 dark:text-gray-300">{getItemIcon(item.class)}</div> {/* Icon size to 3xl, mb to 3 */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center mb-2 truncate w-full"> {/* mb to 2 */}
        {item.metadata.name}
      </h3>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className={classNames("px-2 py-0.5 text-xs font-medium rounded-full", kindColorClass)}>
          {item.kind}
        </span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {item.class}
        </span>
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {item.classification.domain || 'No Domain'}
        </span>
        <div className={classNames("w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs", scoreColorClass)}>
          {item.score.label}
        </div>
      </div>
    </div>
  );
} 