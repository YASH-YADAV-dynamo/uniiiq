import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success(data || []);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Get chat history error:", error);
    return ApiResponse.serverError(error.message || "Failed to fetch chat history");
  }
}

