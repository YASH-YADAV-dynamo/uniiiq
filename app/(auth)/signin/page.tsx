"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UniiqLogo from "@/components/ui/UniiqLogo";
import PasswordInput from "@/components/ui/PasswordInput";
import { signInWithGoogle, signInWithEmail } from "@/lib/supabase/auth-helpers";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { session, user } = await signInWithEmail(formData.email, formData.password);

      if (!user) {
        throw new Error("Failed to sign in. Please check your credentials.");
      }

      if (!session) {
        throw new Error("Session not created. Please check your email for confirmation or try again.");
      }

      // Store session token
      localStorage.setItem("supabase_token", session.access_token);

      // Ensure user profile exists (in case it wasn't created during signup)
      try {
        const response = await fetch("/api/auth/complete-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email || formData.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            mobile: user.user_metadata?.mobile || null,
            countryCode: user.user_metadata?.country_code || null,
            subscribeNewsletter: false,
            profilePictureUrl: user.user_metadata?.avatar_url || null,
          }),
        });

        // Don't fail signin if profile update fails
        if (!response.ok) {
          console.warn("Profile update failed during signin, but continuing...");
        }
      } catch (profileError) {
        console.warn("Profile update error during signin:", profileError);
        // Continue with signin even if profile update fails
      }

      // Use window.location for a hard redirect to ensure it works on Vercel
      window.location.href = "/preferences";
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Redirect will happen automatically via OAuth callback
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden overflow-x-hidden bg-white">
      {/* Left Section - Graphic */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-start bg-white relative pl-8 lg:pl-16">
        <div className="w-full max-w-md" style={{ top: '26px', left: '30px', position: 'relative' }}>
          <UniiqLogo className="mb-6" size="lg" />
          <div className="mb-16">
            <Image
              src="/login-graphics/sign-in-graphic.png"
              alt="Sign in illustration"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div 
            className="text-center"
            style={{ 
              width: '480px', 
              minHeight: '77.06px', 
              left: '0px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '9.06px'
            }}
          >
            <h1 
              className="text-gray-800 flex items-center justify-center gap-2"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans)",
                fontWeight: 600,
                fontSize: "36px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              Welcome to <UniiqLogo showImage={false} href={null} size="xl" className="inline-flex" />
            </h1>
            <p className="text-gray-500 text-sm">
              Let&apos;s get you set up to discover your perfect path to college!
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-4 sm:px-6 py-4 lg:py-4 lg:pl-1 lg:-ml-3 overflow-x-visible overflow-y-hidden lg:h-[calc(100vh-20px)]">
        <div className="w-full max-w-full sm:max-w-[648px] lg:w-[714px] lg:max-w-[714px] lg:h-full lg:my-4 rounded-[14px] border border-gray-300 bg-white pt-[30px] pr-6 pb-[30px] pl-[34px] flex flex-col overflow-hidden">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <UniiqLogo />
          </div>

          <h2 
            className="text-gray-900 mb-6 text-left"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans)",
              fontWeight: 700,
              fontSize: "28px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Sign in
          </h2>

                  {/* Social Login Buttons */}
                  <div className="flex flex-col sm:flex-row w-full sm:w-[656px] sm:h-[36.67px] gap-[6px] mb-5">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading || isLoading}
                      className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium py-[9px] px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-xs font-medium">Google</span>
            </button>
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-400 cursor-not-allowed transition-colors font-medium py-[9px] px-4 opacity-50"
              title="Coming soon"
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-xs font-medium">Facebook</span>
            </button>
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-400 cursor-not-allowed transition-colors font-medium py-[9px] px-4 opacity-50"
              title="Coming soon"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              <span className="text-xs font-medium">Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or sign in with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full sm:w-[648px] h-[44px] rounded border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-700 mb-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                }}
              >
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto sm:min-w-[105px] h-[37px] bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-[6px] mt-1 pt-2 pr-3 pb-2 pl-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Signing in..." : "Submit"}
                      {!isLoading && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-left text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

