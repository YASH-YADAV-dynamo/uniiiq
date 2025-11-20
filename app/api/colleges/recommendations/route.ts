import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { CollegePredictor } from "@/lib/utils/college-predictor";

const COLLEGE_SCORECARD_API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;
const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    const {
      sat_score,
      gpa_score,
      gpa_scale,
      major,
      universities,
      extracurricular_hours,
      activities,
      detailed_activities,
      budget,
      // Optional: Custom weights for weighted vectors
      custom_weights,
      category_weights
    } = body;

    if (!COLLEGE_SCORECARD_API_KEY) {
      return ApiResponse.error("API key not configured", 500);
    }

    // Convert GPA to 4.0 scale if needed
    let cgpa = 0;
    if (gpa_score && gpa_scale) {
      if (gpa_scale === "4.0") {
        cgpa = parseFloat(gpa_score);
      } else if (gpa_scale === "100") {
        cgpa = (parseFloat(gpa_score) / 100) * 4.0;
      } else {
        cgpa = parseFloat(gpa_score) / 10 * 4.0; // Assume 10 scale
      }
    }

    // Prepare student data
    const studentData = {
      sat_score: sat_score ? parseInt(sat_score) : 0,
      cgpa: cgpa,
      subject_grades: 0.7, // Default
      extracurriculars: activities || [],
      awards: detailed_activities?.length || 0,
      standardized_tests: 1, // Default
      intended_major: major || "",
      budget: budget || 50000,
      min_budget: 0,
      max_budget: 100000
    };

    // Fetch colleges from College Scorecard API
    const collegeNames = universities && universities.length > 0 
      ? universities 
      : ["Harvard University", "MIT", "Yale University", "Brown University", "Stanford University", "Princeton University", "Columbia University", "Duke University"];

    // Fetch data for each college
    const collegesData = [];
    for (const collegeName of collegeNames.slice(0, 20)) { // Limit to 20 for performance
      try {
        const searchUrl = `${BASE_URL}?api_key=${COLLEGE_SCORECARD_API_KEY}&school.name=${encodeURIComponent(collegeName)}&fields=id,school.name,school.state,school.city,latest.admissions.sat_scores.average.overall,latest.cost.tuition.out_of_state,latest.cost.tuition.in_state`;
        const response = await fetch(searchUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const college = data.results[0];
            collegesData.push({
              name: college["school.name"] || collegeName,
              sat_requirement: college["latest.admissions.sat_scores.average.overall"] || null,
              avg_sat: college["latest.admissions.sat_scores.average.overall"] || null,
              avg_gpa: 3.7, // Default
              avg_extracurriculars: 5, // Default
              majors: [major || ""],
              location: `${college["school.city"] || ""}, ${college["school.state"] || ""}`.trim(),
              tuition: college["latest.cost.tuition.out_of_state"] || college["latest.cost.tuition.in_state"] || null,
              state: college["school.state"] || null,
              city: college["school.city"] || null
            });
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch data for ${collegeName}:`, err);
      }
    }

    if (collegesData.length === 0) {
      return ApiResponse.error("No college data available", 404);
    }

    // Use CollegePredictor with optional custom weights for weighted vectors
    const predictor = new CollegePredictor(custom_weights, category_weights);
    const topColleges = predictor.getTopColleges(studentData, collegesData, 4);

    return ApiResponse.success({
      recommendations: topColleges.map(sc => ({
        name: sc.college.name,
        match: sc.score,
        breakdown: sc.breakdown,
        location: sc.college.location,
        tuition: sc.college.tuition
      }))
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("College recommendations error:", error);
    return ApiResponse.serverError(error.message || "Failed to get college recommendations");
  }
}

