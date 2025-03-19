import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { RootState } from '../store/store';
import { fetchNews } from '../services/newsService';
import { NewsFilters, NewsArticle } from '../types/news';
import {
  setArticles,
  setLoading,
  setError,
  setTotalPages,
} from '../store/newsSlice';

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
}

export const useNews = () => {
  const dispatch = useDispatch();
  const { filters, page, totalPages } = useSelector((state: RootState) => state.news);

  const { data: response, isLoading, error } = useQuery<NewsResponse>(
    ['news', filters, page],
    () => fetchNews(filters, page),
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  useEffect(() => {
    if (response) {
      dispatch(setArticles(response.articles));
      
      // Calculate total pages (assuming 10 articles per page)
      const calculatedTotalPages = Math.ceil(response.totalResults / 10);
      dispatch(setTotalPages(calculatedTotalPages));
    }
  }, [response, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    }
  }, [error, dispatch]);

  return {
    articles: response?.articles || [],
    isLoading,
    error,
    filters,
    page,
    totalPages,
  };
}; 