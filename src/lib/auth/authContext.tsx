"use client";

import * as React from "react";
import { AuthUser, LoginInput, RegisterInput } from "./authTypes";

import { AuthModal } from "@/components/auth/auth-modal";
import { watchHistoryService } from "@/lib/services/watchHistoryService";
import { myListService } from "@/lib/services/myListService";
import { searchHistoryService } from "@/lib/services/searchHistoryService";
import { useToast } from "@/components/ui/toast";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  unlinkProvider: (provider: "google" | "facebook" | "credentials") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register" | "forgot";
  openAuthModal: (mode?: "login" | "register" | "forgot") => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authModalMode, setAuthModalMode] = React.useState<"login" | "register" | "forgot">("login");

  const openAuthModal = React.useCallback((mode: "login" | "register" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = React.useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const fetchSession = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.authenticated && json.data?.user) {
          setUser(json.data.user);
          try {
            localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(json.data.user));
          } catch {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem("rubbyfilm_cached_user");
          } catch {}
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem("rubbyfilm_cached_user");
        } catch {}
      }
    } catch (e) {
      console.warn("Failed to check auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    try {
      const cached = localStorage.getItem("rubbyfilm_cached_user");
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {}
    fetchSession();
  }, [fetchSession]);

  // Listen for OAuth authentication success callback parameter and ?auth= trigger
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);

      const authMode = url.searchParams.get("auth");
      if (authMode === "login" || authMode === "register" || authMode === "forgot") {
        openAuthModal(authMode);
        url.searchParams.delete("auth");
        const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
        window.history.replaceState({}, "", cleanUrl);
      }

      const authSuccess = url.searchParams.get("auth_success");
      if (authSuccess) {
        const providerName =
          authSuccess === "google"
            ? "Google"
            : authSuccess === "facebook"
            ? "Facebook"
            : "tài khoản mạng xã hội";
        fetchSession();
        toast.success("Đăng nhập thành công!", `Chào mừng bạn đã đăng nhập qua ${providerName}.`);
        url.searchParams.delete("auth_success");
        const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
        window.history.replaceState({}, "", cleanUrl);
      }

      const authError = url.searchParams.get("error");
      const errorProvider = url.searchParams.get("provider");
      if (authError) {
        const pName =
          errorProvider === "google"
            ? "Google"
            : errorProvider === "facebook"
            ? "Facebook"
            : "tài khoản";
        let msg = `Đăng nhập qua ${pName} không thành công.`;
        if (authError === "OAUTH_CANCELLED") {
          msg = `Bạn đã hủy yêu cầu đăng nhập qua ${pName}.`;
        } else if (authError === "OAUTH_NOT_CONFIGURED") {
          msg = `Tính năng đăng nhập qua ${pName} chưa được cấu hình API keys.`;
        } else if (authError === "OAUTH_STATE_MISMATCH") {
          msg = "Phiên xác thực bảo mật không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.";
        } else if (authError === "OAUTH_EXCHANGE_ERROR" || authError === "OAUTH_FAILED") {
          msg = `Không thể trao đổi xác thực với ${pName}. Vui lòng thử lại.`;
        }
        toast.error("Lỗi đăng nhập", msg);
        url.searchParams.delete("error");
        if (errorProvider) url.searchParams.delete("provider");
        const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
        window.history.replaceState({}, "", cleanUrl);
      }
    } catch {}
  }, [toast, openAuthModal, fetchSession]);

  const login = async (input: LoginInput) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json?.error?.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại.",
        };
      }

      setUser(json.data);
      try {
        localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(json.data));
      } catch {}
      toast.success(
        "Đăng nhập thành công!",
        `Chào mừng ${json.data?.name || "bạn"} đã quay trở lại RubbyFilm.`
      );
      return { success: true };
    } catch (e: any) {
      return { success: false, error: "Lỗi kết nối máy chủ. Vui lòng thử lại sau." };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json?.error?.message || "Đăng ký không thành công. Vui lòng thử lại.",
        };
      }

      setUser(json.data);
      try {
        localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(json.data));
      } catch {}
      toast.success(
        "Đăng ký thành công!",
        `Chào mừng ${json.data?.name || "bạn"} gia nhập đại gia đình RubbyFilm.`
      );
      return { success: true };
    } catch (e: any) {
      return { success: false, error: "Lỗi kết nối máy chủ. Vui lòng thử lại sau." };
    }
  };

  const unlinkProvider = async (provider: "google" | "facebook" | "credentials") => {
    try {
      const res = await fetch("/api/auth/providers/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json?.error?.message || "Không thể hủy liên kết tài khoản.",
        };
      }
      if (json.data?.user) {
        setUser(json.data.user);
        try {
          localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(json.data.user));
        } catch {}
      } else {
        await fetchSession();
      }
      toast.info("Hủy liên kết thành công", "Thông tin đăng nhập của bạn đã được cập nhật.");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: "Lỗi kết nối máy chủ khi hủy liên kết." };
    }
  };

  // Keep watchHistoryService, myListService, and searchHistoryService strictly synchronized with active user
  React.useEffect(() => {
    const userId = user?.id ?? null;
    watchHistoryService.setUser(userId);
    myListService.setUser(userId);
    searchHistoryService.setUser(userId);
  }, [user]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem("rubbyfilm_cached_user");
    } catch {}
    watchHistoryService.setUser(null);
    myListService.setUser(null);
    searchHistoryService.setUser(null);
    toast.info("Đã đăng xuất", "Bạn đã đăng xuất tài khoản thành công. Hẹn gặp lại bạn!");
  };

  const updateProfile = React.useCallback(
    async (updates: { name?: string; avatarUrl?: string }) => {
      // 1. Instantly update local React state & cached user for immediate UI reflection
      setUser((prev) => {
        const base = prev || {
          id: "usr_active",
          name: updates.name || "Thành Viên RubbyFilm",
          email: "user@rubbyfilm.vn",
          role: "user" as const,
          providers: ["credentials" as const],
          createdAt: Date.now(),
        };
        const next = { ...base, ...updates };
        try {
          localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(next));
        } catch {}
        return next;
      });

      // 2. Synchronize to guest profile localStorage key as well
      try {
        const rawProfile = localStorage.getItem("rubbyfilm_user_profile");
        const existing = rawProfile ? JSON.parse(rawProfile) : {};
        localStorage.setItem("rubbyfilm_user_profile", JSON.stringify({ ...existing, ...updates }));
      } catch {}

      // 3. Sync to server session if available
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const json = await res.json();
        if (res.ok && json.success && json.data?.user) {
          setUser(json.data.user);
          try {
            localStorage.setItem("rubbyfilm_cached_user", JSON.stringify(json.data.user));
          } catch {}
          return { success: true };
        }
      } catch (e: any) {
        console.warn("Could not sync profile to backend session:", e);
      }
      return { success: true };
    },
    []
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    unlinkProvider,
    logout,
    refresh: fetchSession,
    updateProfile,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
