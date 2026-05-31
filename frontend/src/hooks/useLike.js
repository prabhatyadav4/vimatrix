import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useToggleVideoLike = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      return res.data.data;
    },

    // New Concept: onMutate — runs BEFORE mutationFn
    // This is where we do the optimistic update
    onMutate: async () => {
      // Step 1: Cancel any in-flight refetches for this video
      // (prevents them from overwriting our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.VIDEO, videoId],
      });

      // Step 2: Snapshot the current value BEFORE we change it
      // We need this to REVERT if the API call fails
      const previousVideo = queryClient.getQueryData([
        QUERY_KEYS.VIDEO,
        videoId,
      ]);

      // Step 3: Optimistically update the cache RIGHT NOW
      // setQueryData directly writes to cache — no API call
      queryClient.setQueryData([QUERY_KEYS.VIDEO, videoId], (old) => {
        if (!old) return old;
        const liked = old.isLikedByMe;
        return {
          ...old,
          isLikedByMe: !liked,
          likesCount: liked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      // Step 4: Return snapshot so onError can use it
      return { previousVideo };
    },

    // If the API call FAILS — revert to the snapshot we saved
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.VIDEO, videoId],
        context.previousVideo, // restore original data
      );
    },

    // Whether success or failure — sync with server truth
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.VIDEO, videoId],
      });
    },
  });
};

// Liked videos page
export const useGetLikedVideos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LIKED_VIDEOS],
    queryFn: async () => {
      const res = await axiosInstance.get("/likes/videos");
      return res.data.data;
    },
  });
};

export const useToggleTweetLike = (tweetId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TWEETS] });
    },
  });
};
