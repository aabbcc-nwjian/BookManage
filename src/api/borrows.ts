import { apiClient } from "./request";
import type { PageData, PageParams } from "./books";

export type BorrowStatus = "borrowed" | "returned" | "overdue";

export interface BorrowRecord {
  id: number;
  book_id: number;
  book_title: string;
  reader_id: number;
  reader_name: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: BorrowStatus;
  overdue_days: number;
  renew_count: number;
}

export interface BorrowListParams extends PageParams {
  reader_id?: number;
  book_id?: number;
  status?: BorrowStatus;
}

export interface CreateBorrowParams {
  book_id: number;
  reader_id: number;
}

export const getBorrowList = (params?: BorrowListParams) => {
  return apiClient.get<PageData<BorrowRecord>>("/borrows", params);
};

export const createBorrow = (data: CreateBorrowParams) => {
  return apiClient.post<BorrowRecord>("/borrows", data);
};

export const returnBook = (borrowId: number) => {
  return apiClient.post<BorrowRecord>(`/borrows/${borrowId}/return`);
};

export const getOverdueBorrowList = (params?: PageParams) => {
  return apiClient.get<PageData<BorrowRecord>>("/borrows/overdue", params);
};
