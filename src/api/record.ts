import { apiClient } from "./request";
export const getReservationList = () => {
  return apiClient.get<any>("/reservations");
};
export const getBorrowList = () => {
  return apiClient.get<any>("/borrows");
};
