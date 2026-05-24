import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { login, logout } from "../app/slices/authSlice.js";
import { QUERY_KEYS } from "../constants/index.js";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      // New Concept: FormData for file uploads
      // Regular JSON bodies cannot carry file data.
      // FormData sends a multipart/form-data request — the only way to
      // send files via HTTP.
      // Axios automatically sets Content-Type: multipart/form-data
      // when it detects a FormData body.
      const res = await axiosInstance.post("/users/register", formData);
      return res.data;
    },
    onSuccess: () => navigate("/login"),
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/users/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(
        login({
          user: data.data.user,
          accessToken: data.data.accessToken,
        }),
      );
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => axiosInstance.post("/users/logout"),
    onSuccess: () => {
      dispatch(logout());
      navigate("/login");
    },
  });
};

export const useCurrentUser = () => useSelector((state) => state.auth.user);
