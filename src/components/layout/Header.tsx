/**
 * Header Component
 *
 * Top navigation bar with:
 * - Menu toggle button (mobile)
 * - App branding/logo
 * - User menu with dropdown
 * - Quick actions
 *
 * Fixed at the top of the viewport
 */

import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { getUserFullName, getUserInitials } from '@/types/user';
import authService from '@/services/auth.service';
import { ROUTES } from '@/config/constants';

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

/**
 * Application header component
 *
 * Features:
 * - Responsive menu toggle for mobile
 * - App branding
 * - User account dropdown with real data
 * - Logout functionality
 * - Sticky positioning
 *
 * @param onMenuClick - Callback to toggle mobile sidebar
 * @param className - Optional CSS classes
 *
 * @example
 * <Header onMenuClick={toggleSidebar} />
 */
export function Header({ onMenuClick, className }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout: clearAuthState } = useAuthStore();

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    // Clear tokens from localStorage
    authService.logout();

    // Clear auth state from store
    clearAuthState();

    // Redirect to login page
    navigate(ROUTES.LOGIN);
  };

  // Fallback values if user data is not available
  const userFullName = user ? getUserFullName(user) : 'User';
  const userInitials = user ? getUserInitials(user) : 'U';
  const userEmail = user?.email || 'user@example.com';

  return (
    <header
      className={cn(
        'fixed top-0 z-30 h-16 w-full',
        'border-b bg-white shadow-sm',
        'lg:left-64 lg:w-[calc(100%-16rem)]', // Offset by sidebar on large screens
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left side - Menu button (mobile) + Branding */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* App name/logo (visible on mobile when sidebar is collapsed) */}
          <h1 className="text-xl font-semibold text-gray-900 lg:hidden">Jankee Manager</h1>
        </div>

        {/* Right side - User menu and actions */}
        <div className="flex items-center gap-2">
          {/* User menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {/* User avatar with initials */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                  {userInitials}
                </div>
                <span className="hidden text-sm font-medium md:inline">{userFullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userFullName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
