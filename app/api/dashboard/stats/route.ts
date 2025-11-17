import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { data, error } = await supabaseAdmin
      .from("dashboard_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No stats found, create default
        const { data: newData, error: createError } = await supabaseAdmin
          .from("dashboard_stats")
          .insert({
            user_id: user.id,
            academics_count: 0,
            research_work_count: 0,
            competitions_count: 0,
            universities_shortlisted: 0,
            extracurriculars_count: 0,
            summer_courses_count: 0,
          })
          .select()
          .single();

        if (createError) {
          return ApiResponse.error(createError.message, 400);
        }

        return ApiResponse.success(newData);
      }
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Get dashboard stats error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch dashboard stats");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("dashboard_stats")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Update dashboard stats error:", error);
    return ApiResponse.serverError(error.message || "Failed to update dashboard stats");
  }
}

