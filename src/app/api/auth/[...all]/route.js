export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function handleAuthRequest(request, method) {
  const { getAuth } = await import("@/lib/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const handler = toNextJsHandler(getAuth());
  return handler[method](request);
}

export function GET(request) {
  return handleAuthRequest(request, "GET");
}

export function POST(request) {
  return handleAuthRequest(request, "POST");
}
