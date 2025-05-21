import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Get catalog URL from environment variable or use default
const CATALOG_URL = process.env.CATALOG_URL || 'http://localhost:8080/api/catalog';

export async function GET() {
  try {
    // Try to fetch from the external API first
    try {
      console.log(`Fetching catalog data from: ${CATALOG_URL}`);
      const response = await fetch(CATALOG_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
      
      console.warn(`External API at ${CATALOG_URL} not available, falling back to local catalog.json`);
    } catch (apiError) {
      console.warn(`Error fetching from external API at ${CATALOG_URL}, falling back to local catalog.json:`, apiError);
    }

    // Fallback to local catalog.json
    const filePath = path.join(process.cwd(), 'public', 'catalog.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog data' },
      { status: 500 }
    );
  }
} 