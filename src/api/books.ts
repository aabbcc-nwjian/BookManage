import { apiClient } from "./request";
export const getBookList = () => {
  return apiClient.get<any>("/books");
};
