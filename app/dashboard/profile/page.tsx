'use client';

import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Profile Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 truncate">Update your personal information and bio.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
}
