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

export const getReservationList = (params?: ReservationListParams) => {
  return apiClient.get<PageData<ReservationRecord>>("/reservations", params);
};

export const createReservation = (data: CreateReservationParams) => {
  return apiClient.post<ReservationRecord>("/reservations", data);
};

export const cancelReservation = (reservationId: number) => {
  return apiClient.post<ReservationRecord>(
    `/reservations/${reservationId}/cancel`,
  );
};
