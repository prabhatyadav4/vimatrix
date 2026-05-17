import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useGetAllVideos = (params) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, params],

    queryFn: async () => {
      const res = await axiosInstance.get("/videos", { params });
      return res.data.data;
    },

    staleTime: 1000 * 60,
    enabled: true,
  });
};
