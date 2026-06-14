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

/** 获取借阅记录列表，支持按读者、图书、状态和页码筛选。 */
export const getBorrowList = (params?: BorrowListParams) => {
  return apiClient.get<PageData<BorrowRecord>>("/borrows", params);
};

/** 创建借阅记录，即为指定读者办理借书。 */
export const createBorrow = (data: CreateBorrowParams) => {
  return apiClient.post<BorrowRecord>("/borrows", data);
};

/** 办理指定借阅记录的还书操作，并触发后端预约通知逻辑。 */
export const returnBook = (borrowId: number) => {
  return apiClient.post<BorrowRecord>(`/borrows/${borrowId}/return`);
};

/** 获取所有逾期未还的借阅记录，需要馆员或管理员权限。 */
export const getOverdueBorrowList = (params?: PageParams) => {
  return apiClient.get<PageData<BorrowRecord>>("/borrows/overdue", params);
};
