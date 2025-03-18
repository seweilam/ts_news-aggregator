import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle, NewsFilters, NewsPreferences } from '../types/news';

interface NewsState {
  articles: NewsArticle[];
  filters: NewsFilters;
  preferences: NewsPreferences;
  isLoading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  articles: [],
  filters: {
    searchQuery: '',
    dateRange: {
      from: null,
      to: null,
    },
    categories: [''],
    sources: [],//newsapi
  },
  preferences: {
    preferredSources: [],
    preferredCategories: [],
    preferredAuthors: [],
  },
  isLoading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<NewsArticle[]>) => {
      state.articles = action.payload;
    },
    setFilters: (state, action: PayloadAction<NewsFilters>) => {
      state.filters = action.payload;
    },
    setPreferences: (state, action: PayloadAction<NewsPreferences>) => {
      state.preferences = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    updateDateRange: (state, action: PayloadAction<{ from: Date | null; to: Date | null }>) => {
      state.filters.dateRange = action.payload;
    },
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.filters.categories = action.payload;
    },
    updateSources: (state, action: PayloadAction<string[]>) => {
      state.filters.sources = action.payload;
    },
    addPreferredSource: (state, action: PayloadAction<string>) => {
      if (!state.preferences.preferredSources.includes(action.payload)) {
        state.preferences.preferredSources.push(action.payload);
      }
    },
    removePreferredSource: (state, action: PayloadAction<string>) => {
      state.preferences.preferredSources = state.preferences.preferredSources.filter(
        source => source !== action.payload
      );
    },
    addPreferredCategory: (state, action: PayloadAction<string>) => {
      if (!state.preferences.preferredCategories.includes(action.payload)) {
        state.preferences.preferredCategories.push(action.payload);
      }
    },
    removePreferredCategory: (state, action: PayloadAction<string>) => {
      state.preferences.preferredCategories = state.preferences.preferredCategories.filter(
        category => category !== action.payload
      );
    },
    addPreferredAuthor: (state, action: PayloadAction<string>) => {
      if (!state.preferences.preferredAuthors.includes(action.payload)) {
        state.preferences.preferredAuthors.push(action.payload);
      }
    },
    removePreferredAuthor: (state, action: PayloadAction<string>) => {
      state.preferences.preferredAuthors = state.preferences.preferredAuthors.filter(
        author => author !== action.payload
      );
    },
  },
});

export const {
  setArticles,
  setFilters,
  setPreferences,
  setLoading,
  setError,
  updateSearchQuery,
  updateDateRange,
  updateCategories,
  updateSources,
  addPreferredSource,
  removePreferredSource,
  addPreferredCategory,
  removePreferredCategory,
  addPreferredAuthor,
  removePreferredAuthor,
} = newsSlice.actions;

export default newsSlice.reducer; 