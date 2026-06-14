import { apiClient } from "./request";

export interface RecommendationParams {
  limit?: number;
}

export interface CategoryRecommendationParams extends RecommendationParams {
  category: string;
}

export interface RecommendedBook {
  id: number;
  title: string;
  shared_count?: number;
  borrow_count?: number;
  [key: string]: unknown;
}

export interface RecommendationList {
  items: RecommendedBook[];
}

/** 根据指定图书推荐其他图书，来源是借过该书的读者也借过的书。 */
export const getRecommendationsByBook = (
  bookId: number,
  params?: RecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    `/recommendations/by-book/${bookId}`,
    params,
  );
};

/** 获取指定分类下的热门图书推荐，按借阅次数排序。 */
export const getRecommendationsByCategory = (
  params: CategoryRecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    "/recommendations/by-category",
    params,
  );
};

/** 根据指定读者的借阅历史获取个性化图书推荐。 */
export const getRecommendationsForReader = (
  readerId: number,
  params?: RecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    `/recommendations/for-reader/${readerId}`,
    params,
  );
};
