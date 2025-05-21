# OpsEE Catalog UI

A modern, responsive web application for browsing and exploring operations catalog items. Built with Next.js and Tailwind CSS.

## Features

- 📂 Folder-style view of catalog items
- 🔍 Search functionality to quickly find items
- 🏷️ Filter by kind, class, domain, and team
- 📊 Detailed view of catalog items with all metadata
- 📱 Responsive design for desktop and mobile devices
- 🔄 API integration with backend catalog service

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend catalog service (optional - falls back to local data)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Integration

The application is configured to fetch data from a backend API:

- Default URL: `http://localhost:8080/api/catalog`
- Can be configured via `CATALOG_URL` environment variable
- Fallback: Local `catalog.json` file if the API is unavailable

## Docker

### Building the Docker Image

```bash
docker build -t opsee-catalog-ui .
```

### Running the Docker Container

```bash
docker run -p 3000:3000 -e CATALOG_URL=http://your-api-host/api/catalog opsee-catalog-ui
```

You can also use the provided script:

```bash
./docker-build.sh
```

### Environment Variables

- `CATALOG_URL`: URL of the catalog API (default: `http://localhost:8080/api/catalog`)

## Project Structure

- `/public` - Static assets including the catalog.json file (used as fallback)
- `/src/app` - Next.js app router components
- `/src/app/api` - Next.js API routes for backend integration
- `/src/components` - React components
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
