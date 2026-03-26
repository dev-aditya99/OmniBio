import { Metadata } from 'next';
import { getUserByUsername } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = await getUserByUsername(resolvedParams.username);
  
  if (!profile) {
    return {
      title: 'Profile Not Found | OmniBio',
    };
  }

  return {
    title: `${profile.name} (@${profile.username}) | OmniBio`,
    description: profile.bio || `Check out ${profile.name}'s links on OmniBio.`,
    openGraph: {
      title: `${profile.name} (@${profile.username}) | OmniBio`,
      description: profile.bio || `Check out ${profile.name}'s links on OmniBio.`,
      images: profile.profileImageUrl ? [profile.profileImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} (@${profile.username}) | OmniBio`,
      description: profile.bio || `Check out ${profile.name}'s links on OmniBio.`,
      images: profile.profileImageUrl ? [profile.profileImageUrl] : [],
    }
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
