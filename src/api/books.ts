import { apiClient } from "./request";
import type { BookAddtype } from "../types/bookstype";

export interface PageParams {
  page?: number;
}

export interface PageData<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_date: string;
  pages: number;
  description: string;
  rating: number;
  image: string;
  has_cover: boolean;
  cover_type: string;
  total_quantity: number;
  available_quantity: number;
  shelf_location: string;
  status: string;
}

export interface BookListParams extends PageParams {
  category?: string;
  keyword?: string;
}

export interface BookCount {
  total_titles: number;
  total_quantity: number;
  available: number;
  categories: Array<{
    name: string;
    count: number;
    total_quantity: number;
  }>;
}

export interface AddBookParams {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_date: string;
  quantity: number;
  shelf_location: string;
  description?: string;
}

export interface UpdateBookParams {
  title?: string;
  author?: string;
  publisher?: string;
  category?: string;
  shelf_location?: string;
  pages?: number;
  description?: string;
  total_quantity?: number;
  published_date?: string;
}

export interface UploadCoverResult {
  has_cover: boolean;
  cover_type: string;
}

/** 获取图书数量统计，包括图书种数、总库存、可借数量和分类统计。 */
export const getBookCount = () => {
  return apiClient.get<BookCount>("/books/count");
};

/** 获取图书列表，支持按分类、书名关键词和页码筛选。 */
export const getBookList = (params?: BookListParams) => {
  return apiClient.get<PageData<Book>>("/books", params);
};

/** 获取指定图书的详情信息。 */
export const getBookDetail = (bookId: number) => {
  return apiClient.get<Book>(`/books/${bookId}`);
};

/** 新增图书，需要馆员或管理员权限。 */
export const addBook = (data: AddBookParams | BookAddtype) => {
  return apiClient.post<Book>("/books", data);
};

/** 修改指定图书的信息，需要馆员或管理员权限。 */
export const updateBook = (bookId: number, data: UpdateBookParams) => {
  return apiClient.put<Book>(`/books/${bookId}`, data);
};

/** 上传指定图书的封面图片，图片会以 multipart/form-data 提交。 */
export const uploadBookCover = (bookId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<UploadCoverResult>(`/books/${bookId}/cover`, formData);
};

/** 获取指定图书封面图片的访问地址，可直接用于 img 标签。 */
export const getBookCoverUrl = (bookId: number) => {
  return `${apiClient.baseURL}/books/${bookId}/cover`;
};

/** 下架指定图书，需要馆员或管理员权限。 */
export const removeBook = (bookId: number) => {
  return apiClient.post<null>(`/books/${bookId}/remove`);
};

/** 创建借阅记录，即为指定读者借出指定图书。 */
export const borrowBook = (data: { book_id: number; reader_id: number }) => {
  return apiClient.post<unknown>("/borrows", data);
};

/** 创建图书预约；不传 reader_id 时使用当前登录用户绑定的读者证。 */
export const reserveBook = (data: { book_id: number; reader_id?: number }) => {
  return apiClient.post<unknown>("/reservations", data);
};

/** 取消指定预约记录。 */
export const cancelReservation = (reservationId: number) => {
  return apiClient.post<unknown>(`/reservations/${reservationId}/cancel`);
};

// 兼容旧页面中的拼写
/** 旧版预约函数名，等同于 reserveBook。 */
export const reserBook = reserveBook;

/** 旧版取消预约函数名，按 reservation_id 取消预约。 */
export const cancelReser = (data: { reservation_id: number }) => {
  return cancelReservation(data.reservation_id);
};

/** 旧版修改图书函数名，等同于 updateBook。 */
export const changgebook = (data: UpdateBookParams, book_id: number) => {
  return updateBook(book_id, data);
};
