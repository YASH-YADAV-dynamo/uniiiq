"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
          // Auto-redirect to dashboard after score animation completes (5 seconds delay)
          setTimeout(() => {
            router.push("/dashboard");
          }, 5000);
        } else {
          setScoreAnimated(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [score, router]);

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
        insight: gpa >= avgGPA ? "• In the range" : "• Below recommended range",
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
        insight: sat >= avgSAT ? "• Above recommended range" : sat >= 1400 ? "• In the range" : "• Below recommended range",
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
      insight: ecScore >= avgEC ? "• In the range" : "• Below recommended range",
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
      insight: hasResearch ? "• Bonus advantage" : "• Consider adding",
      status: hasResearch ? "excellent" : "needs-improvement",
    });

    // Subject Rigor
    const rigor = data.major ? "High" : "Medium";
    metrics.push({
      metric: "Subject Rigor",
      you: rigor,
      avgAdmitted: "Medium-High",
      insight: rigor === "High" ? "• Above recommended range" : "• In the range",
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

  const topUniversities = data.universities.slice(0, 4).map(uni => ({
    name: uni,
    match: 84,
    logo: "/university-placeholder.png",
  }));

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
          <div className="flex justify-center mb-4">
            <div style={{ width: 200, height: 200 }}>
              <CircularProgressbar
                value={scoreAnimated}
                text={`${scoreAnimated}%`}
                styles={buildStyles({
                  pathColor: "#10b981",
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                  textSize: "24px",
                })}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">YOUR SMART ADMIT SCORE</h1>
          <p className="text-gray-600 mb-2">Better than {Math.round((score / 100) * 40)}% students.</p>
          <p className="text-sm text-gray-500 mb-2">
            Based on your academics, test scores, activities, and preferred course/university -
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Strong profile</span>
          </div>
        </div>

        {/* Top Program Matches */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Program Matches</h2>
            <button className="text-gray-600 hover:text-gray-900 text-sm">View more &gt;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topUniversities.map((uni, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{uni.name.charAt(0)}</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{uni.name}</h3>
                <p className="text-sm text-gray-600">{uni.match}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* How You Compare Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How You Compare (vs avg admitted applicant)</h2>
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
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(metric.status)}`}></div>
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
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">What's Working for You</h2>
            </div>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Needs Improvement */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">What Needs Improvement</h2>
            </div>
            <ul className="space-y-2 mb-4">
              {improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              How to improve? &gt;
            </button>
          </div>
        </div>

        {/* Suggested Next Steps */}
        <div className="mb-8">
          <p className="text-gray-700 mb-6 font-medium">
            HERE ARE SOME SUGGESTED NEXT STEPS TO HELP YOU REACH YOUR GOALS:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">01 Check other universities/backups</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
                Check now &gt;
              </button>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">02 Get a roadmap to boost odds</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm font-medium">
                Get started &gt;
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">03 Set deadlines + alerts in your dashboard</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur. Consequat non massa aliquam viverra.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                Set up your planner &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


