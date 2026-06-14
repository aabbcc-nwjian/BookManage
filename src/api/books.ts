import { apiClient } from "./request";
import type { BookAddtype } from "../types/bookstype";

export interface PageParams {
  page?: number;
}

export interface PageData<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

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
  has_cover: boolean;
  cover_type: string;
  total_quantity: number;
  available_quantity: number;
  shelf_location: string;
  status: string;
}

export interface BookListParams extends PageParams {
  category?: string;
  keyword?: string;
}

export interface BookCount {
  total_titles: number;
  total_quantity: number;
  available: number;
  categories: Array<{
    name: string;
    count: number;
    total_quantity: number;
  }>;
}

export interface AddBookParams {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_date: string;
  quantity: number;
  shelf_location: string;
}

export interface UpdateBookParams {
  title?: string;
  author?: string;
  publisher?: string;
  category?: string;
  shelf_location?: string;
  pages?: number;
  description?: string;
  total_quantity?: number;
  published_date?: string;
}

export interface UploadCoverResult {
  has_cover: boolean;
  cover_type: string;
}

export const getBookCount = () => {
  return apiClient.get<BookCount>("/books/count");
};

export const getBookList = (params?: BookListParams) => {
  return apiClient.get<PageData<Book>>("/books", params);
};

export const getBookDetail = (bookId: number) => {
  return apiClient.get<Book>(`/books/${bookId}`);
};

export const addBook = (data: AddBookParams | BookAddtype) => {
  return apiClient.post<Book>("/books", data);
};

export const updateBook = (bookId: number, data: UpdateBookParams) => {
  return apiClient.put<Book>(`/books/${bookId}`, data);
};

export const uploadBookCover = (bookId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<UploadCoverResult>(`/books/${bookId}/cover`, formData);
};

export const getBookCoverUrl = (bookId: number) => {
  return `${apiClient.baseURL}/books/${bookId}/cover`;
};

export const removeBook = (bookId: number) => {
  return apiClient.post<null>(`/books/${bookId}/remove`);
};

export const borrowBook = (data: { book_id: number; reader_id: number }) => {
  return apiClient.post<unknown>("/borrows", data);
};

export const reserveBook = (data: { book_id: number; reader_id?: number }) => {
  return apiClient.post<unknown>("/reservations", data);
};

export const cancelReservation = (reservationId: number) => {
  return apiClient.post<unknown>(`/reservations/${reservationId}/cancel`);
};

// 兼容旧页面中的拼写
export const reserBook = reserveBook;
export const cancelReser = (data: { reservation_id: number }) => {
  return cancelReservation(data.reservation_id);
};
export const changgebook = (data: UpdateBookParams, book_id: number) => {
  return updateBook(book_id, data);
};
