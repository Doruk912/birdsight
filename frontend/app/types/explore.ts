export interface MapObservation {
  id: string;
  species: string;
  speciesScientific?: string;
  location: string;
  user: string;
  timeAgo: string;
  qualityGrade: "NEEDS_ID" | "RESEARCH_GRADE";
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ObservationMapApiResponse {
  id: string;
  latitude: number;
  longitude: number;
  speciesCommonName: string | null;
  speciesScientificName: string | null;
  qualityGrade: "NEEDS_ID" | "RESEARCH_GRADE";
  thumbnailUrl: string | null;
}

export interface ObservationDetailResponse {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl: string | null;
  description: string | null;
  observedAt: string;
  latitude: number;
  longitude: number;
  locationName: string | null;
  communityTaxon: TaxonResponse | null;
  qualityGrade: "NEEDS_ID" | "RESEARCH_GRADE";
  images: ObservationImageResponse[];
  identificationCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ObservationImageResponse {
  id: string;
  imageUrl: string;
  position: number;
  createdAt: string;
}

export interface TaxonResponse {
  id: string;
  rank: "CLASS" | "ORDER" | "FAMILY" | "GENUS" | "SPECIES";
  scientificName: string;
  commonName: string | null;
  parentId: string | null;
  observationCount?: number;
  coverImageUrl?: string | null;
}

export interface TopObserverDto {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  observationCount: number;
}

export interface TopIdentifierDto {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  identificationCount: number;
}

export interface TaxonDetailResponse {
  id: string;
  rank: "CLASS" | "ORDER" | "FAMILY" | "GENUS" | "SPECIES";
  scientificName: string;
  commonName: string | null;
  parentId: string | null;
  observationCount: number;
  ancestors: TaxonResponse[];
  children: TaxonResponse[];
  coverImageUrl: string | null;
  recentObservations: { id: string; imageUrl: string }[];
  topObserver?: TopObserverDto;
  topIdentifier?: TopIdentifierDto;
}

export interface UpdateTaxonRequest {
  coverImageUrl?: string;
}

export interface IdentificationResponse {
  id: string;
  observationId: string;
  userId: string;
  username: string;
  userAvatarUrl: string | null;
  taxonId: string;
  taxonScientificName: string;
  taxonCommonName: string | null;
  taxonRank: "CLASS" | "ORDER" | "FAMILY" | "GENUS" | "SPECIES";
  taxonCoverImageUrl: string | null;
  comment: string | null;
  current: boolean;
  withdrawn: boolean;
  disagreeing?: boolean;
  createdAt: string;
}

export interface CommentResponse {
  id: string;
  observationId: string;
  userId: string;
  username: string;
  userAvatarUrl: string | null;
  body: string;
  createdAt: string;
}

export interface MLPrediction {
  species: string;
  commonName: string | null;
  confidence: number;
  taxonId: string | null;
  coverImageUrl?: string | null;
}

export interface MLPredictionResponse {
  predictions: MLPrediction[];
}

export interface ObservationFilterParams {
  search?: string;
  grade?: string;
  taxonId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
}

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}
