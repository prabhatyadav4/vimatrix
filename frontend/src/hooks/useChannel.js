import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

// Fetch channel profile by username
export const useGetChannelProfile = (username) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHANNEL, username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}`);
      return res.data.data;
    },
    enabled: !!username,
  });
};

// Fetch channel dashboard stats
export const useGetChannelStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHANNEL_STATS],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data.data;
    },
  });
};

// Fetch channel's own videos (for dashboard)
export const useGetChannelVideos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHANNEL_VIDEOS],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/videos");
      return res.data.data;
    },
  });
};

// Update account details (name, email)
export const useUpdateAccountDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch("/users/update-account", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHANNEL] });
    },
  });
};

// Update avatar
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axiosInstance.patch("/users/avatar", formData);
      return res.data.data;
    },
    onSuccess: (updatedUser) => {
      // Update auth slice so navbar avatar updates too
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHANNEL] });
    },
  });
};

// Update cover image
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("coverImage", file);
      const res = await axiosInstance.patch("/users/cover-image", formData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHANNEL] });
    },
  });
};
