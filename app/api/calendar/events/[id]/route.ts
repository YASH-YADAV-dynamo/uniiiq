import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { title, description, start_time, end_time, color } = body;

    const { data, error } = await (supabaseAdmin
      .from("calendar_events") as any)
      .update({
        title,
        description,
        start_time,
        end_time,
        color,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    if (!data) {
      return ApiResponse.notFound("Event not found");
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Update event error:", error);
    return ApiResponse.serverError(error.message || "Failed to update event");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success({ message: "Event deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Delete event error:", error);
    return ApiResponse.serverError(error.message || "Failed to delete event");
  }
}

