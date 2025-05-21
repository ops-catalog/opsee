import React from 'react';
import { CatalogItem } from '@/types/catalog';
import { getItemIcon, getScoreColor, getKindColor } from '@/utils/catalog';
import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CatalogItemDetailsProps {
  item: CatalogItem | null;
  onClose: () => void;
}

export default function CatalogItemDetails({ item, onClose }: CatalogItemDetailsProps) {
  if (!item) return null;

  const scoreColorClass = getScoreColor(item.score.label);
  const kindColorClass = getKindColor(item.kind);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{getItemIcon(item.class)}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{item.metadata.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={classNames("px-2 py-0.5 text-xs font-medium rounded-full", kindColorClass)}>
                    {item.kind}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {item.class}
                  </span>
                  <div className={classNames("w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs", scoreColorClass)}>
                    {item.score.label}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Classification</h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Domain</p>
                      <p className="text-sm text-gray-900">{item.classification.domain || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Team</p>
                      <p className="text-sm text-gray-900">{item.classification.team || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capability</p>
                      <p className="text-sm text-gray-900">{item.classification.capability || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tag</p>
                      <p className="text-sm text-gray-900">{item.classification.tag || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-sm text-gray-900">{item.metadata.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">License</p>
                      <p className="text-sm text-gray-900">{item.metadata.license}</p>
                    </div>
                    {item.metadata.tier && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tier</p>
                        <p className="text-sm text-gray-900">{item.metadata.tier}</p>
                      </div>
                    )}
                    {item.metadata.contact && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact</p>
                        <p className="text-sm text-gray-900">{item.metadata.contact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Owner</p>
                      <p className="text-sm text-gray-900">{item.contact.owner.id} ({item.contact.owner.type})</p>
                    </div>
                    
                    {item.contact.contributors && item.contact.contributors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contributors</p>
                        <ul className="list-disc list-inside text-sm text-gray-900">
                          {item.contact.contributors.map((contributor, index) => (
                            <li key={index}>{contributor.id} ({contributor.type})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.contact.support && item.contact.support.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Support</p>
                        <ul className="list-disc list-inside text-sm text-gray-900">
                          {item.contact.support.map((support, index) => (
                            <li key={index}>{support.id} ({support.type})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Dependencies</h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <div className="space-y-3">
                    {item.dependencies.upstream && item.dependencies.upstream.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Upstream</p>
                        <ul className="list-disc list-inside text-sm text-gray-900">
                          {item.dependencies.upstream.map((dep, index) => (
                            <li key={index}>{dep}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Upstream</p>
                        <p className="text-sm text-gray-900">None</p>
                      </div>
                    )}
                    
                    {item.dependencies.downstream && item.dependencies.downstream.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Downstream</p>
                        <ul className="list-disc list-inside text-sm text-gray-900">
                          {item.dependencies.downstream.map((dep, index) => (
                            <li key={index}>{dep}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Downstream</p>
                        <p className="text-sm text-gray-900">None</p>
                      </div>
                    )}
                    
                    {item.dependencies.providedBy && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Provided By</p>
                        <p className="text-sm text-gray-900">{item.dependencies.providedBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {item.links && item.links.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Links</h3>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <ul className="space-y-1">
                      {item.links.map((link, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium text-gray-500">{link.type}: </span>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {item.debt.entries.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Technical Debt</h3>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <ul className="space-y-2">
                      {item.debt.entries.slice(0, 5).map((entry, index) => (
                        <li key={index} className="text-sm">
                          <p className="font-medium text-gray-900">{entry.name}</p>
                          <p className="text-gray-500">{entry.description} ({entry.severity})</p>
                        </li>
                      ))}
                      {item.debt.entries.length > 5 && (
                        <li className="text-sm text-gray-500">
                          +{item.debt.entries.length - 5} more items
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 