import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "./response";

export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

