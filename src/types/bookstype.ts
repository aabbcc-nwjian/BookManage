export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_date: string;
  pages: number;
  description: string;
  rating: number;
  image: string;
  total_quantity: number;
  available_quantity: number;
}
export interface BookAddtype {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_date: string;
  quantity: number;
  shelf_location: string;
}
