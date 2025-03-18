import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(article)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
          <CardMedia
            component="img"
            height="200"
            width="100%"
            image={article.imageUrl || './images/news-placeholder.jpg'}
            alt={article.title}
            sx={{
              objectFit: 'cover',
              backgroundColor: theme.palette.grey[200],
            }}
          />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={article.source.name}
              size="small"
              sx={{ mr: 1 }}
            />
           { article.category && <Chip
              label={article.category}
              size="small"
              color="secondary"
              variant="outlined"
            />}
          </Box>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.description}
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(article.publishedAt), 'MMM d, yyyy')}
            </Typography>
            {article.author && (
              <Typography variant="caption" color="text.secondary">
                By {article.author}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}; 