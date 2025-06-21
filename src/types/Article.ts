
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;
  lastUpdated: string;
  views: number;
  tags: string[];
  published: boolean;
}
