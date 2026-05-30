import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useToggleSubscription = (channelId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
      return res.data.data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.VIDEO],
      });

      // Snapshot channel info (stored inside video query)
      const previousVideo = queryClient.getQueryData([
        QUERY_KEYS.VIDEO,
        // We'll pass videoId via closure from component
      ]);

      // Optimistically flip isSubscribed on channel inside video data
      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.VIDEO] }, (old) => {
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

      return { previousVideo };
    },

    onError: (err, vars, context) => {
      if (context?.previousVideo) {
        queryClient.setQueriesData(
          { queryKey: [QUERY_KEYS.VIDEO] },
          context.previousVideo,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEO] });
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

