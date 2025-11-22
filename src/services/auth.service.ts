/**
 * Authentication Service
 *
 * Handles authentication operations:
 * - Login with email/password
 * - User registration
 * - Token refresh
 * - Logout
 */

import api from './api';
import type { User } from '@/types/user';

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response from backend
 */
export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'manager' | 'admin';
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication service class
 */
class AuthService {
  /**
   * Login with email and password
   *
   * @param email - User email
   * @param password - User password
   * @returns Login response with user data and tokens
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const loginData = response.data as LoginResponse;

    // Store tokens in localStorage
    if (loginData.tokens) {
      this.setTokens(loginData.tokens.accessToken, loginData.tokens.refreshToken);
    }

    return loginData;
  }

  /**
   * Register a new user
   *
   * @param data - Registration data
   * @returns Login response (auto-login after registration)
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);

    const loginData = response.data as LoginResponse;

    // Store tokens in localStorage (auto-login)
    if (loginData.tokens) {
      this.setTokens(loginData.tokens.accessToken, loginData.tokens.refreshToken);
    }

    return loginData;
  }

  /**
   * Refresh access token using refresh token
   *
   * @returns New tokens
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    const tokenData = response.data as RefreshTokenResponse;

    // Update tokens in localStorage
    this.setTokens(tokenData.accessToken, tokenData.refreshToken);

    return tokenData;
  }

  /**
   * Logout user
   * Clears tokens from localStorage
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Store tokens in localStorage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    // Check if token is expired (basic check)
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length < 2 || !tokenParts[1]) {
        return false;
      }
      const payload = JSON.parse(atob(tokenParts[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user from token payload
   * Note: This is for quick access - always verify with backend
   */
  getCurrentUserFromToken(): Partial<User> | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? ''));
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
