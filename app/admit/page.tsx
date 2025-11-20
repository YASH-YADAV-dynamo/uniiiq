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
  const [satError, setSatError] = useState("");
  const [gpaError, setGpaError] = useState("");
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
  const [showDetailedActivities, setShowDetailedActivities] = useState(false);
  const [activityForms, setActivityForms] = useState<Array<{
    title: string;
    role: string;
    duration: string;
    hoursPerWeek: string;
  }>>([{ title: "", role: "", duration: "", hoursPerWeek: "" }]);

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
    // Validation for each step
    if (currentStep === 1 && selectedMajor) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedUniversities.length > 0) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate SAT score
      if (satScore === "") {
        alert("Please enter your SAT score");
        return;
      }
      const satNum = parseInt(satScore);
      if (isNaN(satNum) || satNum < 400 || satNum > 1600) {
        alert("SAT score must be between 400 and 1600");
        return;
      }
      if (satError) {
        alert("Please fix the SAT score error before proceeding");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Validate GPA
      if (!gpaScale) {
        alert("Please select a GPA scale");
        return;
      }
      if (gpaScore === "") {
        alert("Please enter your GPA score");
        return;
      }
      const gpaNum = parseFloat(gpaScore);
      if (isNaN(gpaNum)) {
        alert("Please enter a valid GPA number");
        return;
      }
      if (gpaScale === "4.0" && (gpaNum < 0 || gpaNum > 4.0)) {
        alert("GPA must be between 0.0 and 4.0 for 4.0 scale");
        return;
      }
      if (gpaScale === "100" && (gpaNum < 0 || gpaNum > 100)) {
        alert("GPA must be between 0 and 100 for 100 scale");
        return;
      }
      if (gpaError) {
        alert("Please fix the GPA error before proceeding");
        return;
      }
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

  const handleActivitySelect = (activity: string) => {
    if (activity && !selectedActivities.includes(activity)) {
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

  const handleActivityFormChange = (index: number, field: string, value: string) => {
    const updatedForms = [...activityForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setActivityForms(updatedForms);
  };

  const handleAddMoreActivity = () => {
    setActivityForms([...activityForms, { title: "", role: "", duration: "", hoursPerWeek: "" }]);
  };

  const handleRemoveActivityForm = (index: number) => {
    if (activityForms.length > 1) {
      setActivityForms(activityForms.filter((_, i) => i !== index));
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
        detailedActivities: showDetailedActivities ? activityForms.filter(f => f.title || f.role || f.duration) : activities,
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
              <div>
                <input
                  type="number"
                  value={satScore}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSatScore(value);
                    // Validate SAT score (400-1600)
                    if (value === "") {
                      setSatError("");
                    } else {
                      const numValue = parseInt(value);
                      if (isNaN(numValue) || numValue < 400 || numValue > 1600) {
                        setSatError("SAT score must be between 400 and 1600");
                      } else {
                        setSatError("");
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== "") {
                      const numValue = parseInt(value);
                      if (numValue < 400) {
                        setSatScore("400");
                        setSatError("");
                      } else if (numValue > 1600) {
                        setSatScore("1600");
                        setSatError("");
                      }
                    }
                  }}
                  placeholder="Enter your SAT score (400-1600)"
                  min="400"
                  max="1600"
                  className={`w-full p-3 border rounded-lg text-black ${
                    satError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {satError && (
                  <p className="mt-2 text-sm text-red-600">{satError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">Valid range: 400 - 1600</p>
              </div>
            </div>
          )}

          {/* Step 4: GPA */}
          {currentStep === 4 && (
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
                What is your cumulative GPA?
              </h2>
              <div className="mt-8">
                <p className="text-sm text-black text-left mb-4">CHOOSE THE GPA SCALE USED AND ENTER YOUR SCORE:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <select
                      value={gpaScale}
                      onChange={(e) => {
                        setGpaScale(e.target.value);
                        setGpaScore(""); // Clear GPA score when scale changes
                        setGpaError(""); // Clear error
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg text-black"
                    >
                      <option value="">--Select--</option>
                      <option value="4.0">4.0 Scale</option>
                      <option value="100">100 Scale</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step={gpaScale === "4.0" ? "0.01" : "0.1"}
                      value={gpaScore}
                      onChange={(e) => {
                        const value = e.target.value;
                        setGpaScore(value);
                        
                        // Validate GPA based on selected scale
                        if (value === "") {
                          setGpaError("");
                        } else if (!gpaScale) {
                          setGpaError("Please select a GPA scale first");
                        } else {
                          const numValue = parseFloat(value);
                          if (isNaN(numValue)) {
                            setGpaError("Please enter a valid number");
                          } else if (gpaScale === "4.0") {
                            if (numValue < 0 || numValue > 4.0) {
                              setGpaError("GPA must be between 0.0 and 4.0 for 4.0 scale");
                            } else {
                              setGpaError("");
                            }
                          } else if (gpaScale === "100") {
                            if (numValue < 0 || numValue > 100) {
                              setGpaError("GPA must be between 0 and 100 for 100 scale");
                            } else {
                              setGpaError("");
                            }
                          } else if (gpaScale === "Other") {
                            // For "Other" scale, allow any positive number but warn
                            if (numValue < 0) {
                              setGpaError("GPA cannot be negative");
                            } else {
                              setGpaError("");
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== "" && gpaScale) {
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue)) {
                            if (gpaScale === "4.0") {
                              if (numValue < 0) {
                                setGpaScore("0");
                                setGpaError("");
                              } else if (numValue > 4.0) {
                                setGpaScore("4.0");
                                setGpaError("");
                              }
                            } else if (gpaScale === "100") {
                              if (numValue < 0) {
                                setGpaScore("0");
                                setGpaError("");
                              } else if (numValue > 100) {
                                setGpaScore("100");
                                setGpaError("");
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Enter Your Score"
                      disabled={!gpaScale}
                      className={`w-full p-3 border rounded-lg text-black ${
                        gpaError ? "border-red-500" : "border-gray-300"
                      } ${!gpaScale ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    />
                  </div>
                </div>
                {gpaError && (
                  <p className="mt-2 text-sm text-red-600">{gpaError}</p>
                )}
                {gpaScale && !gpaError && (
                  <p className="mt-2 text-xs text-gray-500">
                    {gpaScale === "4.0" 
                      ? "Valid range: 0.0 - 4.0" 
                      : gpaScale === "100" 
                      ? "Valid range: 0 - 100" 
                      : "Enter your GPA value"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Current Grade */}
          {currentStep === 5 && (
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
                What is your current grade or class level?
              </h2>
              <div className="mt-8">
                <select
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--Select--</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 6: Extracurricular Hours */}
          {currentStep === 6 && (
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
                On average, how many hours per week do you spend on extracurricular activities?
              </h2>
              <div className="space-y-4 mt-8">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={extracurricularHours}
                    onChange={(e) => setExtracurricularHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-step6"
                    style={{
                      background: `linear-gradient(to right, #E0BEBA 0%, #E0BEBA ${(extracurricularHours / 40) * 100}%, #e5e7eb ${(extracurricularHours / 40) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <style jsx>{`
                    .slider-step6::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #E0BEBA;
                      cursor: pointer;
                      border: 2px solid #ffffff;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .slider-step6::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #E0BEBA;
                      cursor: pointer;
                      border: 2px solid #ffffff;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                  `}</style>
                  {/* Number labels below slider */}
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-sm text-black">0</span>
                    <span className="text-sm text-black">5</span>
                    <span className="text-sm text-black">10</span>
                    <span className="text-sm text-black">15</span>
                    <span className="text-sm text-black">20</span>
                    <span className="text-sm text-black">25</span>
                    <span className="text-sm text-black">30</span>
                    <span className="text-sm text-black">35</span>
                    <span className="text-sm text-black">40+</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Activities */}
          {currentStep === 7 && !showDetailedActivities && (
            <div className="space-y-6">
              {/* First Screen: Main Question */}
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
                Which types of extracurricular activities have you participated in?
              </h2>
              
              <div className="mt-8">
                <p className="text-sm text-black text-left mb-4">SELECT ALL THAT APPLY:</p>
                <select
                  value=""
                  onChange={(e) => handleActivitySelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--Select--</option>
                  {["Sports", "Music", "Drama", "Debate", "Student Council", "Volunteer Work", "Research", "Internship", "Part-time Job"]
                    .filter(activity => !selectedActivities.includes(activity))
                    .map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                </select>
                
                {/* Display selected activities as chips */}
                {selectedActivities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedActivities.map((activity) => (
                      <div
                        key={activity}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg"
                      >
                        <span className="text-sm">{activity}</span>
                        <button
                          onClick={() => toggleActivity(activity)}
                          className="text-white hover:text-gray-300"
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
                )}
              </div>

              {/* Optional detailed activities section */}
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-black">
                    To improve your chances of an accurate SmartAdmit score, you can optionally answer a few short questions about your activities.
                  </p>
                  <button
                    onClick={() => setShowDetailedActivities(true)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 whitespace-nowrap flex items-center gap-1"
                  >
                    Answer now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: More Questions (shown after Answer now is clicked) */}
          {currentStep === 7 && showDetailedActivities && (
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
                More Questions
              </h2>
              
              <div className="mt-8 space-y-6 max-w-2xl mx-auto">
                {activityForms.map((form, formIndex) => (
                  <div key={formIndex} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Activity Title:</label>
                      <input
                        type="text"
                        placeholder="Text"
                        value={form.title}
                        onChange={(e) => handleActivityFormChange(formIndex, "title", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Your Role:</label>
                      <select
                        value={form.role}
                        onChange={(e) => handleActivityFormChange(formIndex, "role", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black"
                      >
                        <option value="">--Select--</option>
                        <option value="Leader">Leader</option>
                        <option value="Member">Member</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Participant">Participant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Duration:</label>
                      <select
                        value={form.duration}
                        onChange={(e) => handleActivityFormChange(formIndex, "duration", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black"
                      >
                        <option value="">--Select--</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4+ years">4+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Hours per Week (optional):</label>
                      <select
                        value={form.hoursPerWeek}
                        onChange={(e) => handleActivityFormChange(formIndex, "hoursPerWeek", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black"
                      >
                        <option value="">--Select--</option>
                        <option value="1-5 hours">1-5 hours</option>
                        <option value="6-10 hours">6-10 hours</option>
                        <option value="11-15 hours">11-15 hours</option>
                        <option value="16-20 hours">16-20 hours</option>
                        <option value="20+ hours">20+ hours</option>
                      </select>
                    </div>
                    {activityForms.length > 1 && (
                      <button
                        onClick={() => handleRemoveActivityForm(formIndex)}
                        className="text-sm text-red-600 hover:text-red-700"
                        type="button"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add more activities section */}
              <div className="mt-8 flex items-center justify-between max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-black">Add more activities</h3>
                <button
                  onClick={handleAddMoreActivity}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-6">
            <button
              onClick={() => {
                if (currentStep === 7 && showDetailedActivities) {
                  setShowDetailedActivities(false);
                } else {
                  handleBack();
                }
              }}
              disabled={currentStep === 1 && !showDetailedActivities}
              className={`flex items-center gap-1.5 ${
                (currentStep === 1 && !showDetailedActivities)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
              style={{
                width: '91px',
                height: '43px',
                borderRadius: '6px',
                paddingTop: '11px',
                paddingRight: '14px',
                paddingBottom: '11px',
                paddingLeft: '18px',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSaving}
              className={`flex items-center gap-1.5 text-white ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              style={{
                width: '91px',
                height: '43px',
                borderRadius: '6px',
                paddingTop: '11px',
                paddingRight: '14px',
                paddingBottom: '11px',
                paddingLeft: '18px',
              }}
            >
              {isSaving ? "Saving..." : currentStep === 7 ? "Submit" : "Next"}
              {!isSaving && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
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
