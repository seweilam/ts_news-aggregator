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
- Yarn package manager
- Docker and Docker Compose (optional, for containerized deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
REACT_APP_NEWS_API_KEY=your_newsapi_key
REACT_APP_GUARDIAN_API_KEY=your_guardian_key
REACT_APP_NYT_API_KEY=your_nyt_key
```

You can obtain API keys from:
- NewsAPI: https://newsapi.org/
- The Guardian: https://open-platform.theguardian.com/access/
- The New York Times: https://developer.nytimes.com/

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Install dependencies:
```bash
yarn install
```

## Development

Run the development server:

```bash
yarn dev
```

The application will be available at http://localhost:3000

## Docker Deployment

1. Build the Docker image:
```bash
yarn docker:build
```

2. Run the container:
```bash
yarn docker:up
```

3. Stop the container:
```bash
yarn docker:down
```

## Production Build

1. Build the application:
```bash
yarn build
```

2. Start the production server:
```bash
yarn start
```

## Technologies Used

- React.js
- TypeScript
- Material-UI
- Redux Toolkit
- React Query
- Axios
- Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
