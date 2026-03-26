'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserProfile } from '@/lib/db';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function PreviewButton({ className = '' }: { className?: string }) {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        if (profile?.username) {
          setUsername(profile.username);
        }
      });
    }
  }, [user]);

  if (!username) return null;

  return (
    <Link
      href={`/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${className}`}
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Preview
    </Link>
  );
}
