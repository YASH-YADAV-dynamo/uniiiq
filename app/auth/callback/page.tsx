"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error in URL
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      
      if (error) {
        router.push(`/signin?error=${error}${errorDescription ? `&message=${encodeURIComponent(errorDescription)}` : ""}`);
        return;
      }

      try {
        // With detectSessionInUrl: true, Supabase automatically processes the OAuth callback
        // Wait a moment for Supabase to process the URL and exchange the code
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the session (Supabase should have automatically exchanged the code)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          localStorage.setItem("supabase_token", session.access_token);
          // Use window.location for a hard redirect to ensure it works on Vercel
          window.location.href = "/preferences";
        } else {
          // If still no session, wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) {
            localStorage.setItem("supabase_token", retrySession.access_token);
            window.location.href = "/preferences";
          } else {
            router.push("/signin?error=no_session&message=Authentication failed. Please try again.");
          }
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        router.push(`/signin?error=auth_failed&message=${encodeURIComponent(err.message || "Authentication failed")}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

