/**
 * Login Page
 *
 * Handles user authentication with email/password
 */

import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthUser } = useAuthStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get redirect location from state, default to root (dashboard)
  const from = (location.state as any)?.from?.pathname || '/';

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call auth service to login (stores tokens in localStorage)
      const response = await authService.login(email, password);

      // Update auth store with user data
      setAuthUser(response.user);

      // Redirect to original location or dashboard
      navigate(from, { replace: true });
    } catch (err: any) {
      // Handle error
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Jankee Manager</h1>
          <h2 className="mt-6 text-3xl font-semibold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">Manage your advertising sites and clients</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Additional Links */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                Remember me
              </label>
            </div>

            <div>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
