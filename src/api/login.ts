import { apiClient } from "./request";
export const login = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return apiClient.post<any>("/auth/login", { username, password }, { skipAuth: true });
};
export const register = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return apiClient.post<any>("/auth/register", { username, password }, { skipAuth: true });
};
