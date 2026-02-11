

# Fix Account Signup (422 Error)

## Root Cause

The 422 error from Supabase `/auth/v1/signup` is a server-side rejection. Your database already contains 6 registered users, so the issue is either:

1. You are trying to sign up with an already-registered email
2. Supabase Auth settings need configuration updates

The browser extension errors (utils.js, tabutils.js, etc.) are unrelated -- they come from a browser extension, not your app.

## Fix Plan

### Step 1: Verify Supabase Auth Provider Settings

You need to check your Supabase Dashboard manually:

- Go to **Authentication > Providers** in your Supabase dashboard
- Confirm **Email provider is enabled**
- Confirm "Enable Sign Up" toggle is ON (if this is OFF, no new signups are allowed)
- For Google OAuth: confirm Google provider is enabled with valid Client ID and Secret

### Step 2: Check URL Configuration

In Supabase Dashboard under **Authentication > URL Configuration**:

- **Site URL** should be set to: `https://omni-flow-create-spark.lovable.app`
- **Redirect URLs** should include:
  - `https://omni-flow-create-spark.lovable.app/**`
  - `https://omniwellnessmedia.co.za/**` (if using custom domain)
  - `http://localhost:3000/**` (for local dev)

### Step 3: Improve Error Handling in Code

Update the signup error handler in `src/pages/Auth.tsx` to show the actual Supabase error message instead of generic text. This will reveal the exact 422 reason (e.g., "Signups not allowed for this instance" or "User already registered").

**Change:** In the `handleSignUp` function, log and display the full `error.message` from Supabase so you can see exactly why signup is being rejected.

### Step 4: Add Duplicate Email Detection

Add a clearer check for "already registered" errors and guide users to the Sign In tab instead.

## Technical Details

**Files to modify:**
- `src/pages/Auth.tsx` -- Improve error messages in `handleSignUp` to surface the exact 422 reason

**No database changes needed** -- the issue is in Supabase Auth configuration, not the database schema.

## Priority Action (Before Code Changes)

The most likely fix is a **Supabase Dashboard setting**. Before any code changes:

1. Open https://supabase.com/dashboard/project/dtjmhieeywdvhjxqyxad/auth/providers
2. Verify Email provider has "Enable Sign Up" toggled ON
3. Open https://supabase.com/dashboard/project/dtjmhieeywdvhjxqyxad/auth/url-configuration
4. Verify Site URL and Redirect URLs are correct

If signups were accidentally disabled, re-enabling them will fix the 422 instantly with no code changes needed.

