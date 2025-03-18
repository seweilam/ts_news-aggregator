import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { RootState } from '../store/store';
import { fetchNews } from '../services/newsService';
import { NewsFilters } from '../types/news';
import {
  setArticles,
  setLoading,
  setError,
} from '../store/newsSlice';

export const useNews = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.news);

  const { data: articles, isLoading, error } = useQuery(
    ['news', filters],
    () => fetchNews(filters),
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  useEffect(() => {
    if (articles) {
      dispatch(setArticles(articles));
    }
  }, [articles, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    }
  }, [error, dispatch]);

  return {
    articles,
    isLoading,
    error,
    filters,
  };
}; 