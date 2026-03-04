import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await clearAdminCookie();

  const url = new URL(request.url);
  url.pathname = "/admin/login";
  url.search = "";

  return NextResponse.redirect(url);
}
