/**
 * Error Classes and Utilities
 *
 * Custom error classes for different error scenarios
 */

/**
 * Base Application Error
 *
 * Extends Error with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'APP_ERROR',
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * API Error
 *
 * Errors from API requests
 */
export class ApiError extends AppError {
  constructor(message: string, code = 'API_ERROR', details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Validation Error
 *
 * Errors from form validation
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', fields);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error
 *
 * Errors related to authentication/authorization
 */
export class AuthError extends AppError {
  constructor(message: string, code = 'AUTH_ERROR') {
    super(message, code);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Network Error
 *
 * Errors from network issues
 */
export class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Not Found Error
 *
 * Errors when resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error handler helper
 *
 * Converts unknown errors to AppError instances
 */
export const handleError = (error: unknown): AppError => {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  // String error
  if (typeof error === 'string') {
    return new AppError(error, 'UNKNOWN_ERROR');
  }

  // Unknown error type
  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
};

/**
 * Log error to console (in development) or error tracking service (in production)
 *
 * @param error - Error to log
 * @param context - Additional context
 */
export const logError = (error: unknown, context?: Record<string, unknown>): void => {
  const appError = handleError(error);

  if (import.meta.env.DEV) {
    console.error('[Error]', {
      name: appError.name,
      message: appError.message,
      code: appError.code,
      details: appError.details,
      context,
      stack: appError.stack,
    });
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(appError, { extra: { context } });
    console.error(appError.message);
  }
};

/**
 * Get user-friendly error message
 *
 * Converts technical error messages to user-friendly ones
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  const appError = handleError(error);

  // Map of error codes to user-friendly messages
  const messages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    SERVER_ERROR: 'A server error occurred. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  };

  return messages[appError.code] || appError.message;
};
