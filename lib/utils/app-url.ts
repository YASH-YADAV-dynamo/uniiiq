/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to window.location.origin
 */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use env variable or current origin
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  
  // Server-side: use env variable or default to localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

