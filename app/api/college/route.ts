import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/api/response";

const COLLEGE_SCORECARD_API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolName = searchParams.get("name");

    if (!schoolName) {
      return ApiResponse.error("School name is required", 400);
    }

    if (!COLLEGE_SCORECARD_API_KEY) {
      console.error("COLLEGE_SCORECARD_API_KEY is not set in environment variables");
      return ApiResponse.error("API key not configured", 500);
    }

    // Search for the school by name - including athletics, facilities, and programs data
    // Use all_programs_nested=true to get all programs as an array
    const params = new URLSearchParams({
      'api_key': COLLEGE_SCORECARD_API_KEY,
      'school.name': schoolName,
      'fields': 'id,school.name,school.state,school.city,school.zip,school.region_id,school.locale,school.carnegie_basic,school.carnegie_size_setting,school.degrees_awarded.predominant,school.ownership,school.online_only,school.operating,school.athletic_association,school.athletic_division,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.admissions.act_scores.midpoint.cumulative,latest.student.size,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.aid.median_debt.completers.overall,latest.completion.completion_rate_4yr_150nt,latest.earnings.10_yrs_after_entry.median,location.lat,location.lon,latest.programs.cip_4_digit',
      'all_programs_nested': 'true'
    });
    const searchUrl = `${BASE_URL}?${params.toString()}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error("College Scorecard API error:", response.status, response.statusText);
      return ApiResponse.error(`Failed to fetch college data: ${response.statusText}`, response.status);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return ApiResponse.error("College not found", 404);
    }

    // Return the first matching result
    const college = data.results[0];

    // Fetch university image from Unsplash
    let imageUrl = null;
    if (UNSPLASH_ACCESS_KEY) {
      try {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(college["school.name"] || schoolName)} university campus&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json();
          if (unsplashData.results && unsplashData.results.length > 0) {
            imageUrl = unsplashData.results[0].urls.regular;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch image from Unsplash:", err);
      }
    }

    // Calculate financial aid percentage (if available)
    const aidPercentage = college["latest.aid.median_debt.completers.overall"] 
      ? Math.round((1 - (college["latest.aid.median_debt.completers.overall"] / (college["latest.cost.tuition.out_of_state"] || college["latest.cost.tuition.in_state"] || 1))) * 100)
      : null;

    // Extract program titles from API response
    // With all_programs_nested=true, latest.programs.cip_4_digit returns an array of program objects
    const programsData = college["latest.programs.cip_4_digit"];
    const majors: string[] = [];
    
    // Handle the array of program objects
    if (Array.isArray(programsData)) {
      programsData.forEach((program: any) => {
        // Each program object has: code, title, credential, earnings, etc.
        if (program && program.title && typeof program.title === 'string') {
          const programTitle = program.title.trim();
          // Only add unique program titles
          if (programTitle && !majors.includes(programTitle)) {
            majors.push(programTitle);
          }
        }
      });
    } else if (programsData && typeof programsData === 'object') {
      // Fallback: if it's an object instead of array, try to extract titles
      Object.values(programsData).forEach((program: any) => {
        if (program && typeof program === 'object' && program.title) {
          const programTitle = program.title.trim();
          if (programTitle && !majors.includes(programTitle)) {
            majors.push(programTitle);
          }
        } else if (program && typeof program === 'string') {
          const programTitle = program.trim();
          if (programTitle && !majors.includes(programTitle)) {
            majors.push(programTitle);
          }
        }
      });
    }
    
    // Sort majors alphabetically for better display
    majors.sort();
    
    // Return only the majors found in the API - no hardcoded fallback
    const finalMajors = majors;

    // Format the data for our use
    const formattedData = {
      id: college.id,
      name: college["school.name"] || schoolName,
      state: college["school.state"] || "",
      city: college["school.city"] || "",
      zip: college["school.zip"] || "",
      location: `${college["school.city"] || ""}, ${college["school.state"] || ""}`.trim(),
      acceptanceRate: college["latest.admissions.admission_rate.overall"] 
        ? (college["latest.admissions.admission_rate.overall"] * 100).toFixed(1) + "%"
        : null,
      averageSAT: college["latest.admissions.sat_scores.average.overall"] || null,
      averageACT: college["latest.admissions.act_scores.midpoint.cumulative"] || null,
      totalPopulation: college["latest.student.size"] || null,
      inStateTuition: college["latest.cost.tuition.in_state"] || null,
      outOfStateTuition: college["latest.cost.tuition.out_of_state"] || null,
      internationalTuition: college["latest.cost.tuition.out_of_state"] || null, // Use out-of-state for international
      completionRate: college["latest.completion.completion_rate_4yr_150nt"]
        ? (college["latest.completion.completion_rate_4yr_150nt"] * 100).toFixed(1) + "%"
        : null,
      medianEarnings: college["latest.earnings.10_yrs_after_entry.median"] || null,
      medianDebt: college["latest.aid.median_debt.completers.overall"] || null,
      latitude: college["location.lat"] || null,
      longitude: college["location.lon"] || null,
      ownership: college["school.ownership"] || null, // 1 = Public, 2 = Private nonprofit, 3 = Private for-profit
      locale: college["school.locale"] || null, // 11-13 = City, 21-23 = Suburban, 31-33 = Town, 41-43 = Rural
      imageUrl: imageUrl,
      aidPercentage: aidPercentage,
      athleticAssociation: college["school.athletic_association"] || null, // NCAA, NAIA, etc.
      athleticDivision: college["school.athletic_division"] || null, // Division I, II, III, etc.
      majors: finalMajors, // List of majors/programs offered
    };

    return ApiResponse.success(formattedData);
  } catch (error: any) {
    console.error("College API error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch college data");
  }
}

