import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

// Fetch paginated comments for a video
export const useGetVideoComments = (videoId) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.COMMENTS, videoId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/comments/${videoId}`, {
        params: { page: pageParam, limit: 10 },
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!videoId,
  });
};

// Add a comment — optimistically prepend to list
export const useAddComment = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content) => {
      const res = await axiosInstance.post(`/comments/${videoId}`, { content });
      return res.data.data;
    },

    // New Concept: optimistic insert into infinite query pages
    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.COMMENTS, videoId],
      });

      const previousComments = queryClient.getQueryData([
        QUERY_KEYS.COMMENTS,
        videoId,
      ]);

      // Build a temporary comment object to show instantly
      const tempComment = {
        _id: `temp-${Date.now()}`, // temporary ID until real one arrives
        content,
        createdAt: new Date().toISOString(),
        owner: queryClient.getQueryData([QUERY_KEYS.CURRENT_USER]),
        likesCount: 0,
        isLikedByMe: false,
      };

      // Prepend to the FIRST page of the infinite query
      queryClient.setQueryData([QUERY_KEYS.COMMENTS, videoId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0 ? { ...page, docs: [tempComment, ...page.docs] } : page,
          ),
        };
      });

      return { previousComments };
    },

    onError: (err, vars, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.COMMENTS, videoId],
        context.previousComments,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, videoId],
      });
    },
  });
};

// Delete a comment
export const useDeleteComment = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      const res = await axiosInstance.delete(`/comments/c/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, videoId],
      });
    },
  });
};

// Update a comment
export const useUpdateComment = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }) => {
      const res = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, videoId],
      });
    },
  });
};
