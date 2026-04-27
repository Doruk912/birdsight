import { apiClient } from "@/app/lib/apiClient";
import {
  TaxonResponse,
  TaxonDetailResponse,
  UpdateTaxonRequest,
  PageResponse,
} from "@/app/types/explore";

// Resolve per-call so SSR can use API_URL while browser can use NEXT_PUBLIC_API_URL or rewrites.
function resolveApiBase(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL || "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "";
}

function buildApiUrl(path: string, baseOverride?: string): string {
  const base = baseOverride ?? resolveApiBase();

  if (base) {
    return `${base}${path}`;
  }

  // Browser fetch accepts relative URLs and can rely on Next.js rewrites.
  if (typeof window !== "undefined") {
    return path;
  }

  throw new Error(
    "Missing API base URL on the server. Set API_URL or pass a baseOverride.",
  );
}

export async function fetchTaxonDetail(
  id: string,
): Promise<TaxonDetailResponse> {
  const response = await fetch(buildApiUrl(`/api/v1/taxa/${id}/detail`), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch taxon detail: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTaxonChildren(id: string): Promise<TaxonResponse[]> {
  const response = await fetch(buildApiUrl(`/api/v1/taxa/${id}/children`), {
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

export async function fetchRootTaxon(
  baseOverride?: string,
): Promise<TaxonResponse> {
  const response = await fetch(buildApiUrl("/api/v1/taxa/root", baseOverride), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch root taxon: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTaxaBrowse(params: {
  rank?: string;
  parentId?: string;
  search?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<TaxonResponse>> {
  const searchParams = new URLSearchParams();
  if (params.rank) searchParams.append("rank", params.rank);
  if (params.parentId) searchParams.append("parentId", params.parentId);
  if (params.search) searchParams.append("search", params.search);
  if (params.page !== undefined)
    searchParams.append("page", params.page.toString());
  if (params.size !== undefined)
    searchParams.append("size", params.size.toString());

  const response = await fetch(
    buildApiUrl(`/api/v1/taxa/browse?${searchParams.toString()}`),
    {
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to browse taxa: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchObservationCount(taxonId: string): Promise<number> {
  const response = await fetch(
    buildApiUrl(`/api/v1/taxa/${taxonId}/observation-count`),
    {
      cache: "no-store",
    },
  );
  if (!response.ok) return 0;
  return response.json();
}

export async function updateTaxon(
  id: string,
  data: UpdateTaxonRequest,
): Promise<TaxonDetailResponse> {
  return apiClient.put<TaxonDetailResponse>(
    buildApiUrl(`/api/v1/taxa/${id}`),
    data,
  );
}
