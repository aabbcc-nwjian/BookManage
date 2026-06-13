import { apiClient } from "./request";
export const borrowBook = (data: any) => {
  return apiClient.post<any>("/borrows", data);
};
export const reserBook = (data: any) => {
  return apiClient.post<any>("/reservations", data);
};
export const getBookList = () => {
  return apiClient.get<any>("/books");
};
