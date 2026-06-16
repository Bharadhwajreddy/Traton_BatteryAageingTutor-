import type { Section } from "@/lib/types";
import { foundations } from "./sections/foundations";
import { mechanisms } from "./sections/mechanisms";
import { calendarVsCycle } from "./sections/calendar-vs-cycle";
import { stressFactors } from "./sections/stress-factors";
import { truckUseCases } from "./sections/truck-use-cases";
import { modelFamilies } from "./sections/model-families";
import { parameterIdentification } from "./sections/parameter-identification";
import { v2gIntegration } from "./sections/v2g-integration";
import { roadmap } from "./sections/roadmap";
import { literature } from "./sections/literature";
import { schmalstieg2014 } from "./sections/schmalstieg2014";

// Order matters only for the suggested learning path; navigation is free.
export const SECTIONS: Section[] = [
  foundations,
  mechanisms,
  calendarVsCycle,
  stressFactors,
  truckUseCases,
  modelFamilies,
  parameterIdentification,
  v2gIntegration,
  roadmap,
  literature,
  schmalstieg2014,
];

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

/** Groups used to lay out the concept map on the home page. */
export const CONCEPT_GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Physics & Mechanisms", slugs: ["foundations", "mechanisms", "calendar-vs-cycle", "stress-factors"] },
  { label: "Application Context", slugs: ["truck-use-cases", "v2g-integration"] },
  { label: "Modelling", slugs: ["model-families", "parameter-identification", "roadmap"] },
  { label: "Research Landscape", slugs: ["literature"] },
  { label: "Key Paper Deep-Dive", slugs: ["schmalstieg-2014"] },
];
