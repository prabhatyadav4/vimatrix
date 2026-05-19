import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

// New Concept: useInfiniteQuery
// Regular useQuery fetches ONE page.
// useInfiniteQuery automatically manages MULTIPLE pages:
// - stores all pages in memory
// - knows how to fetch the NEXT page
// - gives you all pages to render at once

export const useGetAllVideos = (params = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.VIDEOS, params],

    // pageParam = the page number React Query passes in automatically
    // Starts at 1, then uses whatever getNextPageParam returns
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/videos", {
        params: { ...params, page: pageParam, limit: 12 },
      });
      return res.data.data;
      // Returns: { docs: [...], totalPages: 5, page: 1, hasNextPage: true }
    },

    initialPageParam: 1,

    // React Query calls this after each fetch
    // Return undefined → no more pages (stops fetching)
    // Return a value  → that becomes the next pageParam
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // no more pages
    },

    staleTime: 1000 * 60,
  });
};

export const useSearchVideos = (query) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.VIDEOS, { query }],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/videos", {
        params: { query, page: pageParam, limit: 12 },
      });
      return res.data.data;
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,

    // New Concept: enabled flag
    // Only run this query when query string is not empty
    // Prevents fetching with an empty search term
    enabled: !!query?.trim(),

    staleTime: 1000 * 30, // search results go stale faster (30 seconds)
  });
};
