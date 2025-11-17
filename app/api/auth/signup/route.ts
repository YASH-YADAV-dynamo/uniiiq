import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;
    const countryCode = formData.get("countryCode") as string;
    const profilePicture = formData.get("profilePicture") as File | null;
    const subscribeNewsletter = formData.get("subscribeNewsletter") === "true";

    // Validate required fields
    if (!email || !password) {
      return ApiResponse.error("Email and password are required", 400);
    }

    // Create user in Supabase Auth using Admin API (bypasses rate limits)
    // Using admin.auth.admin.createUser() instead of auth.signUp() to bypass rate limits
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to bypass email verification
      user_metadata: {
        full_name: name,
        mobile: mobile,
        country_code: countryCode,
      },
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return ApiResponse.error(authError.message, 400);
    }

    if (!authData.user) {
      return ApiResponse.error("Failed to create user", 500);
    }

    // Create a session for the user since admin.createUser doesn't return a session
    // Sign in the user to get a session (using admin client bypasses rate limits)
    let session = null;
    try {
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInData?.session) {
        session = signInData.session;
      } else if (signInError) {
        console.warn("Session creation warning (non-critical):", signInError);
        // Continue without session - user can sign in later
      }
    } catch (sessionErr) {
      console.warn("Session creation warning (non-critical):", sessionErr);
      // Continue without session - user can sign in later
    }

    // Upload profile picture if provided
    let profilePictureUrl = null;
    if (profilePicture && profilePicture.size > 0) {
      try {
        const fileExt = profilePicture.name.split(".").pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
        const fileBuffer = await profilePicture.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("profile-pictures")
          .upload(fileName, fileBuffer, {
            contentType: profilePicture.type,
          });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from("profile-pictures")
            .getPublicUrl(fileName);
          profilePictureUrl = publicUrl;
        }
      } catch (uploadErr) {
        console.error("Profile picture upload error:", uploadErr);
        // Continue without profile picture if upload fails
      }
    }

    // Create user profile in database
    const { error: profileError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        full_name: name,
        mobile: mobile || null,
        country_code: countryCode || null,
        profile_picture_url: profilePictureUrl,
        subscribe_newsletter: subscribeNewsletter || false,
      } as any);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // User is created in auth, but profile creation failed
      // This is not critical, but should be logged
    }

    // Initialize dashboard stats
    await supabaseAdmin.from("dashboard_stats").insert({
      user_id: authData.user.id,
      academics_count: 0,
      research_work_count: 0,
      competitions_count: 0,
      universities_shortlisted: 0,
      extracurriculars_count: 0,
      summer_courses_count: 0,
    } as any);

    return ApiResponse.success({
      user: authData.user,
      session: session, // Use the session we created, or null if email confirmation is required
    }, 201);
  } catch (error: any) {
    console.error("Signup error:", error);
    return ApiResponse.serverError(error.message || "Failed to create account");
  }
}

