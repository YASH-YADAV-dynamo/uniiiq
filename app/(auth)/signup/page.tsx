"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UniiqLogo from "@/components/ui/UniiqLogo";
import CountryCodeSelect from "@/components/ui/CountryCodeSelect";
import PasswordInput from "@/components/ui/PasswordInput";
import FileUpload from "@/components/ui/FileUpload";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    password: "",
    confirmPassword: "",
    profilePicture: null as File | null,
    subscribeNewsletter: false,
    agreeToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase signup logic
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex h-screen overflow-hidden overflow-x-hidden bg-white">
      {/* Left Section - Graphic */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-start bg-white relative pl-8 lg:pl-16">
        <div className="w-full max-w-md" style={{ top: '26px', left: '30px', position: 'relative' }}>
          <UniiqLogo className="mb-6" size="lg" />
          <div className="mb-16">
            <Image
              src="/login-graphics/sign-up-graphic.png"
              alt="Sign up illustration"
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
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-4 lg:py-4 lg:pl-1 lg:-ml-3 overflow-x-visible">
        <div className="w-full max-w-full sm:max-w-[648px] lg:w-[714px] lg:max-w-[714px] rounded-[14px] border border-gray-300 bg-white pt-[30px] pr-6 pb-[30px] pl-[34px] flex flex-col">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <UniiqLogo />
          </div>

          <h2 className="text-3xl font-bold text-black mb-6 text-left">Sign up</h2>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-[656px] sm:h-[36.67px] gap-[6px] mb-6">
            <button
              type="button"
              className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium py-[9px] px-4"
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
              className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium py-[9px] px-4"
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
              className="flex-1 sm:flex-none sm:w-[214.67px] h-[36.67px] flex items-center justify-center gap-[10px] rounded-[6.22px] border-[0.78px] border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium py-[9px] px-4"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              <span className="text-xs font-medium">Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or sign in with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 flex-1">
            {/* Name */}
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full sm:w-[648px] h-[48px] rounded border border-gray-300 px-3 py-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full sm:w-[648px] h-[48px] rounded border border-gray-300 px-3 py-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Number */}
            <div className="mb-3">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-[648px]">
                <div className="w-full sm:w-auto sm:min-w-[120px]">
                  <CountryCodeSelect
                    value={formData.countryCode}
                    onChange={(code) =>
                      setFormData((prev) => ({ ...prev, countryCode: code }))
                    }
                  />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="(999) 999-9999"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="flex-1 w-full sm:w-auto h-[48px] rounded border border-gray-300 px-3 py-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
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

            {/* Confirm Password */}
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Upload Profile Picture */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Profile Picture
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/png,image/jpeg"
                maxSize={5}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Subscribe to our{" "}
                  <Link href="/newsletter" className="text-blue-600 hover:underline">
                    Newsletter.
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  By registering, I confirm that I have read and agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy.
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[105px] h-[37px] bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-[6px] pt-2 pr-3 pb-2 pl-4 mt-1"
            >
              Submit
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
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-left text-sm text-gray-600">
            Have an account?{" "}
            <Link href="/signin" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

