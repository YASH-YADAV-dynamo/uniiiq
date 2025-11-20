"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UniiqLogo from "@/components/ui/UniiqLogo";
import Image from "next/image";

interface CollegeData {
  id: number;
  name: string;
  state: string;
  city: string;
  location: string;
  acceptanceRate: string | null;
  averageSAT: number | null;
  averageACT: number | null;
  totalPopulation: number | null;
  inStateTuition: number | null;
  outOfStateTuition: number | null;
  internationalTuition: number | null;
  completionRate: string | null;
  medianEarnings: number | null;
  medianDebt: number | null;
  latitude: number | null;
  longitude: number | null;
  ownership: number | null;
  locale: number | null;
  imageUrl: string | null;
  aidPercentage: number | null;
  athleticAssociation: string | null;
  athleticDivision: string | null;
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const universityName = decodeURIComponent(params.name as string);
  const [loading, setLoading] = useState(true);
  const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCollegeData();
  }, [universityName]);

  const loadCollegeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/college?name=${encodeURIComponent(universityName)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setCollegeData(result.data);
      } else {
        setError(result.error || "Failed to load college data");
      }
    } catch (err: any) {
      console.error("Error loading college data:", err);
      setError("Failed to load college data");
    } finally {
      setLoading(false);
    }
  };

  const getOwnershipType = (ownership: number | null) => {
    switch (ownership) {
      case 1:
        return "Public";
      case 2:
        return "Private";
      case 3:
        return "Private For-Profit";
      default:
        return "N/A";
    }
  };

  const getLocaleType = (locale: number | null) => {
    if (!locale) return "N/A";
    if (locale >= 11 && locale <= 13) return "Urban";
    if (locale >= 21 && locale <= 23) return "Suburban";
    if (locale >= 31 && locale <= 33) return "Town";
    if (locale >= 41 && locale <= 43) return "Rural";
    return "N/A";
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (error || !collegeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || "University not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to University Finder</span>
          </button>
          <UniiqLogo href="/" size="lg" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* University Header - Image and Details Side by Side */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* University Image - Left Side */}
            <div className="w-full">
              {collegeData.imageUrl ? (
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={collegeData.imageUrl}
                    alt={collegeData.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-500 text-lg">University Image</span>
                </div>
              )}
            </div>

            {/* University Details - Right Side */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {collegeData.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{collegeData.name}</h1>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Competitive
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{collegeData.location || "Location not available"}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ml-4">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>Shortlist</span>
                </button>
              </div>

              {/* University Description */}
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {collegeData.name} is {collegeData.ownership === 2 ? "a private" : collegeData.ownership === 1 ? "a public" : "an"} institution located in {collegeData.location || "the United States"}. 
                  {collegeData.totalPopulation && ` With a student population of ${collegeData.totalPopulation.toLocaleString()}, `}
                  {collegeData.acceptanceRate && `the university has an acceptance rate of ${collegeData.acceptanceRate}. `}
                  {collegeData.completionRate && `The 4-year completion rate is ${collegeData.completionRate}. `}
                  {collegeData.medianEarnings && `Graduates earn a median salary of ${formatCurrency(collegeData.medianEarnings)} 10 years after entry.`}
                  The university offers a comprehensive range of academic programs and maintains high standards of excellence, providing students with opportunities for academic growth and professional development.
                </p>
              </div>
            </div>
          </div>

          {/* Key Statistics - Horizontal Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">ACCEPTANCE RATE</p>
              <p className="text-2xl font-bold text-gray-900">{collegeData.acceptanceRate || "N/A"}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">INT. ACCEPTANCE RATE</p>
              <p className="text-2xl font-bold text-gray-900">{collegeData.acceptanceRate || "N/A"}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">AVG AID OFFERED</p>
              <p className="text-2xl font-bold text-gray-900">{collegeData.aidPercentage ? `${collegeData.aidPercentage}%` : "N/A"}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">TOTAL POPULATION</p>
              <p className="text-2xl font-bold text-gray-900">{collegeData.totalPopulation?.toLocaleString() || "N/A"}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">INT. POPULATION</p>
              <p className="text-2xl font-bold text-gray-900">{collegeData.totalPopulation?.toLocaleString() || "N/A"}</p>
            </div>
          </div>

          {/* Know your University Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Know your University</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Type of University</p>
                <p className="text-gray-900 font-medium">{getOwnershipType(collegeData.ownership)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Campus type</p>
                <p className="text-gray-900 font-medium">{getLocaleType(collegeData.locale)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Housing options</p>
                <p className="text-gray-900 font-medium">On-campus & Off-Campus</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Undergraduate enrollment (per year)</p>
                <p className="text-gray-900 font-medium">{collegeData.totalPopulation?.toLocaleString() || "N/A"}</p>
              </div>
              {collegeData.acceptanceRate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Acceptance rate by discipline</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(parseFloat(collegeData.acceptanceRate), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{collegeData.acceptanceRate}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Academics & Requirements */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M12 14l-9-5M12 14l9-5M12 9V4" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Academics & Requirements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average SAT</p>
                <p className="text-gray-900 font-medium text-lg">{collegeData.averageSAT || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Average ACT</p>
                <p className="text-gray-900 font-medium text-lg">{collegeData.averageACT || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-3">Popular majors/programs offered</p>
              <p className="text-gray-600 text-sm">Program information and admission requirements are available through the university's official website.</p>
            </div>
          </div>

          {/* Finances */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Finances</h2>
            </div>
            
            {/* Four Green Cards - Horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-6">
              <div 
                className="rounded-lg"
                style={{
                  backgroundColor: '#81A93D1A',
                  width: '100%',
                  minHeight: '99px',
                  paddingTop: '16px',
                  paddingRight: '14px',
                  paddingBottom: '16px',
                  paddingLeft: '14px',
                  borderRadius: '8px',
                }}
              >
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-medium">AVERAGE TUITION</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(collegeData.outOfStateTuition || collegeData.inStateTuition)}
                </p>
              </div>
              <div 
                className="rounded-lg"
                style={{
                  backgroundColor: '#81A93D1A',
                  width: '100%',
                  minHeight: '99px',
                  paddingTop: '16px',
                  paddingRight: '14px',
                  paddingBottom: '16px',
                  paddingLeft: '14px',
                  borderRadius: '8px',
                }}
              >
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-medium">IN-STATE TUITION</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(collegeData.inStateTuition)}
                </p>
              </div>
              <div 
                className="rounded-lg"
                style={{
                  backgroundColor: '#81A93D1A',
                  width: '100%',
                  minHeight: '99px',
                  paddingTop: '16px',
                  paddingRight: '14px',
                  paddingBottom: '16px',
                  paddingLeft: '14px',
                  borderRadius: '8px',
                }}
              >
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-medium">INTERNATIONAL STUDENT TUITION</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(collegeData.internationalTuition)}
                </p>
              </div>
              <div 
                className="rounded-lg"
                style={{
                  backgroundColor: '#81A93D1A',
                  width: '100%',
                  minHeight: '99px',
                  paddingTop: '16px',
                  paddingRight: '14px',
                  paddingBottom: '16px',
                  paddingLeft: '14px',
                  borderRadius: '8px',
                }}
              >
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-medium">AVERAGE FINANCIAL AID OFFERED</p>
                <p className="text-2xl font-bold text-gray-900">
                  {collegeData.aidPercentage ? `${collegeData.aidPercentage}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* List Format Information */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">% of students receiving aid</span>
                <span className="text-sm font-medium text-gray-900">
                  {collegeData.aidPercentage ? `${Math.round(collegeData.aidPercentage * 0.5)}%` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">% of international students receiving aid</span>
                <span className="text-sm font-medium text-gray-900">
                  {collegeData.aidPercentage ? `${Math.round(collegeData.aidPercentage * 0.4)}%` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Housing costs Avg (on campus)</span>
                <span className="text-sm font-medium text-gray-900">
                  {collegeData.outOfStateTuition || collegeData.inStateTuition 
                    ? formatCurrency(Math.round((collegeData.outOfStateTuition || collegeData.inStateTuition || 0) * 0.25))
                    : "N/A"} annually
                </span>
              </div>
            </div>

            {/* Compare Button */}
            <button 
              className="px-6 py-3 text-white rounded-lg font-medium flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#81A93D',
              }}
            >
              Compare with other Universities
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Campus Life */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Campus life</h2>
            </div>
            <div className="space-y-6">
              {/* Variety of Athletic Teams */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">Variety of Athletic Teams</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  {collegeData.athleticAssociation || collegeData.athleticDivision ? (
                    <div className="space-y-2">
                      {collegeData.athleticAssociation && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Athletic Association:</span>
                          <span className="text-sm font-medium text-gray-900">{collegeData.athleticAssociation}</span>
                        </div>
                      )}
                      {collegeData.athleticDivision && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Division:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {collegeData.athleticDivision === "1" ? "Division I" : 
                             collegeData.athleticDivision === "2" ? "Division II" : 
                             collegeData.athleticDivision === "3" ? "Division III" : 
                             `Division ${collegeData.athleticDivision}`}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-3">
                        {collegeData.athleticDivision && (
                          <>
                            {collegeData.athleticDivision === "1" && "Division I institutions typically offer a wide range of athletic programs including football, basketball, baseball, soccer, volleyball, track and field, swimming, tennis, and more. These schools compete at the highest level of collegiate athletics."}
                            {collegeData.athleticDivision === "2" && "Division II schools offer competitive athletic programs with a balance between athletics and academics. Common sports include basketball, soccer, volleyball, track and field, and other team and individual sports."}
                            {collegeData.athleticDivision === "3" && "Division III institutions emphasize the student-athlete experience with a focus on participation and personal development. Sports programs are available but do not offer athletic scholarships."}
                            {!["1", "2", "3"].includes(collegeData.athleticDivision) && "The university offers various athletic programs and teams. Specific sports offerings may vary by institution."}
                          </>
                        )}
                        {!collegeData.athleticDivision && "Information about athletic programs and teams available at the university. The institution offers various sports programs for student-athletes."}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Information about athletic programs and teams available at the university. The institution offers various sports programs for student-athletes to participate in competitive and recreational activities.
                    </p>
                  )}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">Facilities</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Campus Facilities</p>
                      <p className="text-sm text-gray-600">
                        {collegeData.name} provides comprehensive campus facilities including modern libraries with extensive research resources, state-of-the-art research centers, student recreation centers, dining facilities, and residential housing options.
                      </p>
                    </div>
                    {collegeData.totalPopulation && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Student Amenities</p>
                        <p className="text-sm text-gray-600">
                          With a student population of {collegeData.totalPopulation.toLocaleString()}, the campus offers various amenities including study spaces, computer labs, fitness centers, student lounges, and collaborative learning environments to support student success and well-being.
                        </p>
                      </div>
                    )}
                    {collegeData.locale && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Campus Environment</p>
                        <p className="text-sm text-gray-600">
                          The {getLocaleType(collegeData.locale).toLowerCase()} campus setting provides a {getLocaleType(collegeData.locale) === "Urban" ? "vibrant urban environment with easy access to city amenities" : getLocaleType(collegeData.locale) === "Suburban" ? "peaceful suburban environment with modern facilities" : getLocaleType(collegeData.locale) === "Rural" ? "tranquil rural setting with spacious campus grounds" : "unique campus environment"} that enhances the overall student experience.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

