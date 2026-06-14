import { apiClient } from "./request";
import type { PageData, PageParams } from "./books";

export type FineStatus = "unpaid" | "paid" | "waived";

export interface FineRecord {
  id: number;
  borrow_id: number;
  reader_id: number;
  reader_name: string;
  amount: number;
  reason: string;
  status: FineStatus;
  created_date: string;
  paid_date: string | null;
}

export interface FineListParams extends PageParams {
  reader_id?: number;
  status?: FineStatus;
}

export const getFineList = (params?: FineListParams) => {
  return apiClient.get<PageData<FineRecord>>("/fines", params);
};

export const payFine = (fineId: number) => {
  return apiClient.post<FineRecord>(`/fines/${fineId}/pay`);
};
