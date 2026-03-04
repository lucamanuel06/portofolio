import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearAdminCookie();

  // Use a relative redirect so it works behind proxies (Coolify) and in dev.
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/admin/login",
    },
  });
}
