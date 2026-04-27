import {
  Binoculars,
  CloudUpload,
  Cpu,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { HowItWorksStep } from "@/app/types/landing";

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    icon: Binoculars,
    title: "Spot a bird",
    description:
      "You're out in the field. You see something interesting: note the habitat, behaviour, and snap a photo.",
    accent: "text-amber-600 bg-amber-50 border-amber-200",
    image: "/images/how-it-works/step_1.png",
  },
  {
    step: 2,
    icon: CloudUpload,
    title: "Log & upload",
    description:
      "Open BirdSight, add your photo, GPS location, date, and any field notes. Your observation is recorded in seconds.",
    accent: "text-sky-600 bg-sky-50 border-sky-200",
    image: "/images/how-it-works/step_2.png",
  },
  {
    step: 3,
    icon: Cpu,
    title: "AI suggests a species",
    description:
      "Our computer vision model analyses your photo and proposes the most likely species, ranked by confidence.",
    accent: "text-violet-600 bg-violet-50 border-violet-200",
    image: "/images/how-it-works/step_3.png",
  },
  {
    step: 4,
    icon: MessageCircle,
    title: "Community discusses",
    description:
      "Other birders review your observation, add notes, and suggest alternative identifications if needed.",
    accent: "text-teal-600 bg-teal-50 border-teal-200",
    image: "/images/how-it-works/step_4.png",
  },
  {
    step: 5,
    icon: CheckCircle,
    title: "Observation confirmed",
    description:
      "Once the community reaches consensus, the sighting is verified and contributes to global biodiversity data.",
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    image: "/images/how-it-works/step_5.png",
  },
];
