import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { SearchFilters } from './components/SearchFilters';
import { NewsGrid } from './components/NewsGrid';
import { useNews } from './hooks/useNews';
import { useDispatch } from 'react-redux';
import { setFilters } from './store/newsSlice';
import { NewsFilters, NewsArticle } from './types/news';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { articles, isLoading, error, filters } = useNews();

  const handleFiltersChange = (newFilters: NewsFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleArticleClick = (article: NewsArticle) => {
    window.open(article.url, '_blank');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <NewsGrid
          articles={articles || []}
          isLoading={isLoading}
          error={error as string | null}
          onArticleClick={handleArticleClick}
        />
      </Layout>
    </ThemeProvider>
  );
};

export default App; 