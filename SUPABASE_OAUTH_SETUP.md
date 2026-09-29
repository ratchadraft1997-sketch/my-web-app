# Google OAuth Setup for Supabase

## Current Setup Status

Your app is now ready for Google OAuth sign-in. To enable Google login in production, follow these steps:

### 1. Supabase Google OAuth Configuration

1. Go to your **Supabase Dashboard** → `Authentication` → `Providers`
2. Search for **Google** and enable it
3. Fill in the Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com)
   - **Client Secret**: Get from Google Cloud Console

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 credential (type: Web application)
3. Add authorized redirect URIs:
   - **Development**: `http://localhost:3000/auth/callback`
   - **Development (LAN)**: `http://172.20.10.3:3000/auth/callback`
   - **Production**: `https://your-production-domain.com/auth/callback`

### 3. Supabase Redirect URL Configuration

After enabling Google provider in Supabase, add your callback URLs:
- Site URL: `http://localhost:3000` (or your production domain)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://172.20.10.3:3000/auth/callback`
  - `https://your-production-domain.com/auth/callback`

### 4. Environment Variables

Your `.env.local` already has:
```
NEXT_PUBLIC_SUPABASE_URL=https://odxhynfeitpbpbsgldsg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

No additional environment variables are needed for the client side.

### 5. Testing

1. Go to `http://172.20.10.3:3000/login`
2. Click **"เข้าสู่ระบบด้วย Gmail"** (Sign in with Gmail)
3. You'll be redirected to Google login
4. After authentication, you'll return to `/auth/callback` and then to `/profile`

### Callback Flow

The OAuth flow works as follows:

```
Login Form → Click Gmail Button
    ↓
signInWithOAuth("google", {
  redirectTo: `${origin}/auth/callback?next=/profile`
})
    ↓
Browser redirects to Google consent screen
    ↓
User authenticates with Google
    ↓
Google redirects to: /auth/callback?code=...&session_id=...
    ↓
exchangeCodeForSession(code) → Creates Supabase session
    ↓
Redirects to /profile (or the "next" parameter URL)
```

### Troubleshooting

**Issue**: "Invalid redirect_uri"
- **Solution**: Ensure your redirect URL is exactly configured in both Google Cloud Console and Supabase

**Issue**: User redirects back to login after Google OAuth
- **Solution**: Check that the OAuth callback is being processed correctly in `/auth/callback`

**Issue**: Session not persisting after OAuth
- **Solution**: Verify that cookies are enabled in the browser (SameSite=Lax should work)

---

## Demo Account (Fallback)

If Google OAuth is not configured, users can still use the **"ใช้บัญชีทดลอง"** (Demo Account) option:
- Email: `traveler@nakhonnayok.app`
- No password required—one-click login

---

## Current Implementation

✅ LoginForm handles both OAuth and demo login  
✅ Callback route exchanges auth code for session  
✅ Middleware protects routes and manages session  
✅ Profile page accepts demo user sessions  

