"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signIn, signUp, signOut, getSession } from "@/lib/auth-client";
import axios from "axios";

const AuthContext = createContext(null);

/** Sync BetterAuth session → Express JWT (required for protected API routes). */
async function fetchExpressToken(sessionUser) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sync`,
    {
      name: sessionUser.name,
      email: sessionUser.email,
      photo: sessionUser.image || "",
      provider: "betterauth",
    }
  );
  return res.data;
}

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [apiToken, setApiToken] = useState(null);
  const [apiProfile, setApiProfile] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const syncApiSession = useCallback(async (sessionUser) => {
    if (!sessionUser?.email) {
      setSyncing(false);
      return;
    }
    setSyncing(true);
    try {
      const { token, user } = await fetchExpressToken(sessionUser);
      setApiToken(token);
      setApiProfile(user);
      sessionStorage.setItem("tb_token", token);
    } catch (err) {
      console.error("API session sync failed:", err);
      // Keep cached token on transient failures so reload doesn't log users out
      const cached = sessionStorage.getItem("tb_token");
      if (cached) {
        setApiToken(cached);
      }
    } finally {
      setSyncing(false);
    }
  }, []);

  // Restore cached API token while BetterAuth session loads
  useEffect(() => {
    const cached = sessionStorage.getItem("tb_token");
    if (cached) setApiToken(cached);
  }, []);

  // Keep Express JWT in sync with BetterAuth session
  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      syncApiSession(session.user);
    } else {
      setApiToken(null);
      setApiProfile(null);
      sessionStorage.removeItem("tb_token");
      setSyncing(false);
    }
  }, [session?.user, isPending, syncApiSession]);

  const syncExpressUser = async (sessionUser) => {
    const { token, user } = await fetchExpressToken(sessionUser);
    setApiToken(token);
    setApiProfile(user);
    sessionStorage.setItem("tb_token", token);
    return user;
  };

  const resolveSessionUser = async (authResult) => {
    if (authResult?.data?.user) return authResult.data.user;
    const session = await getSession();
    return session?.data?.user ?? null;
  };

  const register = async ({ name, email, password }) => {
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      throw new Error("Name, email and password are required");
    }

    const signUpResult = await signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });
    if (signUpResult.error) throw new Error(signUpResult.error.message);

    const loginResult = await signIn.email({ email: trimmedEmail, password });
    if (loginResult.error) throw new Error(loginResult.error.message);

    const sessionUser = await resolveSessionUser(loginResult);
    if (sessionUser) await syncExpressUser(sessionUser);

    return loginResult;
  };

  const login = async ({ email, password }) => {
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      throw new Error("Email and password are required");
    }

    const loginResult = await signIn.email({ email: trimmedEmail, password });
    if (loginResult.error) throw new Error(loginResult.error.message);

    const sessionUser = await resolveSessionUser(loginResult);
    if (sessionUser) await syncExpressUser(sessionUser);

    return loginResult;
  };

  const loginWithGoogle = async (callbackURL = "/") => {
    await signIn.social({ provider: "google", callbackURL });
  };

  const logout = async () => {
    await signOut();
    setApiToken(null);
    setApiProfile(null);
    sessionStorage.removeItem("tb_token");
  };

  // BetterAuth session = login state; Express profile = role for dashboards/API
  const user = session?.user
    ? {
        id: apiProfile?.id || session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        photo: session.user.image,
        role: apiProfile?.role || session.user.role || "user",
        isFraud: apiProfile?.isFraud ?? session.user.isFraud ?? false,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token: apiToken,
        loading: isPending,
        syncing,
        register,
        login,
        loginWithGoogle,
        logout,
        refreshApiSession: () => session?.user && syncApiSession(session.user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
