import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export function useAxiosSecure() {
  const { token, logout, syncing, loading } = useAuth();

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        // Only logout on explicit 401 after auth is fully settled (not during sync/load)
        if (err.response?.status === 401 && !syncing && !loading) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, [token, logout, syncing, loading]);

  return axiosSecure;
}
