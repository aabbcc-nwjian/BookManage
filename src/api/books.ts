import { apiClient } from "./request";
import type { BookAddtype } from "../types/bookstype";
export const borrowBook = (data: { book_id: number; reader_id: number }) => {
  return apiClient.post<any>("/borrows", data);
};
export const reserBook = (data: { book_id: number; reader_id: number }) => {
  return apiClient.post<any>("/reservations", data);
};
export const cancelReser = (data: { reservation_id: number }) => {
  return apiClient.post<any>("/reservations/cancel", data);
};
export const getBookList = () => {
  return apiClient.get<any>("/books");
};
export const addBook = (data: BookAddtype) => {
  return apiClient.post<any>("/books", data);
};
