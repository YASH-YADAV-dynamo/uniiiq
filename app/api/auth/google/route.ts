import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return ApiResponse.error("Authorization code is required", 400);
    }

    // Exchange code for session
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code);

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    if (!data.user || !data.session) {
      return ApiResponse.error("Failed to create session", 500);
    }

    // Check if user profile exists, create if not
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!existingUser) {
      // Create user profile
      await supabaseAdmin.from("users").insert({
        id: data.user.id,
        email: data.user.email || "",
        full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
        profile_picture_url: data.user.user_metadata?.avatar_url || null,
        subscribe_newsletter: false,
      });

      // Initialize dashboard stats
      await supabaseAdmin.from("dashboard_stats").insert({
        user_id: data.user.id,
        academics_count: 0,
        research_work_count: 0,
        competitions_count: 0,
        universities_shortlisted: 0,
        extracurriculars_count: 0,
        summer_courses_count: 0,
      });
    }

    return ApiResponse.success({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return ApiResponse.serverError(error.message || "Failed to authenticate with Google");
  }
}

