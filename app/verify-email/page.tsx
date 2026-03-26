"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import { OmniBioLogo } from "@/components/Logo";
import { LogOut, MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleCheckVerification = async () => {
    if (!user) return;
    setChecking(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        toast.success("Email verified successfully!");
        router.push("/dashboard/profile");
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check verification status");
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    setResending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email resent! Check your inbox.");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to resend email. Please try again later.",
      );
    } finally {
      setResending(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <MailCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            We've sent a verification link to{" "}
            <span className="font-semibold text-gray-900">{user.email}</span>.
            Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
          >
            {checking ? (
              <>
                <Spinner className="mr-2" /> Checking...
              </>
            ) : (
              "I've verified my email"
            )}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
          >
            {resending ? (
              <>
                <Spinner className="mr-2" /> Resending...
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => signOut()}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out and try another account
          </button>
        </div>
      </div>
    </div>
  );
}
