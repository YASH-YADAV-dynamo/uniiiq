"use client";

import Image from "next/image";
import Link from "next/link";
import UniiqLogo from "@/components/ui/UniiqLogo";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar - Hidden on mobile, shown on desktop */}
      <header className="hidden lg:block sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <UniiqLogo href="/" size="md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-sm text-gray-500">
                Find ways to improve your academics, track your scores and access tutoring resources.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {/* Notification Bell */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* User Profile */}
            <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">S</span>
              </div>
              <span className="text-sm font-medium">Scarlet</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-2 sm:p-6 space-y-4 sm:space-y-6">
        {/* Combined Welcome Section - Black Background with White Section Inside */}
        <div className="border border-gray-300 relative overflow-visible" style={{ borderRadius: '14px' }}>
          {/* Black Background Section - Parent Container */}
          <div className="bg-black p-5 pb-7 relative z-0" style={{ borderRadius: '14px', minHeight: '200px' }}>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1">Hi Scarlet, Welcome!</h2>
              <p className="text-gray-300 text-base">You&apos;re making great progress!</p>
            </div>

            {/* Graphic - Positioned at top right of black div */}
            <div className="absolute top-0 right-0 z-[100]">
              <Image
                src="/graphic2.png"
                alt="Student studying illustration"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>

            {/* White Section - Inside Black Section */}
            <div className="bg-white p-3 relative z-20 mt-27 mx-auto" style={{ borderRadius: '14px', width: '95%' }}>
            <h3 className="text-base font-semibold text-gray-900 mb-7 uppercase">
              HERE ARE SOME SUGGESTED NEXT STEPS TO HELP YOU REACH YOUR GOALS:
            </h3>
            
            {/* Progress Steps - Horizontal Timeline with 6 numbered black circles */}
            <div className="relative flex items-start justify-between pb-2 overflow-x-auto">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center flex-1 z-10 min-w-[80px] sm:min-w-[100px]">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Identify Your Goals</span>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center flex-1 z-10">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Assess Your Chances</span>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center flex-1 z-10">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Build a Strong Profile</span>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex flex-col items-center flex-1 z-10">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Shortlist the Right Universities</span>
              </div>
              
              {/* Step 5 */}
              <div className="relative flex flex-col items-center flex-1 z-10">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Craft Your Essays and Applications</span>
              </div>
              
              {/* Step 6 */}
              <div className="relative flex flex-col items-center flex-1 z-10">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 border-2 border-white">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                <span className="text-xs text-gray-700 text-center px-1">Keep Track of your Applications</span>
              </div>
              
              {/* Continuous horizontal line connecting from circle 1 to circle 6 */}
              <div className="absolute top-4 left-[4%] right-[4%] h-0.5 bg-gray-300"></div>
            </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Calendar on Left, Activities & Journey on Right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Student Calendar - Left Column (Full Height) */}
          <div className="w-full lg:w-[577px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Student Calendar</h3>
                <p className="text-sm text-gray-500">
                  Keep all your tasks, deadlines, and important dates in one place.
                </p>
              </div>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1">
                Today
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Weekly Calendar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <div key={day} className="flex-1 text-center">
                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 3
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {12 + index}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Date */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">Thursday - 15 May, 2025</p>
            </div>

            {/* Timeline */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">7 AM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">8 AM</div>
                <div className="flex-1">
                  <div className="bg-red-50 border border-red-200 rounded-md p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs font-medium text-red-900">8:30 AM</div>
                    </div>
                    <div className="text-sm text-red-800">Debate Club</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">9 AM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">10 AM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">11 AM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">12 PM</div>
                <div className="flex-1">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs font-medium text-blue-900">12:00 PM</div>
                    </div>
                    <div className="text-sm text-blue-800">Meeting with (counsellor name)</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">1 PM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">2 PM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-gray-500 w-12 pt-1">3 PM</div>
                <div className="flex-1 h-px bg-gray-200 mt-2"></div>
              </div>
            </div>
            
            {/* Add New Button */}
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                + Add new
              </button>
            </div>
          </div>

          {/* Right Column - Activities and Journey Snapshot */}
          <div className="flex-1 space-y-6">
            {/* Recent Activities - Top Right */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <div className="w-2 h-2 rounded-full bg-gray-900" style={{ aspectRatio: '1/1' }}></div>
                    </div>
                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-gray-900">Submitted mock essay</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <div className="w-2 h-2 rounded-full bg-gray-900" style={{ aspectRatio: '1/1' }}></div>
                    </div>
                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-gray-900">Submitted Pace Application! 🎉</p>
                    <p className="text-xs text-gray-500 mt-1">4 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <div className="w-2 h-2 rounded-full bg-gray-900" style={{ aspectRatio: '1/1' }}></div>
                    </div>
                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-gray-900">
                      Set appointment with (counsellor name here) for April 7, 2021
                    </p>
                    <p className="text-xs text-gray-500 mt-1">4 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <div className="w-2 h-2 rounded-full bg-gray-900" style={{ aspectRatio: '1/1' }}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Added a new grade</p>
                    <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Need Guidance? Book a Session
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Your Journey Snapshot - Bottom Right */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Your Journey Snapshot</h3>
                <Link href="/journey" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Extracurriculars */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/extracurricular-activities (1) 1.png"
                    alt="Extracurriculars"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Extracurriculars</p>
                    <p className="text-lg font-bold text-gray-900">1</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Summer Courses */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/summer-courses.png"
                    alt="Summer Courses"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Summer Courses</p>
                    <p className="text-lg font-bold text-gray-900">3</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Academics */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/graduation.png"
                    alt="Academics"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Academics</p>
                    <p className="text-lg font-bold text-gray-900">4</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Research & Work Experiences */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/research.png"
                    alt="Research & Work Experiences"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Research & Work Experiences</p>
                    <p className="text-lg font-bold text-gray-900">0</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Academic Competitions */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/medal.png"
                    alt="Academic Competitions"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Academic Competitions</p>
                    <p className="text-lg font-bold text-gray-900">2</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Universities Shortlisted */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image
                    src="/journey-snapshot/universities-shortlisted.png"
                    alt="Universities Shortlisted"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Universities Shortlisted</p>
                    <p className="text-lg font-bold text-gray-900">5</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Fit Colleges */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Best Fit Colleges</h3>
              <p className="text-sm text-gray-500">Discover colleges perfectly suited for you.</p>
            </div>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
              Shortlist Your Dream University
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brown University Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/colleges/brown.png"
                    alt="Brown University"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Brown University</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Competitive
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Providence, Rhode Island</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Brown University is a private Ivy League institution with approximately 10,000 students.
              </p>

              <div className="text-sm text-gray-700 mb-4">
                <p className="font-medium">
                  SmartAdmit Score: 65% | GPA: 3.9 | SAT: 1500 | ACT: 34
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tuition: $65,000</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Avg Aid: $45,000</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  View
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                  Apply Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Princeton University Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/colleges/princeton.png"
                    alt="Princeton University"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Princeton University</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Competitive
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Princeton, New Jersey</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Princeton University is a private Ivy League institution with approximately 5,700 students.
              </p>

              <div className="text-sm text-gray-700 mb-4">
                <p className="font-medium">
                  SmartAdmit Score: 65% | GPA: 3.9 | SAT: 1500 | ACT: 34
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tuition: $65,000</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Avg Aid: $45,000</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  View
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                  Apply Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

