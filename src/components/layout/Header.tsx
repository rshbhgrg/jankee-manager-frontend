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

import { Menu } from 'lucide-react';
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
 * - User account dropdown
 * - Sticky positioning
 *
 * @param onMenuClick - Callback to toggle mobile sidebar
 * @param className - Optional CSS classes
 *
 * @example
 * <Header onMenuClick={toggleSidebar} />
 */
export function Header({ onMenuClick, className }: HeaderProps) {
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
                {/* User avatar placeholder */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                  U
                </div>
                <span className="hidden text-sm font-medium md:inline">User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
