import React from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import { NewsCard } from './NewsCard';
import { NewsArticle } from '../types/news';

interface NewsGridProps {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  onArticleClick: (article: NewsArticle) => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  isLoading,
  error,
  onArticleClick,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No articles found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} key={article.id}>
          <NewsCard article={article} onClick={onArticleClick} />
        </Grid>
      ))}
    </Grid>
  );
}; 