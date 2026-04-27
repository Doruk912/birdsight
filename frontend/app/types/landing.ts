import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface Observation {
  id: number;
  species: string;
  location: string;
  user: string;
  timeAgo: string;
  badge: string | null;
  badgeColor: string;
  emoji: string;
  gradient: string;
}

export interface HowItWorksStep {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

export interface NavLink {
  label: string;
  href: string;
}

