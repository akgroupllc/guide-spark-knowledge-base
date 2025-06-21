
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
      <Badge
        variant={selectedCategory === null ? "default" : "secondary"}
        className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
        onClick={() => onCategorySelect(null)}
      >
        All Articles
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;
