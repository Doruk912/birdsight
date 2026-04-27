import { apiClient } from "@/app/lib/apiClient";
import {
  ObservationMapApiResponse,
  ObservationDetailResponse,
  IdentificationResponse,
  CommentResponse,
  TaxonResponse,
  MapObservation,
  ObservationFilterParams,
  PageResponse,
  UserStatsResponse,
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

function buildFilterParams(filters: ObservationFilterParams): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.grade) params.append("grade", filters.grade);
  if (filters.taxonId) params.append("taxonId", filters.taxonId);
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.notIdentifiedByUserId)
    params.append("notIdentifiedByUserId", filters.notIdentifiedByUserId);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.swLat !== undefined)
    params.append("swLat", filters.swLat.toString());
  if (filters.swLng !== undefined)
    params.append("swLng", filters.swLng.toString());
  if (filters.neLat !== undefined)
    params.append("neLat", filters.neLat.toString());
  if (filters.neLng !== undefined)
    params.append("neLng", filters.neLng.toString());
  return params;
}

/**
 * Fetches map markers from the backend with optional filters.
 */
export async function fetchMapObservations(
  filters: ObservationFilterParams = {},
): Promise<MapObservation[]> {
  const params = buildFilterParams(filters);
  const queryString = params.toString();
  const url = `${API_BASE}/api/v1/observations/map${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch observations: ${response.statusText}`);
  }

  const data: ObservationMapApiResponse[] = await response.json();

  return data.map((obs) => {
    const rankPrefix =
      obs.taxonRank && obs.taxonRank !== "SPECIES"
        ? obs.taxonRank.charAt(0).toUpperCase() +
          obs.taxonRank.slice(1).toLowerCase() +
          " "
        : "";

    const commonName = obs.speciesCommonName;
    const scientificName = obs.speciesScientificName;

    const speciesTitle =
      commonName ||
      (scientificName ? rankPrefix + scientificName : "Unknown species");
    const speciesSubTitle =
      commonName && scientificName ? rankPrefix + scientificName : undefined;

    return {
      id: obs.id,
      species: speciesTitle,
      speciesScientific: speciesSubTitle,
      taxonRank: obs.taxonRank || undefined,
      qualityGrade: obs.qualityGrade,
      latitude: obs.latitude,
      longitude: obs.longitude,
      thumbnailUrl: obs.thumbnailUrl || undefined,
      observedAt: obs.observedAt || undefined,
      identificationCount: obs.identificationCount ?? 0,
      username: obs.username || undefined,
      locationName: obs.locationName || undefined,
    };
  });
}

export async function fetchObservationDetail(
  id: string,
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
  filters: ObservationFilterParams = {},
): Promise<PageResponse<ObservationDetailResponse>> {
  const params = buildFilterParams(filters);
  params.set("page", page.toString());
  params.set("size", "12");

  const response = await fetch(
    `${API_BASE}/api/v1/observations?${params.toString()}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch all observations: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchIdentifications(
  observationId: string,
): Promise<IdentificationResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/observations/${observationId}/identifications`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch identifications: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchComments(
  observationId: string,
): Promise<CommentResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/observations/${observationId}/comments`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }
  return response.json();
}

export async function searchTaxa(query: string): Promise<TaxonResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/taxa?search=${encodeURIComponent(query)}&size=10`,
    { cache: "no-store" },
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.content || [];
}

export async function addComment(
  observationId: string,
  body: string,
): Promise<CommentResponse> {
  return apiClient.post<CommentResponse>(
    `${API_BASE}/api/v1/observations/${observationId}/comments`,
    { body },
  );
}

export async function addIdentification(
  observationId: string,
  taxonId: string,
  comment?: string,
): Promise<IdentificationResponse> {
  return apiClient.post<IdentificationResponse>(
    `${API_BASE}/api/v1/observations/${observationId}/identifications`,
    { taxonId, comment },
  );
}

export async function createObservation(
  formData: FormData,
): Promise<ObservationDetailResponse> {
  return apiClient.postForm<ObservationDetailResponse>(
    `${API_BASE}/api/v1/observations`,
    formData,
  );
}

export async function updateObservation(
  id: string,
  formData: FormData,
): Promise<ObservationDetailResponse> {
  return apiClient.putForm<ObservationDetailResponse>(
    `${API_BASE}/api/v1/observations/${id}`,
    formData,
  );
}

export async function withdrawIdentification(
  observationId: string,
  identificationId: string,
): Promise<void> {
  return apiClient.delete(
    `${API_BASE}/api/v1/observations/${observationId}/identifications/${identificationId}`,
  );
}

export async function fetchUserStats(
  userId: string,
): Promise<UserStatsResponse> {
  const response = await fetch(
    `${API_BASE}/api/v1/observations/user/${userId}/stats`,
    {
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user stats: ${response.statusText}`);
  }
  return response.json();
}
