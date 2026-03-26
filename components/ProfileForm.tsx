'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/db';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import toast from 'react-hot-toast';

export default function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  const processFile = (file: File) => {
    if (!file || !profile) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProfile({ ...profile, profileImageUrl: dataUrl });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemovePhoto = () => {
    if (profile) {
      setProfile({ ...profile, profileImageUrl: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setSaving(true);
    
    try {
      await updateUserProfile(user.uid, {
        username: profile.username,
        name: profile.name,
        bio: profile.bio,
        profileImageUrl: profile.profileImageUrl
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div 
            className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex-shrink-0 h-24 w-24 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col space-y-3 text-center sm:text-left">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </button>
                {profile.profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Drag and drop an image, or click to browse. JPG, GIF or PNG. Max 1MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              omnibio.com/
            </span>
            <input
              type="text"
              required
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows={3}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tell your audience about yourself"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {saving ? <><Spinner className="mr-2" /> Saving...</> : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
