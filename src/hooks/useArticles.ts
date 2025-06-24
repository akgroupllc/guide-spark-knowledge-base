
import { useState, useEffect } from 'react';
import { Article } from '@/types/Article';
import { apiService } from '@/services/api';
import { mockArticles } from '@/data/mockArticles';
import { env } from '@/config/environment';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, try to load from API first, fallback to mock data
      if (env.production) {
        try {
          const data = await apiService.getArticles();
          setArticles(data);
        } catch (apiError) {
          console.warn('API not available, using mock data');
          setArticles(mockArticles);
        }
      } else {
        // In development, use mock data
        setArticles(mockArticles);
      }
    } catch (err) {
      setError('Failed to load articles');
      setArticles(mockArticles); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const saveArticle = async (articleData: Partial<Article>) => {
    try {
      if (env.production) {
        if (articleData.id) {
          const updatedArticle = await apiService.updateArticle(articleData.id, articleData);
          setArticles(prev => prev.map(a => 
            a.id === articleData.id ? updatedArticle : a
          ));
        } else {
          const newArticle = await apiService.createArticle(articleData);
          setArticles(prev => [newArticle, ...prev]);
        }
      } else {
        // Local mock data handling
        if (articleData.id) {
          setArticles(prev => prev.map(a => 
            a.id === articleData.id ? { ...a, ...articleData, lastUpdated: new Date().toISOString().split('T')[0] } : a
          ));
        } else {
          const newArticle: Article = {
            id: Date.now().toString(),
            title: articleData.title || '',
            content: articleData.content || '',
            excerpt: articleData.excerpt || '',
            category: articleData.category || '',
            author: articleData.author || 'Admin',
            createdAt: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            views: 0,
            tags: articleData.tags || [],
            published: true
          };
          setArticles(prev => [newArticle, ...prev]);
        }
      }
    } catch (err) {
      console.error('Failed to save article:', err);
      throw new Error('Failed to save article');
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      if (env.production) {
        await apiService.deleteArticle(id);
      }
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete article:', err);
      throw new Error('Failed to delete article');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      if (env.production) {
        await apiService.incrementViews(id);
      }
      setArticles(prev => prev.map(a => 
        a.id === id ? { ...a, views: a.views + 1 } : a
      ));
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    saveArticle,
    deleteArticle,
    incrementViews,
    refetch: loadArticles
  };
};
