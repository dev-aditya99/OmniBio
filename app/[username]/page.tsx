'use client';

import { use, useEffect, useState } from 'react';
import { getUserByUsername, getUserLinks, UserProfile, LinkItem } from '@/lib/db';
import { motion } from 'motion/react';
import { 
  ExternalLink, 
  Twitter, 
  Instagram, 
  Youtube, 
  Github, 
  Linkedin, 
  Facebook, 
  Globe,
  Mail,
  Music
} from 'lucide-react';
import Link from 'next/link';
import { OmniBioLogo } from '@/components/Logo';

const getIconForUrl = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return Twitter;
  if (lowerUrl.includes('instagram.com')) return Instagram;
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return Youtube;
  if (lowerUrl.includes('github.com')) return Github;
  if (lowerUrl.includes('linkedin.com')) return Linkedin;
  if (lowerUrl.includes('facebook.com')) return Facebook;
  if (lowerUrl.includes('tiktok.com')) return Music;
  if (lowerUrl.includes('mailto:')) return Mail;
  return Globe;
};

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await getUserByUsername(username);
        if (!userProfile) {
          setError(true);
          setLoading(false);
          return;
        }

        setProfile(userProfile);
        const userLinks = await getUserLinks(userProfile.uid);
        setLinks(userLinks.filter(link => link.isActive));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="space-y-4 max-w-xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
          Create your own OmniBio
        </Link>
      </div>
    );
  }

  const theme = profile.theme || {
    backgroundColor: '#f9fafb', // gray-50
    textColor: '#111827', // gray-900
    buttonColor: '#ffffff',
    buttonTextColor: '#111827',
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="max-w-3xl mx-auto w-full flex-grow">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={profile.name}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-lg mb-4"
            />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg mb-4">
              <span className="text-3xl font-bold text-indigo-600">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold" style={{ color: theme.textColor }}>{profile.name}</h1>
          {profile.bio && (
            <p className="mt-2 max-w-md mx-auto opacity-80" style={{ color: theme.textColor }}>{profile.bio}</p>
          )}
        </motion.div>

        {/* Links */}
        <div className="space-y-4 max-w-xl mx-auto">
          {links.length === 0 ? (
            <p className="text-center opacity-70">No links available yet.</p>
          ) : (
            links.map((link, index) => {
              const Icon = getIconForUrl(link.url);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-black/5 relative overflow-hidden"
                  style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative z-10 flex items-center w-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium ml-4 flex-grow text-center pr-10">{link.title}</span>
                    <ExternalLink className="w-4 h-4 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              );
            })
          )}
        </div>
      </div>
      
      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center pb-8"
      >
        <Link href="/" className="inline-flex flex-col items-center group">
          <OmniBioLogo className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: theme.textColor }}>
            Create your own OmniBio
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
