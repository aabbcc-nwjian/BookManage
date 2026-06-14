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

export const getRecommendationsByBook = (
  bookId: number,
  params?: RecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    `/recommendations/by-book/${bookId}`,
    params,
  );
};

export const getRecommendationsByCategory = (
  params: CategoryRecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    "/recommendations/by-category",
    params,
  );
};

export const getRecommendationsForReader = (
  readerId: number,
  params?: RecommendationParams,
) => {
  return apiClient.get<RecommendationList>(
    `/recommendations/for-reader/${readerId}`,
    params,
  );
};
