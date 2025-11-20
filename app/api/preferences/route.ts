import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { data, error } = await supabaseAdmin
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No preferences found, return empty object
        return ApiResponse.success({
          personal_info: null,
          academic_preferences: null,
          goals: null,
          budget: null,
        });
      }
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Get preferences error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch preferences");
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
    
    const { personal_info, academic_preferences, goals, budget } = body;

    // Log the received data structure for verification
    console.log("Saving preferences for user:", user.id);
    console.log("Personal Info fields:", personal_info ? Object.keys(personal_info) : "null");
    console.log("Academic Preferences fields:", academic_preferences ? Object.keys(academic_preferences) : "null");
    console.log("Goals fields:", goals ? Object.keys(goals) : "null");
    console.log("Budget fields:", budget ? Object.keys(budget) : "null");

    // Ensure user exists in users table (required for foreign key constraint)
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (userCheckError) {
      console.error("User check error:", userCheckError);
      return ApiResponse.error(`Failed to verify user: ${userCheckError.message}`, 400);
    }

    // If user doesn't exist, create it
    if (!existingUser) {
      console.log("User not found in users table, creating profile...");
      const { error: createUserError } = await supabaseAdmin
        .from("users")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          profile_picture_url: user.user_metadata?.avatar_url || null,
          subscribe_newsletter: false,
        } as any);

      if (createUserError) {
        console.error("Failed to create user profile:", createUserError);
        return ApiResponse.error(`Failed to create user profile: ${createUserError.message}`, 400);
      }
      console.log("User profile created successfully");
    }

    // Check if preferences exist - use maybeSingle to avoid error when no record exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Check preferences error:", checkError);
      return ApiResponse.error(checkError.message, 400);
    }

    if (existing) {
      // Update existing
      const { data, error } = await (supabaseAdmin
        .from("user_preferences") as any)
        .update({
          personal_info: personal_info || null,
          academic_preferences: academic_preferences || null,
          goals: goals || null,
          budget: budget || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return ApiResponse.error(error.message, 400);
      }

      return ApiResponse.success(data);
    } else {
      // Create new
      const { data, error } = await supabaseAdmin
        .from("user_preferences")
        .insert({
          user_id: user.id,
          personal_info: personal_info || null,
          academic_preferences: academic_preferences || null,
          goals: goals || null,
          budget: budget || null,
        } as any)
        .select()
        .single();

      if (error) {
        return ApiResponse.error(error.message, 400);
      }

      return ApiResponse.success(data, 201);
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Save preferences error:", error);
    return ApiResponse.serverError(error.message || "Failed to save preferences");
  }
}

