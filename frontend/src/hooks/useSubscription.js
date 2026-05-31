import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useToggleSubscription = (channelId, videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
      return res.data.data;
    },

    onMutate: async () => {
      // Cancel refetches for this specific video
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.VIDEO, videoId],
      });

      // Snapshot current video data
      const previousVideo = queryClient.getQueryData([
        QUERY_KEYS.VIDEO,
        videoId,
      ]);

      // Optimistically flip isSubscribed on channel inside video data
      if (videoId) {
        queryClient.setQueryData([QUERY_KEYS.VIDEO, videoId], (old) => {
          if (!old?.channel) return old;
          const subbed = old.channel.isSubscribed;
          return {
            ...old,
            channel: {
              ...old.channel,
              isSubscribed: !subbed,
              subscribersCount: subbed
                ? old.channel.subscribersCount - 1
                : old.channel.subscribersCount + 1,
            },
          };
        });
      }

      // Also update channel profile cache if viewing a channel page
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.CHANNEL],
      });
      const previousChannel = queryClient.getQueriesData({
        queryKey: [QUERY_KEYS.CHANNEL],
      });
      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.CHANNEL] }, (old) => {
        if (!old || old._id !== channelId) return old;
        const subbed = old.isSubscribed;
        return {
          ...old,
          isSubscribed: !subbed,
          subscribersCount: subbed
            ? old.subscribersCount - 1
            : old.subscribersCount + 1,
        };
      });

      return { previousVideo, previousChannel };
    },

    onError: (err, vars, context) => {
      if (context?.previousVideo && videoId) {
        queryClient.setQueryData(
          [QUERY_KEYS.VIDEO, videoId],
          context.previousVideo,
        );
      }
      if (context?.previousChannel) {
        context.previousChannel.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      if (videoId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEO, videoId] });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHANNEL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSCRIBERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSCRIBED_CHANNELS] });
    },
  });
};

export const useGetSubscribedChannels = (subscriberId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIBED_CHANNELS, subscriberId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
      return res.data.data;
    },
    enabled: !!subscriberId,
  });
};

export const useGetSubscribers = (channelId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIBERS, channelId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/subscriptions/c/${channelId}`);
      return res.data.data;
    },
    enabled: !!channelId,
  });
};

