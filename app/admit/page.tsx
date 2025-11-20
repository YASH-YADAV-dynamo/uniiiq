"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UniiqLogo from "@/components/ui/UniiqLogo";
import { supabase } from "@/lib/supabase/client";

export default function AdmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [universityInput, setUniversityInput] = useState("");
  const [satScore, setSatScore] = useState("");
  const [gpaScale, setGpaScale] = useState("");
  const [gpaScore, setGpaScore] = useState("");
  const [currentGrade, setCurrentGrade] = useState("");
  const [extracurricularHours, setExtracurricularHours] = useState(10);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState("");
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
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Chicago",
    "University of Pennsylvania",
    "California Institute of Technology",
    "Johns Hopkins University",
    "Northwestern University",
    "Duke University",
    "Dartmouth College",
    "Brown University",
    "Vanderbilt University",
    "Rice University",
  ];

  const handleNext = async () => {
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
      // Save data to database
      await handleSaveData();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUniversitySelect = (university: string) => {
    if (university && selectedUniversities.length < 5 && !selectedUniversities.includes(university)) {
      setSelectedUniversities([...selectedUniversities, university]);
      setUniversityInput("");
    }
  };

  const handleUniversityInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      handleUniversitySelect(selectedValue);
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

  const handleActivityInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && activityInput.trim() && !selectedActivities.includes(activityInput.trim())) {
      setSelectedActivities([...selectedActivities, activityInput.trim()]);
      setActivityInput("");
    }
  };

  const removeActivity = (activity: string) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
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

  const removeActivityFromList = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const formData = {
        major: selectedMajor,
        universities: selectedUniversities,
        satScore,
        gpaScale,
        gpaScore,
        currentGrade,
        extracurricularHours,
        activities: selectedActivities,
        detailedActivities: activities,
      };

      const response = await fetch("/api/smartadmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save data");
      }

      const result = await response.json();
      if (result.success) {
        console.log("Data saved successfully:", result.data);
        // Navigate to results or success page
        router.push("/admitscore");
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      alert("Failed to save data: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                  step <= currentStep
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                style={{
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                {step}
              </div>
              {step < 7 && (
                <div
                  className={`h-0.5 transition-all duration-300 ${
                    step < currentStep ? "bg-gray-900" : step === currentStep ? "bg-gray-300" : "bg-gray-200"
                  }`}
                  style={{
                    width: 'clamp(40px, 8vw, 120px)',
                    minWidth: '40px',
                    marginLeft: '-1px',
                    marginRight: '-1px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 relative z-10" style={{ justifyContent: 'flex-start', paddingTop: '15vh' }}>
        <div className="w-full max-w-2xl">
          {/* Step 1: Major Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 
                className="text-black text-center"
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: '30px',
                  lineHeight: '130%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                }}
              >
                What do you want to study?
              </h2>
              <div className="mt-12">
                <p className="text-sm text-black text-left">SELECT YOUR INTENDED MAJOR FROM THE LIST BELOW.</p>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black mt-2"
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
          )}

          {/* Step 2: Universities */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 
                className="text-black text-center"
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: '30px',
                  lineHeight: '130%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                }}
              >
                Which universities are you interested in?
              </h2>
              <p className="text-sm text-black text-left mt-8">
                SELECT UP TO 5 UNIVERSITIES FROM THE LIST BELOW.
              </p>
              <select
                value={universityInput}
                onChange={handleUniversityInputChange}
                disabled={selectedUniversities.length >= 5}
                className="w-full p-3 border border-gray-300 rounded-lg text-black mt-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedUniversities.length >= 5 ? "Maximum 5 universities selected" : "--Select--"}
                </option>
                {popularUniversities
                  .filter((u) => !selectedUniversities.includes(u))
                  .map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
              </select>
              {selectedUniversities.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-black mb-3">
                    Selected ({selectedUniversities.length}/5):
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedUniversities.map((uni) => (
                      <div
                        key={uni}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg shadow-sm"
                      >
                        <span className="text-sm font-medium">{uni}</span>
                        <button
                          onClick={() => removeUniversity(uni)}
                          className="text-white hover:text-gray-300 transition-colors ml-1"
                          type="button"
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: SAT Score */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">What's your SAT score?</h2>
              <input
                type="number"
                value={satScore}
                onChange={(e) => setSatScore(e.target.value)}
                placeholder="Enter your SAT score (400-1600)"
                min="400"
                max="1600"
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>
          )}

          {/* Step 4: GPA */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">What's your GPA?</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">GPA Scale</label>
                  <select
                    value={gpaScale}
                    onChange={(e) => setGpaScale(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  >
                    <option value="">Select scale</option>
                    <option value="4.0">4.0 Scale</option>
                    <option value="100">100 Scale</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">GPA Score</label>
                  <input
                    type="text"
                    value={gpaScore}
                    onChange={(e) => setGpaScore(e.target.value)}
                    placeholder="Enter your GPA"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Current Grade */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">What's your current grade?</h2>
              <select
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              >
                <option value="">Select grade</option>
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          )}

          {/* Step 6: Extracurricular Hours */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">How many hours per week do you spend on extracurriculars?</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={extracurricularHours}
                  onChange={(e) => setExtracurricularHours(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-lg font-semibold text-black">{extracurricularHours} hours/week</div>
              </div>
            </div>
          )}

          {/* Step 7: Activities */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Tell us about your activities</h2>
              
              {/* Simple Activities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Select activities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Sports", "Music", "Drama", "Debate", "Student Council", "Volunteer Work", "Research", "Internship", "Part-time Job"].map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`p-3 rounded-lg border-2 text-sm text-black ${
                        selectedActivities.includes(activity)
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Activities */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-black">Add detailed activity (optional)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Activity title"
                    value={currentActivity.title}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  />
                  <input
                    type="text"
                    placeholder="Your role"
                    value={currentActivity.role}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, role: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 years)"
                    value={currentActivity.duration}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  />
                  <input
                    type="text"
                    placeholder="Hours per week"
                    value={currentActivity.hoursPerWeek}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, hoursPerWeek: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  />
                  <button
                    onClick={handleAddActivity}
                    className="w-full p-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  >
                    Add Activity
                  </button>
                </div>
                
                {activities.length > 0 && (
                  <div className="space-y-2">
                    {activities.map((activity, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                        <div>
                          <div className="font-medium text-black">{activity.title}</div>
                          <div className="text-sm text-black">{activity.role} • {activity.duration}</div>
                        </div>
                        <button
                          onClick={() => removeActivityFromList(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg text-white ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {isSaving ? "Saving..." : currentStep === 7 ? "Submit & View Score" : "Next"}
            </button>
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
