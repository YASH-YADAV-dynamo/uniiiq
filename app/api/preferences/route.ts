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
    const body = await request.json();
    const { personal_info, academic_preferences, goals, budget } = body;

    // Check if preferences exist
    const { data: existing } = await supabaseAdmin
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .single();

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

