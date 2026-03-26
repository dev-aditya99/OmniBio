'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserProfile, updateUserProfile, UserProfile, ThemeConfig } from '@/lib/db';
import { Palette, Check } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import toast from 'react-hot-toast';

const PREDEFINED_THEMES: { name: string; config: ThemeConfig }[] = [
  {
    name: 'Light (Default)',
    config: {
      backgroundColor: '#f3f4f6', // gray-100
      textColor: '#111827', // gray-900
      buttonColor: '#ffffff',
      buttonTextColor: '#111827',
    }
  },
  {
    name: 'Dark',
    config: {
      backgroundColor: '#111827', // gray-900
      textColor: '#f9fafb', // gray-50
      buttonColor: '#1f2937', // gray-800
      buttonTextColor: '#f9fafb',
    }
  },
  {
    name: 'Ocean',
    config: {
      backgroundColor: '#e0f2fe', // sky-100
      textColor: '#0c4a6e', // sky-900
      buttonColor: '#0284c7', // sky-600
      buttonTextColor: '#ffffff',
    }
  },
  {
    name: 'Sunset',
    config: {
      backgroundColor: '#ffedd5', // orange-100
      textColor: '#7c2d12', // orange-900
      buttonColor: '#ea580c', // orange-600
      buttonTextColor: '#ffffff',
    }
  },
  {
    name: 'Forest',
    config: {
      backgroundColor: '#dcfce7', // green-100
      textColor: '#14532d', // green-900
      buttonColor: '#16a34a', // green-600
      buttonTextColor: '#ffffff',
    }
  }
];

export default function ThemeSelector() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(PREDEFINED_THEMES[0].config);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((p) => {
        setProfile(p);
        if (p?.theme) {
          setCustomTheme(p.theme);
          const isPredefined = PREDEFINED_THEMES.some(
            t => JSON.stringify(t.config) === JSON.stringify(p.theme)
          );
          setIsCustom(!isPredefined);
        }
      });
    }
  }, [user]);

  const handleApplyTheme = async (themeConfig: ThemeConfig, custom: boolean = false) => {
    if (!user || !profile) return;
    
    setSaving(true);
    
    try {
      await updateUserProfile(user.uid, { theme: themeConfig });
      setProfile({ ...profile, theme: themeConfig });
      setCustomTheme(themeConfig);
      setIsCustom(custom);
      toast.success('Theme updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomChange = (field: keyof ThemeConfig, value: string) => {
    const newTheme = { ...customTheme, [field]: value };
    setCustomTheme(newTheme);
    setIsCustom(true);
  };

  if (!profile) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="flex space-x-4">
          {[1, 2, 3].map(i => <div key={i} className="h-12 w-12 bg-gray-200 rounded-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-900">Theme Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Predefined Themes</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {PREDEFINED_THEMES.map((theme) => {
              const isSelected = !isCustom && JSON.stringify(profile.theme || PREDEFINED_THEMES[0].config) === JSON.stringify(theme.config);
              return (
                <button
                  key={theme.name}
                  onClick={() => handleApplyTheme(theme.config, false)}
                  className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div 
                    className="w-12 h-12 rounded-full mb-2 shadow-inner border border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: theme.config.backgroundColor }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm"
                      style={{ backgroundColor: theme.config.buttonColor }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                  {isSelected && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 relative">
          <label className="block text-sm font-medium text-gray-700 mb-4">Custom Theme</label>
          
          {!profile.isPremium && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-lg mt-8">
              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-center max-w-xs">
                <div className="mx-auto w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                  <Palette className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Premium Feature</h3>
                <p className="text-xs text-gray-500 mb-4">Upgrade to Premium to unlock custom colors and full theme control.</p>
                <button 
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-2 gap-4 ${!profile.isPremium ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Background Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={customTheme.backgroundColor}
                  onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                  disabled={!profile.isPremium}
                />
                <span className="text-sm font-mono text-gray-600">{customTheme.backgroundColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Text Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={customTheme.textColor}
                  onChange={(e) => handleCustomChange('textColor', e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                  disabled={!profile.isPremium}
                />
                <span className="text-sm font-mono text-gray-600">{customTheme.textColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Background</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={customTheme.buttonColor}
                  onChange={(e) => handleCustomChange('buttonColor', e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                  disabled={!profile.isPremium}
                />
                <span className="text-sm font-mono text-gray-600">{customTheme.buttonColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Text</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={customTheme.buttonTextColor}
                  onChange={(e) => handleCustomChange('buttonTextColor', e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                  disabled={!profile.isPremium}
                />
                <span className="text-sm font-mono text-gray-600">{customTheme.buttonTextColor}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => handleApplyTheme(customTheme, true)}
              disabled={saving || !profile.isPremium}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {saving ? <><Spinner className="mr-2" /> Applying...</> : 'Apply Custom Theme'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
