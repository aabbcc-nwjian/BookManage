import { apiClient } from "./request";
import type { PageData, PageParams } from "./books";

export type ReaderStatus = "active" | "lost" | "disabled";

export interface Reader {
  id: number;
  card_number: string;
  name: string;
  phone: string;
  email: string;
  reader_type: string;
  status: ReaderStatus;
  reg_date: string;
  id_card?: string;
  address?: string;
}

export interface ReaderListParams extends PageParams {
  keyword?: string;
  status?: ReaderStatus;
}

export interface CreateReaderParams {
  card_number: string;
  name: string;
  phone: string;
  email: string;
  id_card: string;
  address: string;
  reader_type: string;
}

export interface UpdateReaderParams {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  reader_type?: string;
}

export const getReaderList = (params?: ReaderListParams) => {
  return apiClient.get<PageData<Reader>>("/readers", params);
};

export const getReaderDetail = (readerId: number) => {
  return apiClient.get<Reader>(`/readers/${readerId}`);
};

export const createReader = (data: CreateReaderParams) => {
  return apiClient.post<Reader>("/readers", data);
};

export const updateReader = (readerId: number, data: UpdateReaderParams) => {
  return apiClient.put<Reader>(`/readers/${readerId}`, data);
};

export const reportReaderLost = (readerId: number) => {
  return apiClient.post<null>(`/readers/${readerId}/lost`);
};

export const activateReader = (readerId: number) => {
  return apiClient.post<null>(`/readers/${readerId}/activate`);
};
