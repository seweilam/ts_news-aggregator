import axios from 'axios';
import { NewsArticle, NewsFilters, NewsAPIResponse, GuardianResponse, NYTResponse } from '../types/news';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.REACT_APP_GUARDIAN_API_KEY;
const NYT_API_KEY = process.env.REACT_APP_NYT_API_KEY;

const newsApiClient = axios.create({
  baseURL: '/newsapi',
});

const guardianClient = axios.create({
  baseURL: '/guardian',
  headers: {
    'api-key': GUARDIAN_API_KEY,
  },
});

const nytClient = axios.create({
  baseURL: '/nyt',
  headers: {
    'api-key': NYT_API_KEY,
  },
});

export const fetchNews = async (filters: NewsFilters): Promise<NewsArticle[]> => {
  try {
    const fetchPromises = [];

    // Only fetch from selected sources
    if (filters.sources.includes('newsapi')) {
      fetchPromises.push(fetchFromNewsAPI(filters));
    }
    if (filters.sources.includes('guardian')) {
      fetchPromises.push(fetchFromGuardian(filters));
    }
    if (filters.sources.includes('nyt')) {
      fetchPromises.push(fetchFromNYT(filters));
    }

    // If no sources are selected, return empty array
    if (fetchPromises.length === 0) {
      return [];
    }

    const responses = await Promise.all(fetchPromises);
    const allArticles = responses.flat();

    return allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

const fetchFromNewsAPI = async (filters: NewsFilters): Promise<NewsArticle[]> => {
  try {
    const response = await newsApiClient.get<NewsAPIResponse>('/top-headlines', {
      params: {
        q: filters.searchQuery || '',
        from: filters.dateRange.from?.toISOString() || undefined,
        to: filters.dateRange.to?.toISOString() || undefined,
        category: filters.categories.join(','),
        language: 'en',
        apiKey: NEWS_API_KEY,
      },
    });

    return response.data.articles.map((article: any) => ({
      ...article,
      id: `newsapi-${article.url}`,
      source: {
        id: article.source.id || article.source.name,
        name: article.source.name,
        url: article.url,
      },
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};

const fetchFromGuardian = async (filters: NewsFilters): Promise<NewsArticle[]> => {
  try {
    const response = await guardianClient.get<GuardianResponse>('/search', {
      params: {
        q: filters.searchQuery,
        'from-date': filters.dateRange.from?.toISOString().split('T')[0],
        'to-date': filters.dateRange.to?.toISOString().split('T')[0],
        section: filters.categories.join(','),
        'show-fields': 'headline,bodyText,thumbnail,publishedAt',
      },
    });

    return response.data.response.results.map((article: any) => ({
      id: `guardian-${article.id}`,
      title: article.fields.headline,
      description: article.fields.bodyText.substring(0, 200),
      url: article.webUrl,
      imageUrl: article.fields.thumbnail,
      publishedAt: article.fields.publishedAt,
      source: {
        id: 'guardian',
        name: 'The Guardian',
        url: 'https://www.theguardian.com',
      },
      category: article.sectionName,
    }));
  } catch (error) {
    console.error('Error fetching from Guardian:', error);
    return [];
  }
};

const fetchFromNYT = async (filters: NewsFilters): Promise<NewsArticle[]> => {
  try {
    // Format dates for NYT API (YYYYMMDD)
    const beginDate = filters.dateRange.from 
      ? filters.dateRange.from.toISOString().replace(/-/g, '').split('T')[0]
      : undefined;
    
    const endDate = filters.dateRange.to
      ? filters.dateRange.to.toISOString().replace(/-/g, '').split('T')[0]
      : undefined;

    // Format categories for NYT API
    const newsDeskQuery = filters.categories.length > 0
      ? filters.categories.map(cat => `news_desk:("${cat}")`).join(' OR ')
      : undefined;

    const response = await nytClient.get<NYTResponse>('/articlesearch.json', {
      params: {
        'api-key': NYT_API_KEY,
        q: filters.searchQuery || undefined,
        begin_date: beginDate,
        end_date: endDate,
        fq: newsDeskQuery,
        sort: 'newest',
        fl: 'headline,abstract,web_url,multimedia,pub_date,news_desk,byline,_id',
        page: 0,
        rows: 10,
      },
    });

    return response.data.response.docs.map((article: any) => ({
      id: `nyt-${article._id}`,
      title: article.headline.main,
      description: article.abstract,
      url: article.web_url,
      imageUrl: article.multimedia.find((media: any) => media.subtype === 'large')?.url || 
                article.multimedia.find((media: any) => media.subtype === 'mediumThreeByTwo210')?.url,
      publishedAt: article.pub_date,
      source: {
        id: 'nyt',
        name: 'The New York Times',
        url: 'https://www.nytimes.com',
      },
      category: article.news_desk,
      author: article.byline?.original,
    }));
  } catch (error) {
    console.error('Error fetching from NYT:', error);
    return [];
  }
}; 
