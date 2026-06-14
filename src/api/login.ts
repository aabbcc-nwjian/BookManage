import { apiClient } from "./request";

export interface UserInfo {
  id: number;
  username: string;
  role: "admin" | "librarian" | string;
  is_active: boolean;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: UserInfo;
}

export interface RegisterParams {
  username: string;
  password: string;
  role?: "librarian" | "admin";
}

export const login = ({ username, password }: LoginParams) => {
  return apiClient.post<LoginResult>(
    "/auth/login",
    { username, password },
    { skipAuth: true },
  );
};

export const register = ({
  username,
  password,
  role = "librarian",
}: RegisterParams) => {
  return apiClient.post<UserInfo>(
    "/auth/register",
    { username, password, role },
    { skipAuth: true },
  );
};
