"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UniiqLogo from "@/components/ui/UniiqLogo";

export default function PreferencesPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["personal"]));
  const [personalFormData, setPersonalFormData] = useState({
    fullName: "John",
    age: "18 years",
    currentGrade: "",
    schoolName: "Doo",
    citizenship: "Text",
  });
  const [academicFormData, setAcademicFormData] = useState({
    boardOfEducation: "",
    subjectsTaken: "",
    gradeSubject: "",
    gradeScore: "",
    awards: "",
    satScore: "",
    satDate: "",
    actScore: "",
    actDate: "",
    apName: "",
    apScore: "",
    apDate: "",
    psatScore: "",
    psatDate: "",
    toeflIeltsScore: "",
    toeflIeltsDate: "",
  });
  const [goalsFormData, setGoalsFormData] = useState({
    hoursPerWeek: 2.5,
    goalsDefined: "",
    universitiesToTarget: "",
    intendedMajor: "",
    areaOfInterest: "",
    preferredCountry: "",
    preferredLocationType: "",
  });
  const [budgetFormData, setBudgetFormData] = useState({
    estimatedAnnualBudget: "",
    expectedTuitionFeeRange: "",
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (section: string) => {
    return expandedSections.has(section);
  };

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcademicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAcademicFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoalsFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalsFormData((prev) => ({ ...prev, hoursPerWeek: parseFloat(e.target.value) }));
  };

  const handleGoalsDefinedChange = (value: string) => {
    setGoalsFormData((prev) => ({ ...prev, goalsDefined: value }));
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBudgetFormData((prev) => ({ ...prev, [name]: value }));
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
            
            {/* Personal Info Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("personal")}
              >
                <div className="flex items-center gap-3">
                  <div className={`border-l-4 ${isSectionExpanded("personal") ? "border-yellow-500" : "border-transparent"} pl-3 flex items-center gap-3`}>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        className={`w-6 h-6 ${isSectionExpanded("personal") ? "text-yellow-500" : "text-gray-400"}`}
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
                </div>
                <div className="flex items-center gap-2">
                  {!isSectionExpanded("personal") && personalFormData.fullName && (
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {isSectionExpanded("personal") && (
                    <svg
                      className="w-5 h-5 text-gray-400 transition-transform rotate-180"
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
                  )}
                </div>
              </div>
              
              {/* Personal Info Form - Expanded */}
              {isSectionExpanded("personal") && (
                <div className="p-6 pt-0">
                  <div className="mb-6"></div>

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
                          value={personalFormData.fullName}
                          onChange={handlePersonalInputChange}
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
                          value={personalFormData.currentGrade}
                          onChange={handlePersonalInputChange}
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
                          value={personalFormData.schoolName}
                          onChange={handlePersonalInputChange}
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
                          value={personalFormData.age}
                          onChange={handlePersonalInputChange}
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
                          value={personalFormData.citizenship}
                          onChange={handlePersonalInputChange}
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
                </div>
              )}
            </div>

            {/* Academic Preferences Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("academic")}
              >
                <div className="flex items-center gap-3">
                  <div className={`border-l-4 ${isSectionExpanded("academic") ? "border-[#FCD34D]" : "border-transparent"} pl-3 flex items-center gap-3`}>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        className={`w-6 h-6 ${isSectionExpanded("academic") ? "text-[#FCD34D]" : "text-gray-400"}`}
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
                    <h2
                      className="text-lg font-bold text-gray-900"
                      style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        fontWeight: 700,
                      }}
                    >
                      Academic Preferences
                    </h2>
                  </div>
                </div>
                {isSectionExpanded("academic") && (
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform rotate-180"
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
                )}
              </div>

              {/* Academic Preferences Form - Expanded */}
              {isSectionExpanded("academic") && (
                <div className="p-6 pt-0">
                  <div className="mb-6"></div>
                  
                  {/* Form Fields */}
                  <div className="space-y-4 mb-6">
                    {/* Board of Education */}
                    <div>
                      <label
                        htmlFor="boardOfEducation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Board of Education<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="boardOfEducation"
                        name="boardOfEducation"
                        value={academicFormData.boardOfEducation}
                        onChange={handleAcademicInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB</option>
                      </select>
                    </div>

                    {/* Subjects Taken */}
                    <div>
                      <label
                        htmlFor="subjectsTaken"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subjects Taken<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subjectsTaken"
                        name="subjectsTaken"
                        value={academicFormData.subjectsTaken}
                        onChange={handleAcademicInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                      </select>
                    </div>

                    {/* Grades */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grades<span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 w-full sm:w-auto">
                          <select
                            id="gradeSubject"
                            name="gradeSubject"
                            value={academicFormData.gradeSubject}
                            onChange={handleAcademicInputChange}
                            className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                          >
                            <option value="">--Select Subject--</option>
                            <option value="Math">Math</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                          </select>
                        </div>
                        <div className="flex-1 w-full sm:w-auto">
                          <input
                            type="text"
                            id="gradeScore"
                            name="gradeScore"
                            placeholder="Enter Score"
                            value={academicFormData.gradeScore}
                            onChange={handleAcademicInputChange}
                            className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <Link
                          href="#"
                          className="text-blue-600 text-sm underline whitespace-nowrap hover:text-blue-700 w-full sm:w-auto text-center sm:text-left"
                        >
                          Or Upload marksheet
                        </Link>
                      </div>
                    </div>

                    {/* Awards */}
                    <div>
                      <label
                        htmlFor="awards"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Awards<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="awards"
                        name="awards"
                        value={academicFormData.awards}
                        onChange={handleAcademicInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Academic Excellence">Academic Excellence</option>
                        <option value="Sports">Sports</option>
                        <option value="Arts">Arts</option>
                      </select>
                    </div>

                    {/* Standardized Tests Taken */}
                    <div className="mt-6 rounded-lg p-6" style={{ backgroundColor: '#E4E4E466' }}>
                      <h3 className="text-base font-bold text-gray-900 mb-4">
                        Standardized Tests Taken:
                      </h3>
                      
                      <div className="space-y-4">
                        {/* SAT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              SAT<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="satScore"
                              placeholder="Enter Score"
                              value={academicFormData.satScore}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              name="satDate"
                              placeholder="dd/mm/yyyy"
                              value={academicFormData.satDate}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* ACT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ACT<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="actScore"
                              placeholder="Enter Score"
                              value={academicFormData.actScore}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              name="actDate"
                              placeholder="dd/mm/yyyy"
                              value={academicFormData.actDate}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* AP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              AP<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="apName"
                              placeholder="Name"
                              value={academicFormData.apName}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter Score
                            </label>
                            <input
                              type="text"
                              name="apScore"
                              placeholder="Enter Score"
                              value={academicFormData.apScore}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              name="apDate"
                              placeholder="dd/mm/yyyy"
                              value={academicFormData.apDate}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* PSAT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PSAT<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="psatScore"
                              placeholder="Enter Score"
                              value={academicFormData.psatScore}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              name="psatDate"
                              placeholder="dd/mm/yyyy"
                              value={academicFormData.psatDate}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* TOEFL/IELTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              TOEFL/IELTS<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="toeflIeltsScore"
                              placeholder="Enter Score"
                              value={academicFormData.toeflIeltsScore}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              name="toeflIeltsDate"
                              placeholder="dd/mm/yyyy"
                              value={academicFormData.toeflIeltsDate}
                              onChange={handleAcademicInputChange}
                              className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Goals Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("goals")}
              >
                <div className="flex items-center gap-3">
                  <div className={`border-l-4 ${isSectionExpanded("goals") ? "border-[#FED7AA]" : "border-transparent"} pl-3 flex items-center gap-3`}>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        className={`w-6 h-6 ${isSectionExpanded("goals") ? "text-[#FED7AA]" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="6" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="2" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h2
                      className="text-lg font-bold text-gray-900"
                      style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        fontWeight: 700,
                      }}
                    >
                      Goals
                    </h2>
                  </div>
                </div>
                {isSectionExpanded("goals") && (
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform rotate-180"
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
                )}
              </div>
              
              {/* Goals Form - Expanded */}
              {isSectionExpanded("goals") && (
                <div className="p-6 pt-0">
                  <div className="mb-6"></div>
                  
                  {/* Question 1: Hours per week */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-4">
                      How many hours per week can you realistically dedicate to new opportunities or prep?
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={goalsFormData.hoursPerWeek}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #f8b4b4 0%, #f8b4b4 ${(goalsFormData.hoursPerWeek / 10) * 100}%, #e5e7eb ${(goalsFormData.hoursPerWeek / 10) * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                      <style jsx>{`
                        .slider::-webkit-slider-thumb {
                          appearance: none;
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #f8b4b4;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        }
                        .slider::-moz-range-thumb {
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #f8b4b4;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        }
                      `}</style>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0</span>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                      <span>7</span>
                      <span>8</span>
                      <span>9</span>
                      <span>10+</span>
                    </div>
                  </div>

                  {/* Question 2: Goals defined */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-4">
                      Are your goals defined?
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleGoalsDefinedChange("yes")}
                        className={`px-6 py-2.5 rounded border text-sm font-medium transition-colors ${
                          goalsFormData.goalsDefined === "yes"
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-green-50 border-green-300 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGoalsDefinedChange("no")}
                        className={`px-6 py-2.5 rounded border text-sm font-medium transition-colors ${
                          goalsFormData.goalsDefined === "no"
                            ? "bg-red-100 border-red-500 text-red-700"
                            : "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        No, Still Exploring
                      </button>
                    </div>
                  </div>

                  {/* Additional Dropdown Fields */}
                  <div className="space-y-4 mb-6">
                    {/* Universities to Target */}
                    <div>
                      <label
                        htmlFor="universitiesToTarget"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Universities to Target:
                      </label>
                      <select
                        id="universitiesToTarget"
                        name="universitiesToTarget"
                        value={goalsFormData.universitiesToTarget}
                        onChange={handleGoalsInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="MIT">MIT</option>
                        <option value="Harvard">Harvard</option>
                        <option value="Stanford">Stanford</option>
                        <option value="Princeton">Princeton</option>
                      </select>
                    </div>

                    {/* Intended Major/Programme */}
                    <div>
                      <label
                        htmlFor="intendedMajor"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Intended Major/Programme:
                      </label>
                      <select
                        id="intendedMajor"
                        name="intendedMajor"
                        value={goalsFormData.intendedMajor}
                        onChange={handleGoalsInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Medicine">Medicine</option>
                      </select>
                    </div>

                    {/* Area of Interest within subject */}
                    <div>
                      <label
                        htmlFor="areaOfInterest"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Area of Interest within subject:
                      </label>
                      <select
                        id="areaOfInterest"
                        name="areaOfInterest"
                        value={goalsFormData.areaOfInterest}
                        onChange={handleGoalsInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>

                    {/* Preferred Country for Study */}
                    <div>
                      <label
                        htmlFor="preferredCountry"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Preferred Country for Study:
                      </label>
                      <select
                        id="preferredCountry"
                        name="preferredCountry"
                        value={goalsFormData.preferredCountry}
                        onChange={handleGoalsInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>

                    {/* Preferred Location Type */}
                    <div>
                      <label
                        htmlFor="preferredLocationType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Preferred Location Type:
                      </label>
                      <select
                        id="preferredLocationType"
                        name="preferredLocationType"
                        value={goalsFormData.preferredLocationType}
                        onChange={handleGoalsInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Urban">Urban</option>
                        <option value="Suburban">Suburban</option>
                        <option value="Rural">Rural</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleSection("academic")}
                      className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-900 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSection("budget")}
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
              )}
            </div>

            {/* Budget Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("budget")}
              >
                <div className="flex items-center gap-3">
                  <div className={`border-l-4 ${isSectionExpanded("budget") ? "border-[#BFDBFE]" : "border-transparent"} pl-3 flex items-center gap-3`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded ${isSectionExpanded("budget") ? "bg-[#BFDBFE]" : "bg-gray-100"}`}>
                      <svg
                        className={`w-5 h-5 ${isSectionExpanded("budget") ? "text-[#3B82F6]" : "text-gray-400"}`}
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
                    <h2
                      className="text-lg font-bold text-gray-900"
                      style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        fontWeight: 700,
                      }}
                    >
                      Budget
                    </h2>
                  </div>
                </div>
                {isSectionExpanded("budget") && (
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform rotate-180"
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
                )}
              </div>
              
              {/* Budget Form - Expanded */}
              {isSectionExpanded("budget") && (
                <div className="p-6 pt-0">
                  <div className="mb-6"></div>
                  
                  {/* Budget Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Estimated Annual Budget */}
                    <div>
                      <label
                        htmlFor="estimatedAnnualBudget"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        What is your estimated annual budget for opportunities?
                      </label>
                      <select
                        id="estimatedAnnualBudget"
                        name="estimatedAnnualBudget"
                        value={budgetFormData.estimatedAnnualBudget}
                        onChange={handleBudgetInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Under $5,000">Under $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="Over $50,000">Over $50,000</option>
                      </select>
                      <div className="flex items-center gap-1.5 mt-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 16v-4m0 0V8m0 4h.01"
                          />
                        </svg>
                        <span className="text-xs text-gray-500">
                          Programs, Tests, College apps, etc.
                        </span>
                      </div>
                    </div>

                    {/* Expected Tuition/Fee Range */}
                    <div>
                      <label
                        htmlFor="expectedTuitionFeeRange"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Expected Tuition/Fee Range per Year:
                      </label>
                      <select
                        id="expectedTuitionFeeRange"
                        name="expectedTuitionFeeRange"
                        value={budgetFormData.expectedTuitionFeeRange}
                        onChange={handleBudgetInputChange}
                        className="w-full h-[40px] rounded border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22><polyline points=%226,9 12,15 18,9%22></polyline></svg>')] bg-no-repeat bg-right pr-10"
                      >
                        <option value="">--Select--</option>
                        <option value="Under $20,000">Under $20,000</option>
                        <option value="$20,000 - $40,000">$20,000 - $40,000</option>
                        <option value="$40,000 - $60,000">$40,000 - $60,000</option>
                        <option value="$60,000 - $80,000">$60,000 - $80,000</option>
                        <option value="Over $80,000">Over $80,000</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleSection("goals")}
                      className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-900 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
                    >
                      Save
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

