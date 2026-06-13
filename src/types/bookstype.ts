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
  status: "可借阅" | "已借阅";
}
