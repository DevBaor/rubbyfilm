export type AuthProvider = "credentials" | "google" | "facebook";

export interface AuthenticationIdentity {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  email?: string;
  createdAt: number;
  lastUsedAt?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "user" | "vip" | "admin";
  providers: AuthProvider[];
  identities?: AuthenticationIdentity[];
  createdAt: number;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface OAuthProfile {
  provider: "google" | "facebook";
  providerAccountId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
