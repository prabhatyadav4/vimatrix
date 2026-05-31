import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useGetUserPlaylists = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYLISTS, userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlist/user/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/playlist", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
    },
  });
};

export const useGetPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYLIST, playlistId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlist/${playlistId}`);
      return res.data.data;
    },
    enabled: !!playlistId,
  });
};

export const useRemoveVideoFromPlaylist = (playlistId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId) => {
      const res = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}`
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLAYLIST, playlistId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
    },
  });
};

export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const res = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}`
      );
      return res.data.data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLAYLIST, playlistId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
    },
  });
};

export const useUpdatePlaylist = (playlistId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch(`/playlist/${playlistId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLAYLIST, playlistId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
    },
  });
};

export const useDeletePlaylist = (playlistId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/playlist/${playlistId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
    },
  });
};

