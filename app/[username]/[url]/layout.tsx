import { Metadata } from "next";
import { getUserByUsername } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; url: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = await getUserByUsername(resolvedParams.username);
  const sharedURL = decodeURIComponent(resolvedParams.url as string);

  if (!profile) {
    return {
      title: "Profile Not Found | OmniBio",
    };
  }

  return {
    title: `${profile.name} (@${profile.username}) | Shared Link | OmniBio`,
    description:
      profile.bio || `Check out ${profile.name}'s shared link. ${sharedURL}`,
    openGraph: {
      title: `${profile.name} (@${profile.username}) | Shared Link | OmniBio`,
      description:
        profile.bio || `Check out ${profile.name}'s shared link. ${sharedURL}`,
      images: profile.profileImageUrl
        ? [profile.profileImageUrl]
        : "https://ik.imagekit.io/adityazvs6yuayk/logos/OmniBio-Square-Transparent-Logo-1.png",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} (@${profile.username}) | Shared Link | OmniBio`,
      description:
        profile.bio || `Check out ${profile.name}'s shared link. ${sharedURL}`,
      images: profile.profileImageUrl
        ? [profile.profileImageUrl]
        : "https://ik.imagekit.io/adityazvs6yuayk/logos/OmniBio-Square-Transparent-Logo-1.png",
    },
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
