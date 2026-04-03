import { redirect } from "next/navigation";
import { fetchRootTaxon } from "@/app/lib/taxonomyService";

export default async function TaxonomyIndexPage() {
  const root = await fetchRootTaxon();
  redirect(`/taxonomy/${root.id}`);
}

