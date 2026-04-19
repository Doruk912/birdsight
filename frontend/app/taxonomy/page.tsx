import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchRootTaxon } from "@/app/lib/taxonomyService";

function getRequestOriginFromHeaders(requestHeaders: Headers): string | null {
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

  if (!host) {
    return null;
  }

  const protocol = requestHeaders.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export default async function TaxonomyIndexPage() {
  const requestHeaders = await headers();
  const requestOrigin = getRequestOriginFromHeaders(requestHeaders);
  const serverBase = process.env.API_URL || requestOrigin || undefined;

  const root = await fetchRootTaxon(serverBase);
  redirect(`/taxonomy/${root.id}`);
}
