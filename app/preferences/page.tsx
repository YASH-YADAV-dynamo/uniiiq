"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UniiqLogo from "@/components/ui/UniiqLogo";

export default function PreferencesPage() {
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "John",
    age: "18 years",
    currentGrade: "",
    schoolName: "Doo",
    citizenship: "Text",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Handle next section logic
    console.log("Next clicked");
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-white">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center relative z-10">
        <UniiqLogo href="/" size="lg" />
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans)",
                fontWeight: 700,
              }}
            >
              My Preferences
            </h1>
            <p className="text-gray-500 text-sm">
              Find ways to improve your academics, track your scores and access
              tutoring resources.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {/* Horizontal Line Above Personal Info */}
            <div className="border-t border-gray-200"></div>
            
            {/* Personal Info Section - Active */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6 border-l-4 border-yellow-500 pl-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h2
                    className="text-lg font-bold text-gray-900"
                    style={{
                      fontFamily: "var(--font-plus-jakarta-sans)",
                      fontWeight: 700,
                    }}
                  >
                    Personal Info
                  </h2>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Current Grade/Class */}
                    <div>
                      <label
                        htmlFor="currentGrade"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current Grade/Class<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="currentGrade"
                        name="currentGrade"
                        value={formData.currentGrade}
                        onChange={handleInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                    </div>

                    {/* School Name */}
                    <div>
                      <label
                        htmlFor="schoolName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        School Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="schoolName"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Age */}
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Age
                      </label>
                      <input
                        type="text"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Citizenship */}
                    <div>
                      <label
                        htmlFor="citizenship"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Citizenship<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="citizenship"
                        name="citizenship"
                        value={formData.citizenship}
                        onChange={handleInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="Text">Text</option>
                        <option value="US">US</option>
                        <option value="IN">India</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-900 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Next
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
              </div>
            </div>

            {/* Academic Preferences Section - Inactive */}
            <div
              className="border border-gray-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setActiveSection("academic")}
            >
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14v7m0-7l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 006.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <span className="text-gray-400 font-medium">Academic Preferences</span>
              </div>
            </div>

            {/* Goals Section - Inactive */}
            <div
              className="border border-gray-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setActiveSection("goals")}
            >
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-400 font-medium">Goals</span>
              </div>
            </div>

            {/* Budget Section - Inactive */}
            <div
              className="border border-gray-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setActiveSection("budget")}
            >
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-gray-400 font-medium">Budget</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Graphic at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-0">
        <Image
          src="/graphic1.png"
          alt="City skyline"
          width={1920}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}

