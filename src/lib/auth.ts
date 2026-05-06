import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const ADMIN_COOKIE_NAME = "dany-admin-session";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Informe a senha do painel."),
});

export async function isAdminAuthenticated() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return sessionCookie === adminPassword;
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }
}
