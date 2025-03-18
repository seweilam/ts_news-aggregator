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
    // Format search query with advanced syntax
    let searchQuery = filters.searchQuery;
    const queryParts = [];

    // Add search query if exists
    if (searchQuery) {
      queryParts.push(`(${searchQuery})`);
    }

    // Add categories if exist
    if (filters.categories.length > 0) {
      const categoryQuery = filters.categories
        .map(cat => `"${cat}"`)
        .join(' OR ');
      queryParts.push(`(${categoryQuery})`);
    }

    // Add author if exists
    if (filters.author) {
      queryParts.push(`${filters.author}`);
    }

    // Combine all query parts with AND
    const finalQuery = queryParts.join(' AND ');

    const response = await newsApiClient.get<NewsAPIResponse>('/everything', {
      params: {
        q: finalQuery || undefined,
        from: filters.dateRange.from?.toISOString() || undefined,
        to: filters.dateRange.to?.toISOString() || undefined,
        language: 'en',
        apiKey: NEWS_API_KEY,
        pageSize: 10,
        page: 1,
        // Add searchIn parameter to search in title and content
        searchIn: 'title,content',
        // Add sortBy parameter for better relevance
        sortBy: 'relevancy',
      },
    });

    return response.data.articles.map((article: any) => ({
      ...article,
      id: `newsapi-${article.url}`,
      imageUrl: article.urlToImage,
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
    // Build query parameters
    const params: Record<string, any> = {
      'api-key': GUARDIAN_API_KEY,
      q: filters.searchQuery || undefined,
      'from-date': filters.dateRange.from?.toISOString().split('T')[0] || undefined,
      'to-date': filters.dateRange.to?.toISOString().split('T')[0] || undefined,
      section: filters.categories[0] !== 'all' ? filters.categories[0] : undefined,
      'show-fields': 'headline,bodyText,thumbnail,publishedAt,shortUrl,body',
      'show-tags': 'contributor',
      'order-by': 'newest',
      'page-size': 10,
      'page': 1,
      'show-references': 'all',
      'show-elements': 'all',
      'show-rights': 'syndicatable',
      'show-section': true,
      'show-blocks': 'all',
      'show-pillar': true,
    };

    // Add author filter if provided
    if (filters.author) {
      // Format author name for Guardian API (replace spaces with hyphens and make lowercase)
      const formattedAuthor = filters.author.toLowerCase().replace(/\s+/g, '-');
      params.tag = `profile/${formattedAuthor}`;
    }

    const response = await guardianClient.get<GuardianResponse>('/search', { params });

    return response.data.response.results.map((article: any) => ({
      id: `guardian-${article.id}`,
      title: article.fields?.headline || article.webTitle,
      description: article.fields?.bodyText?.substring(0, 200) || article.webTitle,
      url: article.fields?.shortUrl || article.webUrl,
      imageUrl: article.fields?.thumbnail || undefined,
      publishedAt: article.fields?.publishedAt || article.webPublicationDate,
      source: {
        id: 'guardian',
        name: 'The Guardian',
        url: 'https://www.theguardian.com',
      },
      category: article.sectionName,
      type: article.type,
      pillarName: article.pillarName,
      author: article.tags?.find((tag: any) => tag.type === 'contributor')?.webTitle,
      references: article.references,
      blocks: article.blocks,
      elements: article.elements,
      rights: article.rights,
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
    const newsDeskQuery = filters.categories[0] !== 'all'
      ? filters.categories.map(cat => `news_desk:("${cat}")`).join(' OR ')
      : undefined;

    // Format author filter for NYT API
    const authorQuery = filters.author
      ? `byline:("${filters.author}")`
      : undefined;

    // Combine filters if both exist
    const combinedFq = [newsDeskQuery, authorQuery]
      .filter(Boolean)
      .join(' AND ');

    const response = await nytClient.get<NYTResponse>('/articlesearch.json', {
      params: {
        'api-key': NYT_API_KEY,
        q: filters.searchQuery || undefined,
        begin_date: beginDate,
        end_date: endDate,
        fq: combinedFq || undefined,
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
      imageUrl: `https://static01.nyt.com/${article.multimedia.find((media: any) => media.subtype === 'large')?.url || 
                article.multimedia.find((media: any) => media.subtype === 'mediumThreeByTwo210')?.url}`,
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
