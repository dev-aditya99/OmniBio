"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { OmniBioLogo } from "@/components/Logo";
import { Link as LinkIcon, Share2, BarChart3, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <OmniBioLogo className="w-10 h-10" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            OmniBio
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-4"
        >
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Log in
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all hover:shadow-md"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all hover:shadow-md"
            >
              Sign up
            </Link>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            One link for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              everything
            </span>{" "}
            you do.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">
            Connect your audience to all of your content with just one link.
            OmniBio is the central hub for your online presence.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              {user ? "Check Your Dashboard" : "Get Started for Free"}

              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Features */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: LinkIcon,
              title: "Unlimited Links",
              desc: "Add as many links as you need to your profile.",
            },
            {
              icon: Share2,
              title: "Share Anywhere",
              desc: "Use your OmniBio link on Instagram, TikTok, Twitter, and more.",
            },
            {
              icon: BarChart3,
              title: "Track Clicks",
              desc: "See exactly what your audience is clicking on.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
