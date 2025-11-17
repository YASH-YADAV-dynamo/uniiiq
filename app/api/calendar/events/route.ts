import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    let query = supabaseAdmin
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true });

    if (startDate && endDate) {
      query = query
        .gte("start_time", startDate)
        .lte("end_time", endDate);
    }

    const { data, error } = await query;

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data || []);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Get events error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch events");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, description, start_time, end_time, color } = body;

    if (!title || !start_time || !end_time) {
      return ApiResponse.error("Title, start time, and end time are required", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        start_time,
        end_time,
        color: color || "blue",
      } as any)
      .select()
      .single();

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data, 201);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Create event error:", error);
    return ApiResponse.serverError(error.message || "Failed to create event");
  }
}

