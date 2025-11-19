"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UniiqLogo from "@/components/ui/UniiqLogo";

export default function SmartAdmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [universityInput, setUniversityInput] = useState("");
  const [satScore, setSatScore] = useState("");
  const [gpaScale, setGpaScale] = useState("");
  const [gpaScore, setGpaScore] = useState("");
  const [currentGrade, setCurrentGrade] = useState("");
  const [extracurricularHours, setExtracurricularHours] = useState(10);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showMoreQuestions, setShowMoreQuestions] = useState(false);
  const [activities, setActivities] = useState<Array<{
    title: string;
    role: string;
    duration: string;
    hoursPerWeek: string;
  }>>([]);
  const [currentActivity, setCurrentActivity] = useState({
    title: "",
    role: "",
    duration: "",
    hoursPerWeek: "",
  });

  const majors = [
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Economics",
    "Psychology",
    "Political Science",
    "Mechanical Engineering",
    "Business Administration",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
  ];

  const popularUniversities = [
    "MIT",
    "Harvard University",
    "Stanford University",
    "Princeton University",
    "Yale University",
    "Columbia University",
    "University of Chicago",
    "University of Pennsylvania",
    "California Institute of Technology",
    "Duke University",
    "Northwestern University",
    "Johns Hopkins University",
    "Brown University",
    "Cornell University",
    "Rice University",
  ];

  const handleNext = () => {
    if (currentStep === 1 && selectedMajor) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedUniversities.length > 0) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    } else if (currentStep === 7) {
      // Submit or continue to results
      console.log("Form completed:", {
        major: selectedMajor,
        universities: selectedUniversities,
        satScore,
        gpaScale,
        gpaScore,
        currentGrade,
        extracurricularHours,
        activities: selectedActivities,
        detailedActivities: activities,
      });
      // You can navigate to results page or save data here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUniversitySelect = (university: string) => {
    if (selectedUniversities.length < 5 && !selectedUniversities.includes(university)) {
      setSelectedUniversities([...selectedUniversities, university]);
      setUniversityInput("");
    }
  };

  const handleUniversityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniversityInput(e.target.value);
  };

  const handleUniversityInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && universityInput.trim() && selectedUniversities.length < 5) {
      if (!selectedUniversities.includes(universityInput.trim())) {
        setSelectedUniversities([...selectedUniversities, universityInput.trim()]);
        setUniversityInput("");
      }
    }
  };

  const removeUniversity = (university: string) => {
    setSelectedUniversities(selectedUniversities.filter((u) => u !== university));
  };

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleAddActivity = () => {
    if (currentActivity.title && currentActivity.role && currentActivity.duration) {
      setActivities([...activities, { ...currentActivity }]);
      setCurrentActivity({
        title: "",
        role: "",
        duration: "",
        hoursPerWeek: "",
      });
    }
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-white">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 flex justify-between items-center relative z-10">
        <UniiqLogo href="/" size="lg" />
      </header>

      {/* Progress Indicator */}
      <div className="w-full flex justify-center px-4 sm:px-6 py-4 relative z-10 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step <= currentStep
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 7 && (
                <div
                  className={`h-0.5 ${
                    step < currentStep ? "bg-gray-900" : step === currentStep ? "bg-gray-300" : "bg-gray-200"
                  }`}
                  style={{
                    width: 'clamp(40px, 8vw, 120px)',
                    minWidth: '40px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Step 1: Major Selection */}
          {currentStep === 1 && (
            <>
              {/* Question - Separate Section at Top */}
              <div className="w-full absolute top-20 left-0 right-0">
                <h1
                  className="font-bold text-gray-900 text-center px-2 mx-auto"
                  style={{
                    width: '938px',
                    maxWidth: '100%',
                    height: '39px',
                    fontFamily: "var(--font-plus-jakarta-sans)",
                    fontWeight: 700,
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    marginTop: '0',
                    marginBottom: '0',
                  }}
                >
                  What do you want to study?
                </h1>
              </div>

              {/* Form Section - Centered Vertically */}
              <div className="w-full flex flex-col items-center justify-center">
                {/* Dropdown Container */}
                <div className="mb-8 w-full">
                  {/* Label - positioned above dropdown */}
                  <p 
                    className="mb-2.5 text-center"
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '142%',
                      letterSpacing: '4%',
                      verticalAlign: 'middle',
                      textTransform: 'uppercase',
                      color: '#4B5563',
                      marginBottom: '10px',
                    }}
                  >
                    SELECT YOUR INTENDED MAJOR FROM THE LIST BELOW.
                  </p>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                >
                  <option value="">--Select--</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>
              </div>

              {/* Next Button - Bottom Right */}
              <div className="absolute bottom-8 right-8">
                <button
                  onClick={handleNext}
                  disabled={!selectedMajor}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 2: University Selection */}
          {currentStep === 2 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                Which universities are you interested in applying to?
              </h1>

              {/* Label */}
              <p className="text-sm text-gray-600 mb-6 text-center">
                TYPE THE NAME OF THE UNIVERSITY OR SELECT FROM OUR DROPDOWN LIST OF POPULAR SCHOOLS (SELECT UP TO 5).
              </p>

              {/* Input/Dropdown */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={universityInput}
                    onChange={handleUniversityInputChange}
                    onKeyPress={handleUniversityInputKeyPress}
                    placeholder="--Select--"
                    className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    list="universities-list"
                  />
                  <datalist id="universities-list">
                    {popularUniversities.map((university) => (
                      <option key={university} value={university} />
                    ))}
                  </datalist>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Selected Universities Tags */}
                {selectedUniversities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedUniversities.map((university) => (
                      <span
                        key={university}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {university}
                        <button
                          onClick={() => removeUniversity(university)}
                          className="text-gray-500 hover:text-gray-700"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Popular Universities Quick Select */}
                {selectedUniversities.length < 5 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Popular Schools:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularUniversities
                        .filter((u) => !selectedUniversities.includes(u))
                        .slice(0, 8)
                        .map((university) => (
                          <button
                            key={university}
                            onClick={() => handleUniversitySelect(university)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {university}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedUniversities.length === 0}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 3: SAT Score */}
          {currentStep === 3 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                What is your SAT score?
              </h1>

              {/* Label */}
              <p className="text-sm text-gray-600 mb-6 text-center">
                ENTER YOUR MOST RECENT TOTAL SAT SCORE OUT OF 1600 (OPTIONAL IF NOT TAKEN YET).
              </p>

              {/* Input Field */}
              <div className="mb-8">
                <input
                  type="text"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  placeholder="Type"
                  className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 4: GPA */}
          {currentStep === 4 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                What is your cumulative GPA?
              </h1>

              {/* Label */}
              <p className="text-sm text-gray-600 mb-6 text-center">
                CHOOSE THE GPA SCALE USED AND ENTER YOUR SCORE:
              </p>

              {/* Input Fields - Side by Side */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GPA Scale Dropdown */}
                <div>
                  <select
                    value={gpaScale}
                    onChange={(e) => setGpaScale(e.target.value)}
                    className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                  >
                    <option value="">--Select--</option>
                    <option value="4.0">4.0 Scale</option>
                    <option value="5.0">5.0 Scale</option>
                    <option value="100">100 Point Scale</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                {/* GPA Score Input */}
                <div>
                  <input
                    type="text"
                    value={gpaScore}
                    onChange={(e) => setGpaScore(e.target.value)}
                    placeholder="Enter Your Score"
                    className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 5: Current Grade */}
          {currentStep === 5 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                What is your current grade or class level?
              </h1>

              {/* Dropdown */}
              <div className="mb-8">
                <select
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                  className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                >
                  <option value="">--Select--</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="High School Graduate">High School Graduate</option>
                  <option value="College Freshman">College Freshman</option>
                  <option value="College Sophomore">College Sophomore</option>
                  <option value="College Junior">College Junior</option>
                  <option value="College Senior">College Senior</option>
                </select>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentGrade}
                  className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 6: Extracurricular Hours */}
          {currentStep === 6 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                On average, how many hours per week do you spend on extracurricular activities?
              </h1>

              {/* Slider */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="5"
                    value={extracurricularHours}
                    onChange={(e) => setExtracurricularHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(extracurricularHours / 40) * 100}%, #e5e7eb ${(extracurricularHours / 40) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ef4444;
                      cursor: pointer;
                      border: 2px solid #ffffff;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .slider::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ef4444;
                      cursor: pointer;
                      border: 2px solid #ffffff;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                  `}</style>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40+</span>
                </div>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {extracurricularHours} hours/week
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Next
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
              </div>
            </>
          )}

          {/* Step 7: Extracurricular Activities */}
          {currentStep === 7 && (
            <>
              {/* Question */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center px-2"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans)",
                  fontWeight: 700,
                }}
              >
                Which types of extracurricular activities have you participated in?
              </h1>

              {/* Label */}
              <p className="text-sm text-gray-600 mb-6 text-center">
                SELECT ALL THAT APPLY:
              </p>

              {/* Activity Options - Styled as Cards/Buttons */}
              <div className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    "Sports",
                    "Music",
                    "Theater/Drama",
                    "Debate",
                    "Student Government",
                    "Volunteer Work",
                    "Research",
                    "Clubs",
                    "Community Service",
                    "Internships",
                    "Competitions",
                    "Leadership Roles",
                  ].map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedActivities.includes(activity)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>

                {/* Selected Activities Count */}
                {selectedActivities.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      {selectedActivities.length} {selectedActivities.length === 1 ? "activity" : "activities"} selected
                    </p>
                  </div>
                )}
              </div>

              {/* Optional Information Section */}
              {!showMoreQuestions && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-700 flex-1">
                      To improve your chances of an accurate SmartAdmit score, you can optionally answer a few short questions about your activities.
                    </p>
                    <button
                      onClick={() => setShowMoreQuestions(true)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      Answer now
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
              )}

              {/* More Questions Section */}
              {showMoreQuestions && (
                <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">More Questions</h2>
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">N</span>
                    </div>
                  </div>

                  {/* Activity Form */}
                  <div className="space-y-4 mb-6">
                    {/* Activity Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Title:
                      </label>
                      <input
                        type="text"
                        value={currentActivity.title}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
                        placeholder="Text"
                        className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Your Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Role:
                      </label>
                      <select
                        value={currentActivity.role}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, role: e.target.value })}
                        className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="President">President</option>
                        <option value="Vice President">Vice President</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Treasurer">Treasurer</option>
                        <option value="Member">Member</option>
                        <option value="Captain">Captain</option>
                        <option value="Co-Captain">Co-Captain</option>
                        <option value="Leader">Leader</option>
                        <option value="Participant">Participant</option>
                        <option value="Volunteer">Volunteer</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration:
                      </label>
                      <select
                        value={currentActivity.duration}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })}
                        className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4+ years">4+ years</option>
                      </select>
                    </div>

                    {/* Hours per Week */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours per Week (optional):
                      </label>
                      <select
                        value={currentActivity.hoursPerWeek}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, hoursPerWeek: e.target.value })}
                        className="w-full h-[50px] rounded border border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="1-5 hours">1-5 hours</option>
                        <option value="6-10 hours">6-10 hours</option>
                        <option value="11-15 hours">11-15 hours</option>
                        <option value="16-20 hours">16-20 hours</option>
                        <option value="20+ hours">20+ hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Activity Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add more activities</h3>
                    <button
                      onClick={handleAddActivity}
                      disabled={!currentActivity.title || !currentActivity.role || !currentActivity.duration}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  </div>

                  {/* Added Activities List */}
                  {activities.length > 0 && (
                    <div className="space-y-3">
                      {activities.map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Role: {activity.role}</p>
                              <p>Duration: {activity.duration}</p>
                              {activity.hoursPerWeek && <p>Hours/Week: {activity.hoursPerWeek}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => removeActivity(index)}
                            className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-900"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
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
              </div>
            </>
          )}
        </div>
      </main>

      {/* Fixed Graphic at Bottom - Same as preferences */}
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

