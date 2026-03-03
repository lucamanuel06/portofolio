import { redirect } from "next/navigation";
import { setAdminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    redirect("/admin/login?error=ADMIN_PASSWORD%20not%20set");
  }

  if (password !== expected) {
    redirect("/admin/login?error=Wrong%20password");
  }

  await setAdminCookie();

  const next = String(formData.get("next") || "/admin/projects");
  redirect(next);
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="min-h-screen mx-auto container p-6">
      <h1 className="text-3xl font-bold mb-2">Admin login</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Log in to manage projects.
      </p>

      {error ? (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <form action={loginAction} className="max-w-md flex flex-col gap-3">
        <input type="hidden" name="next" value={next || "/admin/projects"} />

        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded border px-3 py-2"
          autoFocus
          required
        />

        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
