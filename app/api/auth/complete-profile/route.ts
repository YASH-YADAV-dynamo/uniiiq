import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { getUserFromRequest } from "@/lib/api/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userIdFromBody = body.userId as string | undefined;
    
    let userId: string;
    
    // If userId is provided in body (during signup), verify it exists
    if (userIdFromBody) {
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userIdFromBody);
        if (userError || !userData?.user) {
          // Fallback: try to get from auth header
          const user = await getUserFromRequest(request);
          if (!user) {
            return ApiResponse.error("Invalid user ID or missing authentication", 401);
          }
          userId = user.id;
        } else {
          userId = userIdFromBody;
        }
      } catch (err) {
        // If admin API fails, try auth header
        const user = await getUserFromRequest(request);
        if (!user) {
          return ApiResponse.error("Invalid user ID or missing authentication", 401);
        }
        userId = user.id;
      }
    } else {
      // Try to get from auth header
      const user = await getUserFromRequest(request);
      if (!user) {
        return ApiResponse.unauthorized();
      }
      userId = user.id;
    }
    
    const email = body.email as string;
    const name = body.name as string;
    const mobile = body.mobile as string;
    const countryCode = body.countryCode as string;
    const profilePictureUrl = body.profilePictureUrl as string | null;
    const subscribeNewsletter = body.subscribeNewsletter === true;

    // Validate required fields
    if (!email || !name) {
      return ApiResponse.error("Email and name are required", 400);
    }

    // Create or update user profile using admin client (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from("users")
      .upsert({
        id: userId,
        email,
        full_name: name,
        mobile: mobile || null,
        country_code: countryCode || null,
        profile_picture_url: profilePictureUrl,
        subscribe_newsletter: subscribeNewsletter || false,
      }, {
        onConflict: "id",
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Check if it's a table not found error
      if (profileError.message?.includes("table") || profileError.message?.includes("schema cache")) {
        return ApiResponse.error("Database tables not set up. Please run the setup script in Supabase SQL Editor.", 500);
      }
      return ApiResponse.error(profileError.message || "Failed to create profile", 400);
    }

    // Initialize dashboard stats if not exists
    const { data: existingStats, error: statsCheckError } = await supabaseAdmin
      .from("dashboard_stats")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (statsCheckError && !statsCheckError.message?.includes("No rows")) {
      console.error("Stats check error:", statsCheckError);
    }

    if (!existingStats) {
      const { error: statsError } = await supabaseAdmin.from("dashboard_stats").insert({
        user_id: userId,
        academics_count: 0,
        research_work_count: 0,
        competitions_count: 0,
        universities_shortlisted: 0,
        extracurriculars_count: 0,
        summer_courses_count: 0,
      });

      if (statsError) {
        console.error("Stats creation error:", statsError);
        // Don't fail the request if stats creation fails
      }
    }

    return ApiResponse.success({ message: "Profile completed successfully" });
  } catch (error: any) {
    console.error("Complete profile error:", error);
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    if (error.message?.includes("table") || error.message?.includes("schema cache")) {
      return ApiResponse.error("Database tables not set up. Please run the setup script in Supabase SQL Editor.", 500);
    }
    return ApiResponse.serverError(error.message || "Failed to complete profile");
  }
}

