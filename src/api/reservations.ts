import { apiClient } from "./request";
import type { PageData, PageParams } from "./books";

export type ReservationStatus =
  | "waiting"
  | "notified"
  | "fulfilled"
  | "cancelled"
  | "expired";

export interface ReservationRecord {
  id: number;
  book_id: number;
  book_title: string;
  reader_id: number;
  reader_name: string;
  reservation_date: string;
  queue_number: number;
  status: ReservationStatus;
  notify_date: string | null;
  expiry_date: string | null;
}

export interface ReservationListParams extends PageParams {
  reader_id?: number;
  book_id?: number;
  status?: ReservationStatus;
}

export interface CreateReservationParams {
  book_id: number;
  reader_id?: number;
}

/** 获取预约记录列表，支持按读者、图书、状态和页码筛选。 */
export const getReservationList = (params?: ReservationListParams) => {
  return apiClient.get<PageData<ReservationRecord>>("/reservations", params);
};

/** 创建图书预约；不传 reader_id 时使用当前登录用户绑定的读者证。 */
export const createReservation = (data: CreateReservationParams) => {
  return apiClient.post<ReservationRecord>("/reservations", data);
};

/** 取消指定预约；管理员可取消任意预约，普通读者只能取消自己的预约。 */
export const cancelReservation = (reservationId: number) => {
  return apiClient.post<ReservationRecord>(
    `/reservations/${reservationId}/cancel`,
  );
};
