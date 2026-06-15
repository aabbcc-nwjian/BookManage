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

/** 用户登录，成功后返回 token 和当前用户信息。 */
export const login = ({ username, password }: LoginParams) => {
  return apiClient.post<LoginResult>(
    "/auth/login",
    { username, password },
    { skipAuth: true },
  );
};

/** 注册馆员或管理员账号；不传 role 时默认注册馆员。 */
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

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
}

export const changePassword = ({
  old_password,
  new_password,
}: ChangePasswordParams) => {
  return apiClient.put<null>(
    "/auth/password",
    { old_password, new_password },
  );
};
