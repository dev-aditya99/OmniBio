'use client';

import { useAuth } from '@/lib/auth-context';
import LinksManager from '@/components/LinksManager';
import { OmniBioLogo } from '@/components/Logo';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white shadow rounded-lg p-6 gap-4">
        <div className="flex items-center space-x-4">
          <OmniBioLogo className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Welcome to your Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">Manage your links here.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <LinksManager />
      </div>
    </div>
  );
}
