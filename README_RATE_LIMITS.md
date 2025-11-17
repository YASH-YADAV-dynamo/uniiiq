# Removing Rate Limits for Signup

## Current Setup

The signup endpoint (`/api/auth/signup`) already uses the **Supabase Admin Client** (service role key), which bypasses most rate limits. However, Supabase still has some built-in rate limits on authentication endpoints.

## Option 1: Disable Rate Limits in Supabase Dashboard (Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **Project Settings** → **API**
3. Look for **Rate Limiting** or **Auth Rate Limits** settings
4. Disable or increase the rate limits for:
   - Sign up requests
   - Authentication requests
5. Save the changes

**Note:** The exact location of these settings may vary depending on your Supabase plan. On some plans, you may need to contact support to adjust rate limits.

## Option 2: Use Service Role Key (Already Implemented)

The signup route already uses `supabaseAdmin` which uses the service role key. This bypasses most rate limits. The current implementation in `app/api/auth/signup/route.ts` is:

```typescript
import { supabaseAdmin } from "@/lib/supabase/server";

// Uses admin client (bypasses rate limits)
const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
  email,
  password,
  // ...
});
```

## Option 3: Custom Rate Limiting (If Needed)

If you want to implement custom rate limiting logic (e.g., for specific IPs or users), you can add it to the signup route. However, this is not recommended as it would add rate limits rather than remove them.

## Verification

To verify that rate limits are removed:
1. Try signing up multiple users in quick succession
2. Check if you receive any rate limit errors
3. Monitor the Supabase dashboard for any rate limit warnings

## Troubleshooting

If you're still experiencing rate limits:
1. Verify that `SUPABASE_SERVICE_ROLE_KEY` is set correctly in your `.env.local`
2. Check Supabase dashboard for any rate limit settings
3. Review Supabase logs for rate limit errors
4. Consider upgrading your Supabase plan if you need higher limits

