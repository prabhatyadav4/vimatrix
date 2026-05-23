import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

// Toggle publish status with optimistic update
export const useTogglePublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId) => {
      const res = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`,
      );
      return res.data.data;
    },

    // Optimistic: flip isPublished in the channel videos cache instantly
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.CHANNEL_VIDEOS],
      });

      const previous = queryClient.getQueryData([QUERY_KEYS.CHANNEL_VIDEOS]);

      queryClient.setQueryData([QUERY_KEYS.CHANNEL_VIDEOS], (old) => {
        if (!old?.docs) return old;
        return {
          ...old,
          docs: old.docs.map((v) =>
            v._id === videoId ? { ...v, isPublished: !v.isPublished } : v,
          ),
        };
      });

      return { previous };
    },

    onError: (err, vars, context) => {
      queryClient.setQueryData([QUERY_KEYS.CHANNEL_VIDEOS], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHANNEL_VIDEOS],
      });
    },
  });
};

// Delete video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId) => {
      const res = await axiosInstance.delete(`/videos/${videoId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHANNEL_VIDEOS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.VIDEOS],
      });
    },
  });
};
