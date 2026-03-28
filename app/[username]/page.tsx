"use client";

import { use, useEffect, useState } from "react";
import {
  getUserByUsername,
  getUserLinks,
  UserProfile,
  LinkItem,
} from "@/lib/db";
import { motion, AnimatePresence } from "motion/react";
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
  Music,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  FaAmazon,
  FaPinterest,
  FaShare,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaCopy,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { OmniBioLogo } from "@/components/Logo";
import toast from "react-hot-toast";

const getIconForUrl = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return Twitter;
  if (lowerUrl.includes("instagram.com")) return Instagram;
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
    return Youtube;
  if (lowerUrl.includes("github.com")) return Github;
  if (lowerUrl.includes("linkedin.com")) return Linkedin;
  if (lowerUrl.includes("facebook.com")) return Facebook;
  if (lowerUrl.includes("pinterest.com") || lowerUrl.includes("pin.it"))
    return FaPinterest;
  if (
    lowerUrl.includes("amazon.com") ||
    lowerUrl.includes("amazon.in") ||
    lowerUrl.includes("amzn.to")
  )
    return FaAmazon;
  if (lowerUrl.includes("tiktok.com")) return Music;
  if (lowerUrl.includes("mailto:")) return Mail;
  return Globe;
};

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

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
        setLinks(userLinks.filter((link) => link.isActive));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [username]);

  // copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      // 1. Agar modern clipboard API available hai (HTTPS/Localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success("Link Copied!");
      } else {
        // 2. Fallback: Phone par local testing ke liye (Bina HTTPS)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Textarea ko screen se bahar chupao taaki UI kharab na ho
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          toast.success("Link Copied!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to copy link");
        } finally {
          textArea.remove();
        }
      }
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Error copying link");
    }
  };

  // Handle Share Link
  const handleShareingLink = (url: string) => {
    const finalURL = window.location.href + "/" + encodeURIComponent(url);
    setShareUrl(finalURL);
    setIsShareOpen(true);
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          User Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
        >
          Create your own OmniBio
        </Link>
      </div>
    );
  }

  const theme = profile.theme || {
    backgroundColor: "#f9fafb", // gray-50
    textColor: "#111827", // gray-900
    buttonColor: "#ffffff",
    buttonTextColor: "#111827",
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
          <h1 className="text-2xl font-bold" style={{ color: theme.textColor }}>
            {profile.name}
          </h1>
          {profile.bio && (
            <p
              className="whitespace-pre-wrap mt-2 max-w-md mx-auto opacity-80"
              style={{ color: theme.textColor }}
            >
              {profile.bio}
            </p>
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
                <motion.div
                  key={link.id + "1"}
                  className="flex items-center justify-center gap-2"
                >
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
                    className="group flex flex-1 items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-black/5 relative overflow-hidden"
                    style={{
                      backgroundColor: theme.buttonColor,
                      color: theme.buttonTextColor,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10 flex items-center w-full">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium ml-4 flex-grow text-center pr-10">
                        {link.title}
                      </span>
                      <ExternalLink className="w-4 h-4 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.a>
                  <motion.button className="p-2 bg-[#1f2937] rounded-full">
                    <FaShare
                      onClick={() => handleShareingLink(link.url)}
                      className="group-hover:hidden"
                    />
                  </motion.button>
                </motion.div>
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
          <span
            className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ color: theme.textColor }}
          >
            Create your own OmniBio
          </span>
        </Link>
      </motion.div>

      {/* BOTTOM SLIDE-UP DRAWER */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            {/* 1. Dark Overlay (Bahar click karne par band karne ke liye) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* 2. Slide-up Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl pb-10 sm:max-w-md sm:mx-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Share this profile
                </h3>
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <X className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Social Icons Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this profile: ${shareUrl}`)}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl group-hover:bg-green-500 group-hover:text-white transition-all">
                    <FaWhatsapp />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    WhatsApp
                  </span>
                </a>

                {/* Twitter (X) */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this profile!")}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-gray-100 text-black rounded-full flex items-center justify-center text-3xl group-hover:bg-black group-hover:text-white transition-all">
                    <FaXTwitter />
                  </div>
                  <span className="text-xs font-medium text-gray-600">X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FaFacebook />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Facebook
                  </span>
                </a>

                {/* Instagram (Sirf copy karega kyunki IG API nahi deta web sharing ki) */}
                <button
                  onClick={() => {
                    copyToClipboard(shareUrl);
                    setIsShareOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-3xl group-hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 group-hover:text-white transition-all">
                    <FaCopy />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Copy URL
                  </span>
                </button>
              </div>

              {/* Copy Link Button (Full width) */}
              <button
                onClick={() => {
                  copyToClipboard(shareUrl);
                  setIsShareOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors border border-gray-200"
              >
                <FaCopy className="w-8" />
                <span className="truncate">{shareUrl}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
