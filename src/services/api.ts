/**
 * API Client Configuration
 *
 * Axios instance with interceptors for:
 * - Request logging
 * - Authentication headers
 * - Response data extraction
 * - Error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/config/constants';
import type { ApiResponse, ApiError } from '@/types';
import authService from './auth.service';

/**
 * Create Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 *
 * Adds authentication token and logs requests in development
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const token = authService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Handles successful responses and errors consistently
 */
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from ApiResponse wrapper if present
    if (response.data && 'success' in response.data && 'data' in response.data) {
      const apiResponse = response.data as ApiResponse<unknown>;

      // Log success in development
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.config.url}`, apiResponse.data);
      }

      // Return the actual data, not the wrapper
      return { ...response, data: apiResponse.data };
    }

    // Return response as-is if not wrapped
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle errors consistently

    // Extract error details
    let apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      // Check if response has ApiError format
      if (data && 'error' in data && data.error) {
        apiError = data.error as ApiError;
      } else {
        // Generic error based on status code
        switch (status) {
          case 400:
            apiError = {
              code: 'BAD_REQUEST',
              message: 'Invalid request data',
            };
            break;
          case 401:
            apiError = {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            };
            break;
          case 403:
            apiError = {
              code: 'FORBIDDEN',
              message: 'Access denied',
            };
            break;
          case 404:
            apiError = {
              code: 'NOT_FOUND',
              message: 'Resource not found',
            };
            break;
          case 422:
            apiError = {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed',
            };
            break;
          case 500:
            apiError = {
              code: 'SERVER_ERROR',
              message: 'Internal server error',
            };
            break;
          default:
            apiError = {
              code: `HTTP_${status}`,
              message: error.message || 'Server error occurred',
            };
        }
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(
          `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
          apiError
        );
      }

      // Handle 401 - redirect to login
      if (status === 401) {
        // Clear auth data
        authService.logout();
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Redirect to login page
        // Only redirect if not already on login page to prevent infinite loop
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      apiError = {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your connection.',
      };

      if (import.meta.env.DEV) {
        console.error('[API Network Error]', error.request);
      }
    } else {
      // Error in request setup
      apiError = {
        code: 'REQUEST_ERROR',
        message: error.message || 'Failed to make request',
      };

      if (import.meta.env.DEV) {
        console.error('[API Request Setup Error]', error.message);
      }
    }

    // Attach error details to error object for easy access
    (error as AxiosError & { apiError: ApiError }).apiError = apiError;

    return Promise.reject(error);
  }
);

/**
 * Type-safe API error extractor
 *
 * Extract ApiError from AxiosError
 */
export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError & { apiError?: ApiError };
    return (
      axiosError.apiError || {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      }
    );
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
};

/**
 * Export configured API client
 */
export default apiClient;
