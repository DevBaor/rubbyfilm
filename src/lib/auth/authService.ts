import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  AuthUser,
  AuthSession,
  RegisterInput,
  AuthProvider,
  AuthenticationIdentity,
  OAuthProfile,
} from "./authTypes";

export const AUTH_COOKIE_NAME = "rubbyfilm_session";
export const OAUTH_STATE_COOKIE_NAME = "rubbyfilm_oauth_state";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET ||
  process.env.FACEBOOK_CLIENT_SECRET ||
  "rubbyfilm_jwt_secret_fallback_key_2026";

export function signOAuthState(payload: Record<string, any>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyOAuthState(stateStr: string): Record<string, any> | null {
  if (!stateStr) return null;
  try {
    const parts = stateStr.split(".");
    if (parts.length === 2) {
      const [data, sig] = parts;
      const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
      if (sig === expectedSig) {
        const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
        if (payload.timestamp && Date.now() - payload.timestamp < 15 * 60 * 1000) {
          return payload;
        }
      }
    }
  } catch {}
  return null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  avatarUrl?: string;
  role: "user" | "vip" | "admin";
  identities: AuthenticationIdentity[];
  createdAt: number;
}

// Persistent File-backed Repository Abstraction
class AuthRepository {
  private users: Map<string, StoredUser> = new Map(); // key: email lowercase
  private sessions: Map<string, AuthSession> = new Map(); // key: token

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, "utf-8");
        const list: StoredUser[] = JSON.parse(raw);
        for (const u of list) {
          if (u.email) {
            this.users.set(u.email.toLowerCase().trim(), u);
          }
        }
      }

      if (fs.existsSync(SESSIONS_FILE)) {
        const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
        const list: AuthSession[] = JSON.parse(raw);
        for (const s of list) {
          if (s.expiresAt > Date.now()) {
            this.sessions.set(s.token, s);
          }
        }
      }
    } catch (e) {
      console.warn("Notice: Initializing auth storage on disk:", e);
    }

    // Ensure demo VIP user always exists
    if (!this.users.has("demo@rubbyfilm.vn")) {
      this.createInitialDemoUser();
      this.saveUsersToDisk();
    }
  }

  private saveUsersToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const list = Array.from(this.users.values());
      fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save users to disk:", e);
    }
  }

  private saveSessionsToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const list = Array.from(this.sessions.values()).filter((s) => s.expiresAt > Date.now());
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save sessions to disk:", e);
    }
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString("hex");
  }

  private toSafeUser(stored: StoredUser): AuthUser {
    const providers: AuthProvider[] = [];
    if (stored.passwordHash) {
      providers.push("credentials");
    }
    for (const ident of stored.identities) {
      if (!providers.includes(ident.provider)) {
        providers.push(ident.provider);
      }
    }

    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      avatarUrl: stored.avatarUrl,
      role: stored.role,
      providers,
      identities: stored.identities.map((i) => ({ ...i })),
      createdAt: stored.createdAt,
    };
  }

  private createInitialDemoUser() {
    const email = "demo@rubbyfilm.vn";
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = this.hashPassword("Demo@123456", salt);
    const userId = "usr_demo_rubbyfilm_001";

    const demoUser: StoredUser = {
      id: userId,
      name: "Thành Viên VIP",
      email,
      passwordHash,
      salt,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
      role: "vip",
      identities: [
        {
          id: "ident_demo_cred",
          userId,
          provider: "credentials",
          providerAccountId: email,
          email,
          createdAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };

    this.users.set(email, demoUser);
  }

  public async findByEmail(email: string): Promise<StoredUser | null> {
    return this.users.get(email.toLowerCase().trim()) || null;
  }

  public async findById(id: string): Promise<StoredUser | null> {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  public async findByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<StoredUser | null> {
    for (const u of this.users.values()) {
      const match = u.identities.some(
        (i) => i.provider === provider && i.providerAccountId === providerAccountId
      );
      if (match) return u;
    }
    return null;
  }

  public async createUser(input: RegisterInput): Promise<AuthUser> {
    const cleanEmail = input.email.toLowerCase().trim();
    if (this.users.has(cleanEmail)) {
      throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = this.hashPassword(input.password, salt);
    const id = `usr_${crypto.randomBytes(8).toString("hex")}`;

    const newUser: StoredUser = {
      id,
      name: input.name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      role: "user",
      identities: [
        {
          id: `ident_${crypto.randomBytes(8).toString("hex")}`,
          userId: id,
          provider: "credentials",
          providerAccountId: cleanEmail,
          email: cleanEmail,
          createdAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };

    this.users.set(cleanEmail, newUser);
    this.saveUsersToDisk();
    return this.toSafeUser(newUser);
  }

  /**
   * OAuth Account Linking & Resolution:
   * 1. Looks up existing identity by (provider, providerAccountId).
   * 2. If not found, looks up existing user by normalized email.
   *    -> If found: securely links the OAuth provider to that account!
   *    -> If not found: creates new user with OAuth identity.
   */
  public async findOrCreateFromOAuth(profile: OAuthProfile): Promise<AuthUser> {
    const cleanEmail = profile.email.toLowerCase().trim();

    // 1. Look up by OAuth provider account ID
    let existingUser = await this.findByIdentity(profile.provider, profile.providerAccountId);

    if (existingUser) {
      // Update lastUsedAt on identity
      const identity = existingUser.identities.find(
        (i) => i.provider === profile.provider && i.providerAccountId === profile.providerAccountId
      );
      if (identity) {
        identity.lastUsedAt = Date.now();
        this.saveUsersToDisk();
      }
      return this.toSafeUser(existingUser);
    }

    // 2. Look up by Email for automatic secure Account Linking
    existingUser = await this.findByEmail(cleanEmail);

    if (existingUser) {
      // Existing account detected -> Link this OAuth provider
      const hasIdentity = existingUser.identities.some((i) => i.provider === profile.provider);
      if (!hasIdentity) {
        existingUser.identities.push({
          id: `ident_${crypto.randomBytes(8).toString("hex")}`,
          userId: existingUser.id,
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
          email: cleanEmail,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
        });
      }

      // If user had no avatar, adopt OAuth avatar
      if (!existingUser.avatarUrl && profile.avatarUrl) {
        existingUser.avatarUrl = profile.avatarUrl;
      }

      this.saveUsersToDisk();
      return this.toSafeUser(existingUser);
    }

    // 3. Create brand new user via OAuth
    const newUserId = `usr_${crypto.randomBytes(8).toString("hex")}`;
    const newUser: StoredUser = {
      id: newUserId,
      name: profile.name.trim() || (profile.provider === "google" ? "Google User" : "Facebook User"),
      email: cleanEmail,
      avatarUrl: profile.avatarUrl,
      role: "user",
      identities: [
        {
          id: `ident_${crypto.randomBytes(8).toString("hex")}`,
          userId: newUserId,
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
          email: cleanEmail,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };

    this.users.set(cleanEmail, newUser);
    this.saveUsersToDisk();
    return this.toSafeUser(newUser);
  }

  /**
   * Unlink a connected provider from user account
   */
  public async unlinkProvider(userId: string, provider: AuthProvider): Promise<AuthUser> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    // Check how many login methods user has
    const hasPassword = Boolean(user.passwordHash);
    const oauthCount = user.identities.filter((i) => i.provider !== "credentials").length;
    const totalLoginMethods = (hasPassword ? 1 : 0) + oauthCount;

    if (totalLoginMethods <= 1) {
      throw new Error(
        "Không thể hủy liên kết phương thức đăng nhập duy nhất của tài khoản. Vui lòng thiết lập mật khẩu hoặc liên kết tài khoản khác trước."
      );
    }

    // Remove the requested provider identity
    user.identities = user.identities.filter((i) => i.provider !== provider);
    this.saveUsersToDisk();
    return this.toSafeUser(user);
  }

  public async updateUserProfile(
    userId: string,
    updates: { name?: string; avatarUrl?: string }
  ): Promise<AuthUser> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin tài khoản.");
    }
    if (updates.name && updates.name.trim()) {
      user.name = updates.name.trim();
    }
    if (updates.avatarUrl !== undefined) {
      user.avatarUrl = updates.avatarUrl;
    }
    this.saveUsersToDisk();

    // Update active sessions in memory
    for (const session of this.sessions.values()) {
      if (session.user.id === userId) {
        if (updates.name && updates.name.trim()) session.user.name = updates.name.trim();
        if (updates.avatarUrl !== undefined) session.user.avatarUrl = updates.avatarUrl;
      }
    }
    this.saveSessionsToDisk();
    return this.toSafeUser(user);
  }

  public async resetPassword(email: string, newPassword: string): Promise<AuthUser> {
    const cleanEmail = email.toLowerCase().trim();
    const user = await this.findByEmail(cleanEmail);
    if (!user) {
      throw new Error("Không tìm thấy tài khoản với địa chỉ email này.");
    }

    if (newPassword.length < 6) {
      throw new Error("Mật khẩu mới phải có tối thiểu 6 ký tự.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = this.hashPassword(newPassword, salt);

    user.passwordHash = passwordHash;
    user.salt = salt;

    // Ensure credentials provider is added if user signed up via OAuth previously
    const hasCred = user.identities.some((i) => i.provider === "credentials");
    if (!hasCred) {
      user.identities.push({
        id: `ident_${crypto.randomBytes(8).toString("hex")}`,
        userId: user.id,
        provider: "credentials",
        providerAccountId: cleanEmail,
        email: cleanEmail,
        createdAt: Date.now(),
      });
    }

    this.saveUsersToDisk();
    return this.toSafeUser(user);
  }

  public verifyPassword(user: StoredUser, passwordAttempt: string): boolean {
    if (!user.passwordHash || !user.salt) {
      return false;
    }
    const hash = this.hashPassword(passwordAttempt, user.salt);
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
  }

  public async createSession(user: AuthUser): Promise<AuthSession> {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const payload = {
      sub: user.id,
      user,
      exp: expiresAt,
      iat: Date.now(),
    };
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", AUTH_SECRET).update(payloadBase64).digest("base64url");
    const token = `${payloadBase64}.${sig}`;

    const session: AuthSession = {
      token,
      user,
      expiresAt,
    };

    this.sessions.set(token, session);
    this.saveSessionsToDisk();
    return session;
  }

  public async getSession(token: string): Promise<AuthSession | null> {
    if (!token) return null;

    // 1. Check in-memory first
    const cached = this.sessions.get(token);
    if (cached) {
      if (Date.now() > cached.expiresAt) {
        this.sessions.delete(token);
        this.saveSessionsToDisk();
        return null;
      }
      const latestUser = await this.findById(cached.user.id);
      if (latestUser) {
        cached.user = this.toSafeUser(latestUser);
      }
      return cached;
    }

    // 2. Stateless HMAC JWT verification (Essential for Vercel Serverless / multi-instance lambdas)
    try {
      const parts = token.split(".");
      if (parts.length === 2) {
        const [payloadBase64, sig] = parts;
        const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(payloadBase64).digest("base64url");
        if (sig === expectedSig) {
          const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf-8"));
          if (payload.exp && Date.now() <= payload.exp && payload.user) {
            let sessionUser: AuthUser = payload.user;
            const latestUser = await this.findById(sessionUser.id);
            if (latestUser) {
              sessionUser = this.toSafeUser(latestUser);
            }
            const session: AuthSession = {
              token,
              user: sessionUser,
              expiresAt: payload.exp,
            };
            this.sessions.set(token, session);
            return session;
          }
        }
      }
    } catch {}

    return null;
  }

  public async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
    this.saveSessionsToDisk();
  }

  public getSafeUser(stored: StoredUser): AuthUser {
    return this.toSafeUser(stored);
  }
}

// Global Singleton (persisted across HMR in development)
declare global {
  var __rubbyfilm_auth_repo: AuthRepository | undefined;
}

if (
  !globalThis.__rubbyfilm_auth_repo ||
  typeof (globalThis.__rubbyfilm_auth_repo as any).resetPassword !== "function" ||
  typeof (globalThis.__rubbyfilm_auth_repo as any).updateUserProfile !== "function"
) {
  globalThis.__rubbyfilm_auth_repo = new AuthRepository();
}

export const authRepository = globalThis.__rubbyfilm_auth_repo;
