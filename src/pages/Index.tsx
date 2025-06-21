
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ArticleCard from '@/components/ArticleCard';
import ArticleView from '@/components/ArticleView';
import AdminPanel from '@/components/AdminPanel';
import { mockArticles, categories } from '@/data/mockArticles';
import { Article } from '@/types/Article';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter articles based on search query and category
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory && article.published;
    });
  }, [articles, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleArticleSelect = (article: Article) => {
    // Increment view count
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, views: a.views + 1 } : a
    ));
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
    setSelectedArticle(null);
  };

  const handleSaveArticle = (articleData: Partial<Article>) => {
    if (articleData.id) {
      // Update existing article
      setArticles(prev => prev.map(a => 
        a.id === articleData.id ? { ...a, ...articleData, lastUpdated: new Date().toISOString().split('T')[0] } : a
      ));
    } else {
      // Create new article
      const newArticle: Article = {
        id: Date.now().toString(),
        title: articleData.title || '',
        content: articleData.content || '',
        excerpt: articleData.excerpt || '',
        category: articleData.category || categories[0],
        author: articleData.author || 'Admin',
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        views: 0,
        tags: articleData.tags || [],
        published: true
      };
      setArticles(prev => [newArticle, ...prev]);
    }
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onToggleAdmin={handleToggleAdmin}
        isAdmin={isAdmin}
      />

      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPanel
            articles={articles}
            categories={categories}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        ) : selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onBack={handleBackToList}
            isAdmin={false}
          />
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                How can we help you today?
              </h2>
              <p className="text-lg text-gray-600">
                Search our knowledge base for answers to common questions
              </p>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleArticleSelect(article)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms or browse by category.' : 'No articles available in this category.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
