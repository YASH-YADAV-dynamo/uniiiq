"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import UniiqLogo from "@/components/ui/UniiqLogo";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface SmartAdmitData {
  major: string;
  universities: string[];
  satScore: string;
  gpaScale: string;
  gpaScore: string;
  currentGrade: string;
  extracurricularHours: number;
  activities: string[];
  detailedActivities: Array<{
    title: string;
    role: string;
    duration: string;
    hoursPerWeek: string;
  }>;
}

interface ComparisonMetric {
  metric: string;
  you: string | number;
  avgAdmitted: string | number;
  insight: string;
  status: "good" | "warning" | "excellent" | "needs-improvement";
}

export default function AdmitScorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [scoreAnimated, setScoreAnimated] = useState(0);
  const [data, setData] = useState<SmartAdmitData | null>(null);
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetric[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [topUniversities, setTopUniversities] = useState<Array<{
    name: string;
    match: number;
    logo: string;
  }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Animate score
    if (score > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = score / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setScoreAnimated(score);
          clearInterval(timer);
        } else {
          setScoreAnimated(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [score]);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
        return;
      }

      // Fetch smartadmit data (primary source from the form)
      const smartadmitResponse = await fetch("/api/smartadmit", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      let userData: SmartAdmitData | null = null;

      if (smartadmitResponse.ok) {
        const smartadmitResult = await smartadmitResponse.json();
        if (smartadmitResult.success && smartadmitResult.data?.data) {
          userData = smartadmitResult.data.data as SmartAdmitData;
        }
      }

      // If no smartadmit data, try preferences as fallback
      if (!userData || !userData.major) {
        const preferencesResponse = await fetch("/api/preferences", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (preferencesResponse.ok) {
          const preferencesResult = await preferencesResponse.json();
          if (preferencesResult.success && preferencesResult.data) {
            const prefs = preferencesResult.data;
            const academic = prefs.academic_preferences || {};
            const goals = prefs.goals || {};
            
            // Map preferences data to SmartAdmitData format
            userData = {
              major: goals.intendedMajor || "",
              universities: goals.universitiesToTarget ? [goals.universitiesToTarget] : [],
              satScore: academic.satScore || "",
              gpaScale: academic.gradeSubject ? "4.0" : "",
              gpaScore: academic.gradeScore || "",
              currentGrade: prefs.personal_info?.currentGrade || "",
              extracurricularHours: goals.hoursPerWeek ? Math.round(goals.hoursPerWeek * 4) : 0,
              activities: [],
              detailedActivities: [],
            };
          }
        }
      }

      if (userData) {
        setData(userData);
        
        // Calculate score and metrics
        const calculatedScore = calculateScore(userData);
        setScore(calculatedScore);
        
        const metrics = calculateComparisonMetrics(userData);
        setComparisonMetrics(metrics);
        
        const strengthsList = calculateStrengths(userData, metrics);
        setStrengths(strengthsList);
        
        const improvementsList = calculateImprovements(userData, metrics);
        setImprovements(improvementsList);

        // Fetch college recommendations using AHP logic
        try {
          const recommendationsResponse = await fetch("/api/colleges/recommendations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              sat_score: userData.satScore,
              gpa_score: userData.gpaScore,
              gpa_scale: userData.gpaScale,
              major: userData.major,
              universities: userData.universities,
              extracurricular_hours: userData.extracurricularHours,
              activities: userData.activities,
              detailed_activities: userData.detailedActivities,
            }),
          });

          if (recommendationsResponse.ok) {
            const recommendationsResult = await recommendationsResponse.json();
            if (recommendationsResult.success && recommendationsResult.data?.recommendations) {
              const recommendations = recommendationsResult.data.recommendations.map((rec: any) => ({
                name: rec.name,
                match: rec.match,
                logo: `/university-${rec.name.toLowerCase().replace(/\s+/g, '-')}.png`,
              }));
              setTopUniversities(recommendations);
            }
          }
        } catch (recError) {
          console.error("Error fetching recommendations:", recError);
          // Fallback to old calculation method
          const allUniversities = [
            ...userData.universities,
            "Harvard University",
            "MIT",
            "Yale University",
            "Brown University",
            "Stanford University",
            "Princeton University",
            "Columbia University",
            "Duke University"
          ];
          const uniqueUniversities = Array.from(new Set(allUniversities));
          const universitiesWithMatches = uniqueUniversities
            .map(uni => ({
              name: uni,
              match: calculateUniversityMatch(uni, userData, calculatedScore),
              logo: `/university-${uni.toLowerCase().replace(/\s+/g, '-')}.png`,
            }))
            .sort((a, b) => b.match - a.match)
            .slice(0, 4);
          setTopUniversities(universitiesWithMatches);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (data: SmartAdmitData): number => {
    let totalScore = 0;
    let maxScore = 0;

    // GPA Score (0-25 points)
    maxScore += 25;
    if (data.gpaScore) {
      const gpa = parseFloat(data.gpaScore);
      if (data.gpaScale === "4.0" && gpa >= 3.7) totalScore += 25;
      else if (data.gpaScale === "4.0" && gpa >= 3.5) totalScore += 20;
      else if (data.gpaScale === "4.0" && gpa >= 3.0) totalScore += 15;
      else if (data.gpaScale === "4.0") totalScore += 10;
      else if (gpa >= 90) totalScore += 25;
      else if (gpa >= 85) totalScore += 20;
      else if (gpa >= 80) totalScore += 15;
      else totalScore += 10;
    }

    // SAT Score (0-25 points)
    maxScore += 25;
    if (data.satScore) {
      const sat = parseInt(data.satScore);
      if (sat >= 1500) totalScore += 25;
      else if (sat >= 1400) totalScore += 20;
      else if (sat >= 1300) totalScore += 15;
      else if (sat >= 1200) totalScore += 10;
      else totalScore += 5;
    }

    // Extracurriculars (0-25 points)
    maxScore += 25;
    const ecScore = Math.min((data.extracurricularHours / 40) * 15 + (data.activities.length * 2), 25);
    totalScore += ecScore;

    // Activities Quality (0-25 points)
    maxScore += 25;
    if (data.detailedActivities.length > 0) {
      totalScore += Math.min(data.detailedActivities.length * 5, 25);
    } else {
      totalScore += data.activities.length * 3;
    }

    return Math.round((totalScore / maxScore) * 100);
  };

  const calculateComparisonMetrics = (data: SmartAdmitData): ComparisonMetric[] => {
    const metrics: ComparisonMetric[] = [];

    // GPA
    if (data.gpaScore) {
      const gpa = parseFloat(data.gpaScore);
      const avgGPA = data.gpaScale === "4.0" ? 3.7 : 85;
      const status = gpa >= avgGPA ? "good" : "warning";
      metrics.push({
        metric: "GPA",
        you: data.gpaScore,
        avgAdmitted: avgGPA,
        insight: gpa >= avgGPA ? "In the range" : "Below recommended range",
        status,
      });
    }

    // SAT
    if (data.satScore) {
      const sat = parseInt(data.satScore);
      const avgSAT = 1475;
      const status = sat >= avgSAT ? "excellent" : sat >= 1400 ? "good" : "warning";
      metrics.push({
        metric: "SAT",
        you: sat,
        avgAdmitted: avgSAT,
        insight: sat >= avgSAT ? "Above recommended range" : sat >= 1400 ? "In the range" : "Below recommended range",
        status,
      });
    }

    // EC Score
    const ecScore = Math.min((data.extracurricularHours / 40) * 10, 10);
    const avgEC = 6.9;
    const status = ecScore >= avgEC ? "excellent" : "good";
    metrics.push({
      metric: "EC Score",
      you: `${ecScore.toFixed(1)}/10`,
      avgAdmitted: `${avgEC}/10`,
      insight: ecScore >= avgEC ? "In the range" : "Below recommended range",
      status,
    });

    // Research/Internship
    const hasResearch = data.detailedActivities.some(a => 
      a.title.toLowerCase().includes("research") || 
      a.title.toLowerCase().includes("internship")
    );
    metrics.push({
      metric: "Research/Internship",
      you: hasResearch ? "Present" : "Not Present",
      avgAdmitted: "40% of admit",
      insight: hasResearch ? "Bonus advantage" : "Consider adding",
      status: hasResearch ? "excellent" : "needs-improvement",
    });

    // Subject Rigor
    const rigor = data.major ? "High" : "Medium";
    metrics.push({
      metric: "Subject Rigor",
      you: rigor,
      avgAdmitted: "Medium-High",
      insight: rigor === "High" ? "Above recommended range" : "In the range",
      status: rigor === "High" ? "excellent" : "good",
    });

    return metrics;
  };

  const calculateStrengths = (data: SmartAdmitData, metrics: ComparisonMetric[]): string[] => {
    const strengths: string[] = [];
    
    if (data.extracurricularHours >= 15 && data.activities.length >= 3) {
      strengths.push("Leadership & long-term EC involvement.");
    }
    
    if (data.detailedActivities.some(a => 
      a.title.toLowerCase().includes(data.major.toLowerCase()) ||
      a.role.toLowerCase().includes("leader") ||
      a.role.toLowerCase().includes("president")
    )) {
      strengths.push("Internship/research aligns with chosen major.");
    }
    
    if (data.major) {
      strengths.push("Subject selection matches program rigor.");
    }

    return strengths;
  };

  const calculateImprovements = (data: SmartAdmitData, metrics: ComparisonMetric[]): string[] => {
    const improvements: string[] = [];
    
    const satMetric = metrics.find(m => m.metric === "SAT");
    if (satMetric && satMetric.status === "warning") {
      improvements.push("Slight SAT gap for ultra-competitive US programs.");
    }
    
    if (data.activities.length < 3) {
      improvements.push("Lack of subject-specific competition participation.");
    }

    return improvements;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "needs-improvement":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "needs-improvement":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your Smart Admit Score...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No SmartAdmit data found.</p>
          <button
            onClick={() => router.push("/smartadmit")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Complete SmartAdmit Form
          </button>
        </div>
      </div>
    );
  }

  // Fallback calculation method (used if API fails)
  const calculateUniversityMatch = (universityName: string, userData: SmartAdmitData, userScore: number): number => {
    // Base match on overall score
    let match = userScore;
    
    // Create a deterministic hash from university name for consistent variation
    const hash = universityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Adjust based on university tier (top universities need higher scores)
    const topTier = ["Harvard", "MIT", "Stanford", "Yale", "Princeton", "Columbia", "Brown"];
    const midTier = ["Duke", "Northwestern", "Johns Hopkins", "Vanderbilt", "Rice"];
    
    if (topTier.some(tier => universityName.includes(tier))) {
      // Top tier: reduce match by 8-12 points (harder to get into)
      match = Math.max(70, match - 10 + (hash % 5));
    } else if (midTier.some(tier => universityName.includes(tier))) {
      // Mid tier: slight reduction
      match = Math.max(75, match - 3 + (hash % 3));
    } else {
      // Other universities: slight boost
      match = Math.min(95, match + 2 + (hash % 3));
    }
    
    return Math.round(match);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <UniiqLogo href="/" size="lg" />
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            Go to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Smart Admit Score Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6 relative">
            <div style={{ width: 240, height: 240, position: 'relative' }}>
              <CircularProgressbar
                value={scoreAnimated}
                text=""
                styles={buildStyles({
                  pathColor: "#69813F",
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                })}
              />
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
              }}>
                <p className="text-xs font-medium text-gray-600 mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                  YOUR SMART-ADMIT SCORE
                </p>
                <p className="text-5xl font-bold text-gray-900" style={{ fontSize: '48px', lineHeight: '1.2' }}>
                  {scoreAnimated}%
                </p>
              </div>
            </div>
            {/* Better than line positioned below circle, overlapping bottom */}
            <div 
              className="absolute"
              style={{
                top: 'calc(50% + 95px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150px',
                height: '28px',
                gap: '6px',
                borderRadius: '31px',
                paddingTop: '6px',
                paddingRight: '10px',
                paddingBottom: '6px',
                paddingLeft: '10px',
                background: score >= 70 
                  ? 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(129, 169, 61, 0.1), rgba(129, 169, 61, 0.1))'
                  : score < 50
                  ? 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.1))'
                  : 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <p className="text-xs text-black whitespace-nowrap font-medium">
                Better than {Math.round((score / 100) * 48)}% students.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Based on your academics, test scores, activities, and preferred course/university -
          </p>
          <div className="flex items-center justify-center">
            {(() => {
              let profileText = "Strong profile";
              let dotColor = "#69813F";
              let textColor = "#2E7D32";
              
              if (score < 50) {
                profileText = "Poor profile";
                dotColor = "#DC2626";
                textColor = "#991B1B";
              } else if (score < 70) {
                profileText = "Fair profile";
                dotColor = "#F59E0B";
                textColor = "#B45309";
              } else if (score < 85) {
                profileText = "Good profile";
                dotColor = "#3B82F6";
                textColor = "#1E40AF";
              } else {
                profileText = "Strong profile";
                dotColor = "#69813F";
                textColor = "#365314";
              }
              
              return (
                <div 
                  className="inline-flex items-center"
                  style={{
                    width: '157.21px',
                    height: '41px',
                    gap: '11.71px',
                    borderRadius: '5.43px',
                    borderWidth: '1.17px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(129, 169, 61, 0.1)',
                    paddingTop: '10px',
                    paddingRight: '14px',
                    paddingBottom: '10px',
                    paddingLeft: '14px',
                    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(129, 169, 61, 0.1), rgba(129, 169, 61, 0.1))',
                  }}
                >
                  <div 
                    className="rounded-full shrink-0"
                    style={{ 
                      width: '8px',
                      height: '8px',
                      backgroundColor: dotColor
                    }}
                  ></div>
                  <span 
                    className="text-base font-bold"
                    style={{ color: textColor }}
                  >
                    {profileText}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Top Program Matches */}
        <div 
          className="mb-8 rounded-lg p-6"
          style={{
            backgroundColor: '#F0F0F0',
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Program Matches</h2>
            <button className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium flex items-center gap-1">
              View more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {topUniversities.map((uni, index) => (
              <div
                key={index}
                onClick={() => router.push(`/university/${encodeURIComponent(uni.name)}`)}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between shrink-0"
                style={{ minWidth: '280px' }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-600">{uni.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{uni.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">{uni.match}%</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* How You Compare Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">How You Compare (vs avg admitted applicant)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">You</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Admitted</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Comparison Insight</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{metric.metric}</td>
                    <td className="py-3 px-4 text-gray-700">{metric.you}</td>
                    <td className="py-3 px-4 text-gray-700">{metric.avgAdmitted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getStatusDot(metric.status)}`}></div>
                        <span className={getStatusColor(metric.status)}>{metric.insight}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* What's Working */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/college-star.png" alt="Star" width={24} height={24} className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">What's Working for You</h2>
            </div>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Needs Improvement */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/college-graph.png" alt="Graph" width={24} height={24} className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">What Needs Improvement</h2>
            </div>
            <ul className="space-y-2 mb-4">
              {improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700">
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button 
                className="text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                style={{
                  width: '163px',
                  height: '35px',
                  gap: '6px',
                  borderRadius: '6px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  backgroundColor: '#C17C74',
                }}
              >
                How to improve?
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Next Steps */}
        <div className="mb-8">
          <p className="text-gray-900 mb-6 font-medium uppercase">
            HERE ARE SOME SUGGESTED NEXT STEPS TO HELP YOU REACH YOUR GOALS:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Greenish */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#81A93D1A' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span style={{ fontSize: '24px', color: '#D3D3D3', fontWeight: 'bold' }}>01</span>
                Check other universities/backups
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button 
                className="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#69813F' }}
              >
                Check now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Card 2 - Yellowish */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#FFD96526' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span style={{ fontSize: '24px', color: '#D3D3D3', fontWeight: 'bold' }}>02</span>
                Get a roadmap to boost odds
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button 
                className="text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FFD965' }}
              >
                Get started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Card 3 - Bluish */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#376B8B1A' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span style={{ fontSize: '24px', color: '#D3D3D3', fontWeight: 'bold' }}>03</span>
                Set deadlines + alerts in your dashboard
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button 
                className="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#467896' }}
              >
                Set up your planner
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


