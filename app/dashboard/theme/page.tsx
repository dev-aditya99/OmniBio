'use client';

import ThemeSelector from '@/components/ThemeSelector';

export default function ThemePage() {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Appearance</h1>
        <p className="text-sm sm:text-base text-gray-600 truncate">Customize the look and feel of your OmniBio.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ThemeSelector />
      </div>
    </div>
  );
}
