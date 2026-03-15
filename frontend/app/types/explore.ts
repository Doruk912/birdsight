export interface MapObservation {
  id: number;
  species: string;
  speciesScientific?: string;
  location: string;
  user: string;
  timeAgo: string;
  badge: string | null;
  badgeColor: string;
  emoji: string;
  latitude: number;
  longitude: number;
}
