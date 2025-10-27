/**
 * 404 Not Found Page
 *
 * Displayed when user navigates to a non-existent route
 * - User-friendly error message
 * - Navigation back to home
 * - Helpful links
 */

import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/constants';

/**
 * 404 Not Found Page Component
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <Search className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription className="text-base">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(ROUTES.HOME)} size="lg" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} size="lg" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Quick Links:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.SITES)}
                className="justify-start"
              >
                Sites
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.CLIENTS)}
                className="justify-start"
              >
                Clients
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ACTIVITIES)}
                className="justify-start"
              >
                Activities
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.REPORTS)}
                className="justify-start"
              >
                Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
