export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: NewsSource;
  category: string;
  author?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
}

export interface NewsFilters {
  searchQuery: string;
  author: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  categories: string[];
  sources: string[];
}

export interface NewsPreferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface GuardianResponse {
  response: {
    status: string;
    total: number;
    results: NewsArticle[];
  };
}

export interface NYTResponse {
  response: {
    docs: NewsArticle[];
    meta: {
      hits: number;
    };
  };
} 