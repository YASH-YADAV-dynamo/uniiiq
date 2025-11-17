import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return ApiResponse.error("Email and password are required", 400);
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return ApiResponse.error(error.message, 401);
    }

    if (!data.user || !data.session) {
      return ApiResponse.error("Failed to sign in", 500);
    }

    return ApiResponse.success({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    return ApiResponse.serverError(error.message || "Failed to sign in");
  }
}

