
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading categories from API...');
      
      const data = await apiService.getCategories();
      console.log('Categories loaded:', data);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
      // Fallback to static categories
      setCategories(['Getting Started', 'Advanced', 'Troubleshooting', 'Security', 'Mobile', 'API']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: loadCategories
  };
};
