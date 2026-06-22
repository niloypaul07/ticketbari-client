import axios from "axios";
import { useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export function useAxiosSecure() {
  const auth = useAuth();
  
  // Keep auth state in a ref so the axiosSecure instance reference remains 100% stable
  const authRef = useRef(auth);
  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    instance.interceptors.request.use((config) => {
      const token = authRef.current.token || sessionStorage.getItem("tb_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const { syncing, loading, logout } = authRef.current;
        // Only logout on explicit 401 after auth is fully settled (not during sync/load)
        if (err.response?.status === 401 && !syncing && !loading) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, []); // Empty array ensures stable reference

  return axiosSecure;
}

