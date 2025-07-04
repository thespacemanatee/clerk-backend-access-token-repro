import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

export async function GET(request: Request) {
  const { userId, isAuthenticated } = (
    await clerkClient.authenticateRequest(request)
  ).toAuth()!;

  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Fetching TikTok OAuth token for user: ${userId}`
    );

    const tokens = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "tiktok"
    );

    console.log(`[${new Date().toISOString()}] Success:`, {
      tokenCount: tokens.data.length,
      hasToken: tokens.data.length > 0 && !!tokens.data[0].token,
    });

    return Response.json({
      success: true,
      tokens: tokens.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] OAuth token error`);
    if (error && typeof error === "object" && "status" in error) {
      return Response.json(
        {
          error,
          code: error.errors[0].code,
          timestamp: new Date().toISOString(),
        },
        { status: error.status as number }
      );
    }

    return Response.json(
      {
        error: error.message || "Failed to fetch OAuth token",
        code: error.code || "unknown_error",
        timestamp: new Date().toISOString(),
      },
      { status: error.status || 500 }
    );
  }
}
