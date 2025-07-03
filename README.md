# Clerk TikTok OAuth Token Bug - Minimal Reproduction

This repository demonstrates a critical bug where Clerk's `getUserOauthAccessToken()` method fails to retrieve TikTok OAuth tokens after ~24 hours, returning `oauth_token_retrieval_error` despite the user maintaining an active TikTok connection.

## 🐛 The Bug

```typescript
// This works initially but fails after 24 hours
await clerkClient.users.getUserOauthAccessToken(userId, "tiktok");
```

**Error Response After 24 Hours:**
```json
{
  "error": "Token retrieval failed",
  "code": "oauth_token_retrieval_error",
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

**Impact:** Users must reconnect TikTok daily, making the OAuth integration unusable for production applications.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.local.example .env.local
# Add your Clerk keys to .env.local

# Run the app
bun start
```

## 📋 Prerequisites & Setup

### 1. Clerk Configuration

1. Create an app at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Navigate to **Configure → SSO Connections**
3. Enable **TikTok** OAuth provider
4. Add TikTok credentials:
   - Client ID (from TikTok)
   - Client Secret (from TikTok)
5. Copy your API keys from **API Keys** section

### 2. TikTok Developer Setup

1. Create an app at [developers.tiktok.com](https://developers.tiktok.com)
2. Configure OAuth settings:
   - Add Clerk's redirect URL
   - Enable scope: `user.info.basic`
3. Copy Client Key & Secret for Clerk

### 3. Environment Variables

Create `.env.local`:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

## 🧪 Testing the Bug

### Step 1: Initial Test (✅ Works)
1. Sign in with TikTok using the app
2. Click "Retrieve OAuth Token (Backend)"
3. Token retrieval succeeds

### Step 2: 24-Hour Test (❌ Fails)
1. Wait 24+ hours (do not disconnect TikTok)
2. Click "Retrieve OAuth Token (Backend)" again
3. Observe `oauth_token_retrieval_error`

### 📊 Persistent Logging
The app includes persistent logging with:
- All token retrieval attempts saved to AsyncStorage
- Collapsible log entries with smooth animations
- Success/failure indicators with timestamps
- Clear button to reset logs
- Keeps last 50 attempts for debugging

## 📁 Project Structure

```
app/
├── _layout.tsx              # Main app layout and authentication logic
├── api/
│   └── oauth-token+api.ts   # Backend endpoint demonstrating the bug
└── hooks/
    └── useTokenLogs.ts      # Custom hook for log management

components/
├── SignInScreen.tsx         # Sign-in UI component
├── UserStatusCard.tsx       # User status display component
├── ActionButtons.tsx        # Action buttons component
├── LogsSection.tsx          # Logs history section
└── LogEntryItem.tsx         # Individual log entry with animations
```

### Key Code Location

The bug occurs in `app/api/oauth-token+api.ts`:
```typescript
const tokens = await clerkClient.users.getUserOauthAccessToken(
  userId,
  "tiktok"
);
```

## 🔍 Technical Details

- **TikTok Access Token Lifetime:** 24 hours
- **TikTok Refresh Token Lifetime:** 365 days
- **Expected Behavior:** Clerk should automatically use the refresh token to obtain new access tokens
- **Actual Behavior:** Clerk fails to refresh, requiring manual reconnection

## 🛠 Troubleshooting

### Common Issues

1. **"Invalid OAuth callback"**
   - Ensure redirect URLs match exactly in both TikTok and Clerk
   - Check app scheme configuration

2. **"Provider not enabled"**
   - Verify TikTok is enabled in Clerk dashboard
   - Ensure credentials are saved

3. **"Network request failed"**
   - Check device can reach development server
   - Verify firewall settings

### Debugging

The backend API includes logging for:
- Token fetch attempts
- Error details with timestamps
- Success/failure states

Monitor console output when testing token retrieval.

## 📞 Support

- **Bug Reports:** Open an issue in this repository
- **Clerk Support:** Reference this reproduction when contacting support
- **TikTok OAuth Docs:** [developers.tiktok.com/doc/login-kit-web](https://developers.tiktok.com/doc/login-kit-web)