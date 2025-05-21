import { CatalogData } from '@/types/catalog';

export async function getCatalogData(): Promise<CatalogData> {
  const response = await fetch('/api/catalog');
  
  if (!response.ok) {
    throw new Error('Failed to fetch catalog data');
  }
  
  return response.json();
}

export function getItemIcon(itemClass: string): string {
  const iconMap: Record<string, string> = {
    'App': '🖥️',
    'Repository': '📁',
    'Topic': '📢',
    'Kafka': '📨',
    'Postgres': '🗄️',
    'SumoLogic': '📊',
    'SaaS': '☁️',
    'Schema': '📝',
    'Mailbox': '📧',
    'Gmail': '📧',
    'Git': '🔄',
    'Keyspace': '🔑',
  };
  
  return iconMap[itemClass] || '📦';
}

export function getScoreColor(score: string): string {
  const scoreColorMap: Record<string, string> = {
    'A': 'bg-green-500',
    'B': 'bg-green-400',
    'C': 'bg-yellow-400',
    'D': 'bg-yellow-500',
    'E': 'bg-red-400',
    'F': 'bg-red-500',
  };
  
  return scoreColorMap[score] || 'bg-gray-400';
}

export function getKindColor(kind: string): string {
  const kindColorMap: Record<string, string> = {
    'Component': 'bg-blue-100 text-blue-800',
    'Resource': 'bg-purple-100 text-purple-800',
    'Store': 'bg-green-100 text-green-800',
    'Service': 'bg-yellow-100 text-yellow-800',
  };
  
  return kindColorMap[kind] || 'bg-gray-100 text-gray-800';
} 