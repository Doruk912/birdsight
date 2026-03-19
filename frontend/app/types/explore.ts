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
  rank: "ORDER" | "FAMILY" | "GENUS" | "SPECIES";
  scientificName: string;
  commonName: string | null;
  parentId: string | null;
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
  taxonRank: "ORDER" | "FAMILY" | "GENUS" | "SPECIES";
  comment: string | null;
  current: boolean;
  withdrawn: boolean;
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
