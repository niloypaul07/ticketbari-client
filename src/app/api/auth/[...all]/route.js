import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let handler;

function getHandler() {
  if (!handler) {
    handler = toNextJsHandler(getAuth());
  }
  return handler;
}

export async function GET(request) {
  return getHandler().GET(request);
}

export async function POST(request) {
  return getHandler().POST(request);
}
