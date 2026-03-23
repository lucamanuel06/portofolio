// Importeer de redirect functie van Next.js voor server-side omleiding
import { redirect } from "next/navigation";

// Admin indexpagina — stuurt de gebruiker direct door naar de projectenpagina
export default function AdminIndexPage() {
  // Stuur de gebruiker onmiddellijk door naar de admin projectenpagina
  redirect("/admin/projects");
}
