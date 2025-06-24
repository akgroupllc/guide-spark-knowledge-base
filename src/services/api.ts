
import { env } from '@/config/environment';
import { Article } from '@/types/Article';

class ApiService {
  private baseUrl = env.apiBaseUrl;

  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Articles API methods
  async getArticles(): Promise<Article[]> {
    return this.fetchWithErrorHandling('/articles');
  }

  async getArticle(id: string): Promise<Article> {
    return this.fetchWithErrorHandling(`/articles/${id}`);
  }

  async createArticle(article: Partial<Article>): Promise<Article> {
    return this.fetchWithErrorHandling('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    return this.fetchWithErrorHandling(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: string): Promise<void> {
    return this.fetchWithErrorHandling(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<string[]> {
    return this.fetchWithErrorHandling('/categories');
  }

  async incrementViews(id: string): Promise<void> {
    return this.fetchWithErrorHandling(`/articles/${id}/views`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
