export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_DELIVERY_PARTNER';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface SignupRequest {
  emailId: string;
  userName: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  tokenType: string;
}

export interface AuthUserInfo {
  username: string;
  emailId: string;
  role: UserRole;
}

export interface JwtTokenPayload {
  sub?: string;
  role?: UserRole;
  exp?: number;
}

export interface AuthSession {
  token: string | null;
  user: AuthUserInfo | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}
