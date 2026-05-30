import {
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useGetUserTweets = (userId) =>
  useQuery({
    queryKey: [QUERY_KEYS.TWEETS, userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tweets/user/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content) => {
      const res = await axiosInstance.post("/tweets", { content });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TWEETS] });
    },

    onError: () => {
      // Error is surfaced via mutation.isError/mutation.error in the component
    },
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tweetId) => {
      const res = await axiosInstance.delete(`/tweets/${tweetId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TWEETS] });
    },
  });
};
