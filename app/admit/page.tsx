"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdmitPage() {
  const router = useRouter();

  const academicFields = [
    "COMPUTER SCIENCE",
    "ECONOMICS",
    "PSYCHOLOGY",
    "BUSINESS ADMINISTRATION",
    "POLITICAL SCIENCE",
    "MECHANICAL ENGINEERING",
  ];

  const handleGetStarted = () => {
    // Navigate to next step or assessment
    router.push("/smartadmit");
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{ backgroundColor: '#232323' }}>
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center relative z-10">
        <Link href="/">
          <Image
            src="/white-logo.png"
            alt="Uniiq Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <span className="text-sm">Skip, Back to Dashboard</span>
          <svg
            className="w-4 h-4"
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
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div 
          className="bg-white shadow-2xl relative overflow-hidden mx-auto"
          style={{
            width: '1275px',
            minHeight: '130px',
            borderWidth: '0.84px',
            borderStyle: 'solid',
            borderColor: '#e5e7eb',
            paddingTop: '30px',
            paddingRight: '24px',
            paddingBottom: '30px',
            paddingLeft: '24px',
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
            borderBottomLeftRadius: '14px',
            borderBottomRightRadius: '14px',
          }}
        >
          {/* Title Section - Top - Centered */}
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              WELCOME TO
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans)",
                fontWeight: 700,
              }}
            >
              SmartAdmit
            </h1>
            {/* Horizontal Line */}
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {/* Content Grid - Text and Graphics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mt-6">
            {/* Left Side - Text Content */}
            <div className="space-y-4">
              {/* Descriptive Text */}
              <div className="space-y-3">
                <p 
                  className="text-gray-700"
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '142%',
                    letterSpacing: '0%',
                    verticalAlign: 'bottom',
                  }}
                >
                  SmartAdmit helps you assess your chances of getting into your dream college by analyzing your grades, test scores, extracurriculars, and more. Unlock personalized insights, see how you stack up, and discover ways to boost your application with the Smart Admit.
                </p>
                <p 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '142%',
                    letterSpacing: '0%',
                    verticalAlign: 'bottom',
                  }}
                >
                  YOUR DREAM SCHOOL IS CALLING—SEE HOW CLOSE YOU ARE TO ANSWERING!
                </p>
              </div>

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-base mt-6"
                style={{ backgroundColor: '#232323' }}
              >
                Get started
                <svg
                  className="w-4 h-4"
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
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/smartadmit-graphics.png"
                  alt="SmartAdmit illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Academic Fields Tags - Bottom Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 justify-center">
              {academicFields.map((field, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Graphic at Bottom - Same as preferences */}
      <div className="fixed bottom-0 left-0 right-0 z-0">
        <Image
          src="/graphic1.png"
          alt="City skyline"
          width={1920}
          height={400}
          className="w-full h-auto opacity-30"
          priority
        />
      </div>
    </div>
  );
}

