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
