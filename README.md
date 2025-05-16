# News Aggregator

A modern news aggregator website that pulls articles from various sources and displays them in a clean, easy-to-read format. Built with ReactJs, TypeScript, and Material-UI.

## Features

- Article search and filtering by keyword, date, category, and source
- Personalized news feed with preferred sources, categories, and authors
- Mobile-responsive design
- Real-time updates from multiple news sources
- Clean and modern UI with Material-UI components

## Data Sources

The application fetches news from the following sources:
- NewsAPI
- The Guardian
- The New York Times

## Prerequisites

- Node.js 18.x or later
- pmpm package manager
- Docker and Docker Compose (optional, for containerized deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
REACT_APP_NEWS_API_KEY=your_newsapi_key
REACT_APP_GUARDIAN_API_KEY=your_guardian_key
REACT_APP_NYT_API_KEY=your_nyt_key
NODE_ENV=development
```

You can obtain API keys from:
- NewsAPI: https://newsapi.org/
- The Guardian: https://open-platform.theguardian.com/access/
- The New York Times: https://developer.nytimes.com/

## Installation

1. Clone the repository:
```bash
git clone https://github.com/seweilam/ts_news-aggregator
cd ts_news-aggregator
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Run the development server:

```bash
pnpm start
```

The application will be available at http://localhost:3000

## Docker Deployment

1. Build the Docker image:
```bash
pnpm docker:build
```

2. Run the container:
```bash
pnpm docker:up
```

3. Stop the container:
```bash
pnpm docker:down
```

## Technologies Used

- React.js
- TypeScript
- Material-UI
- Redux Toolkit
- React Query
- Axios
- Docker


## License

This project is licensed under the MIT License - see the LICENSE file for details.
