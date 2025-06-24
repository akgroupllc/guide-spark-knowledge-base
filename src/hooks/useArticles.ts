
import { useState, useEffect } from 'react';
import { Article } from '@/types/Article';
import { apiService } from '@/services/api';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading articles from API...');
      
      const data = await apiService.getArticles();
      console.log('Articles loaded:', data);
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Failed to load articles from database');
    } finally {
      setLoading(false);
    }
  };

  const saveArticle = async (articleData: Partial<Article>) => {
    try {
      console.log('Saving article:', articleData);
      
      if (articleData.id) {
        const updatedArticle = await apiService.updateArticle(articleData.id, articleData);
        setArticles(prev => prev.map(a => 
          a.id === articleData.id ? updatedArticle : a
        ));
        console.log('Article updated:', updatedArticle);
      } else {
        const newArticle = await apiService.createArticle(articleData);
        setArticles(prev => [newArticle, ...prev]);
        console.log('Article created:', newArticle);
      }
    } catch (err) {
      console.error('Failed to save article:', err);
      throw new Error('Failed to save article');
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      console.log('Deleting article:', id);
      await apiService.deleteArticle(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      console.log('Article deleted successfully');
    } catch (err) {
      console.error('Failed to delete article:', err);
      throw new Error('Failed to delete article');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      console.log('Incrementing views for article:', id);
      await apiService.incrementViews(id);
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
