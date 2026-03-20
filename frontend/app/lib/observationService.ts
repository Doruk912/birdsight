import { apiClient } from "@/app/lib/apiClient";
import {
  ObservationMapApiResponse,
  ObservationDetailResponse,
  IdentificationResponse,
  CommentResponse,
  TaxonResponse,
  MapObservation,
} from "@/app/types/explore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Fetches map markers from the backend. Does NOT require authentication.
 */
export async function fetchMapObservations(): Promise<MapObservation[]> {
  const response = await fetch(`${API_BASE}/api/v1/observations/map`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch observations: ${response.statusText}`);
  }

  const data: ObservationMapApiResponse[] = await response.json();

  return data.map((obs) => ({
    id: obs.id,
    species: obs.speciesCommonName || "Unknown species",
    speciesScientific: obs.speciesScientificName || undefined,
    location: "", // Map endpoint doesn't include location name; kept lean
    user: "",     // Map endpoint doesn't include user; kept lean
    timeAgo: "",
    qualityGrade: obs.qualityGrade,
    latitude: obs.latitude,
    longitude: obs.longitude,
    thumbnailUrl: obs.thumbnailUrl || undefined,
  }));
}

export async function fetchObservationDetail(
  id: string
): Promise<ObservationDetailResponse> {
  const response = await fetch(`${API_BASE}/api/v1/observations/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch observation: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAllObservations(
  page: number = 0,
  search?: string,
  grade?: string
): Promise<import("@/app/types/explore").PageResponse<ObservationDetailResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: "12",
  });
  if (search) params.append("search", search);
  if (grade) params.append("grade", grade);

  const response = await fetch(`${API_BASE}/api/v1/observations?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch all observations: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchIdentifications(
  observationId: string
): Promise<IdentificationResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/observations/${observationId}/identifications`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch identifications: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchComments(
  observationId: string
): Promise<CommentResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/observations/${observationId}/comments`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }
  return response.json();
}

export async function searchTaxa(query: string): Promise<TaxonResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/taxa?search=${encodeURIComponent(query)}&size=10`,
    { cache: "no-store" }
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.content || [];
}

export async function addComment(observationId: string, body: string): Promise<CommentResponse> {
  return apiClient.post<CommentResponse>(
    `${API_BASE}/api/v1/observations/${observationId}/comments`,
    { body }
  );
}

export async function addIdentification(
  observationId: string,
  taxonId: string,
  comment?: string
): Promise<IdentificationResponse> {
  return apiClient.post<IdentificationResponse>(
    `${API_BASE}/api/v1/observations/${observationId}/identifications`,
    { taxonId, comment }
  );
}
