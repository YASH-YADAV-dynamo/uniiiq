import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { data, error } = await supabaseAdmin
      .from("smartadmit_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      return ApiResponse.error(error.message, 400);
    }

    if (!data) {
      return ApiResponse.success(null);
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Get smartadmit error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch SmartAdmit data");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    let body;
    try {
      body = await request.json();
    } catch (jsonError: any) {
      console.error("JSON parse error:", jsonError);
      return ApiResponse.error("Invalid JSON in request body", 400);
    }
    
    const {
      major,
      universities,
      satScore,
      gpaScale,
      gpaScore,
      currentGrade,
      extracurricularHours,
      activities,
      detailedActivities,
    } = body;

    // Prepare data structure - monolithic JSONB approach
    const smartAdmitData = {
      major: major || "",
      universities: universities || [],
      satScore: satScore || "",
      gpaScale: gpaScale || "",
      gpaScore: gpaScore || "",
      currentGrade: currentGrade || "",
      extracurricularHours: extracurricularHours || 0,
      activities: activities || [],
      detailedActivities: detailedActivities || [],
    };

    // Check if smartadmit data exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("smartadmit_data")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Check smartadmit error:", checkError);
      return ApiResponse.error(checkError.message, 400);
    }

    if (existing) {
      // Update existing
      const updateData = {
        data: smartAdmitData,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await (supabaseAdmin
        .from("smartadmit_data") as any)
        .update(updateData)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Update smartadmit error:", error);
        return ApiResponse.error(`Failed to update SmartAdmit data: ${error.message}`, 400);
      }

      return ApiResponse.success(data);
    } else {
      // Create new
      const { data, error } = await (supabaseAdmin
        .from("smartadmit_data") as any)
        .insert({
          user_id: user.id,
          data: smartAdmitData,
        })
        .select()
        .single();

      if (error) {
        console.error("Create smartadmit error:", error);
        return ApiResponse.error(`Failed to create SmartAdmit data: ${error.message}`, 400);
      }

      return ApiResponse.success(data, 201);
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Save smartadmit error:", error);
    return ApiResponse.serverError(error.message || "Failed to save SmartAdmit data");
  }
}
