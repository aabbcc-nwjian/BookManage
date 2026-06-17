import { apiClient } from "./request";
import type { PageData, PageParams } from "./books";

export type ReaderStatus = "active" | "lost" | "disabled";

export interface Reader {
  id: number;
  card_number: string;
  card_status: string;
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

/** 获取读者列表，支持按姓名、读者证号、状态和页码筛选。 */
export const getReaderList = (params?: ReaderListParams) => {
  return apiClient.get<PageData<Reader>>("/readers", params);
};

/** 获取指定读者的详细信息。 */
export const getReaderDetail = (readerId: number) => {
  return apiClient.get<Reader>(`/auth/${readerId}`);
};

/** 为读者办证并创建读者档案。 */
export const createReader = (data: CreateReaderParams) => {
  return apiClient.post<Reader>("/readers", data);
};

/** 修改指定读者的信息，需要馆员或管理员权限。 */
export const updateReader = (readerId: number, data: UpdateReaderParams) => {
  return apiClient.put<Reader>(`/readers/${readerId}`, data);
};

/** 将指定读者证标记为挂失。 */
export const reportReaderLost = (readerId: number) => {
  return apiClient.post<null>(`/auth/${readerId}/card-lost`);
};

/** 恢复指定读者证为可用状态，需要馆员或管理员权限。 */
export const activateReader = (readerId: number) => {
  return apiClient.post<null>(`/auth/${readerId}/card-restore`);
};
