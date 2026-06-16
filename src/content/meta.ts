// Visual + pedagogical metadata per section: icon, accent colour theme,
// and "what you'll be able to do" takeaways shown at the top of each page.
// Class names are written out literally so Tailwind can see them.

export interface SectionMeta {
  icon: string;
  /** gradient band behind the section header */
  gradient: string;
  /** accent text colour */
  text: string;
  /** border accent */
  border: string;
  /** soft background chip */
  chip: string;
  takeaways: string[];
}

export const SECTION_META: Record<string, SectionMeta> = {
  foundations: {
    icon: "🧭",
    gradient: "from-sky-500/25 via-sky-500/10 to-transparent",
    text: "text-sky-300",
    border: "border-sky-500/40",
    chip: "bg-sky-500/15 text-sky-300",
    takeaways: [
      "Explain why SoC is an estimate, not a measurement — and why LFP's flat OCV curve makes it genuinely hard",
      "Distinguish capacity-SoH from resistance/power-SoH and pick the right one for a truck question",
      "Treat 80 % EOL as a convention to be justified, not a law of nature",
    ],
  },
  mechanisms: {
    icon: "⚛️",
    gradient: "from-rose-500/25 via-rose-500/10 to-transparent",
    text: "text-rose-300",
    border: "border-rose-500/40",
    chip: "bg-rose-500/15 text-rose-300",
    takeaways: [
      "Sort any degradation phenomenon into LLI, LAM, or impedance rise — and know which mechanisms feed which bucket",
      "Explain why SEI growth gives √t fade and why lithium plating is a different (and more dangerous) animal",
      "Predict how NMC and LFP age differently from their cathode chemistry and voltage curves",
    ],
  },
  "calendar-vs-cycle": {
    icon: "⏳",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
    text: "text-amber-300",
    border: "border-amber-500/40",
    chip: "bg-amber-500/15 text-amber-300",
    takeaways: [
      "Separate what ages a parked truck from what ages a driven one — and why parking dominates total life",
      "Write down the standard superposition model and name three ways it breaks",
      "Design storage vs cycling tests that can actually disentangle the two contributions",
    ],
  },
  "stress-factors": {
    icon: "🌡️",
    gradient: "from-orange-500/25 via-orange-500/10 to-transparent",
    text: "text-orange-300",
    border: "border-orange-500/40",
    chip: "bg-orange-500/15 text-orange-300",
    takeaways: [
      "Quantify temperature acceleration with Arrhenius — and know exactly where the 2×/10 K rule fails",
      "Explain why the cycle-ageing-vs-temperature curve is U-shaped (hot chemistry vs cold plating)",
      "Trace the electro-thermal feedback loop that makes aged packs age faster",
    ],
  },
  "truck-use-cases": {
    icon: "🚛",
    gradient: "from-lime-500/25 via-lime-500/10 to-transparent",
    text: "text-lime-300",
    border: "border-lime-500/40",
    chip: "bg-lime-500/15 text-lime-300",
    takeaways: [
      "Translate duty cycles (long-haul, regional, urban) into FEC/day, charge power, and rest patterns",
      "Argue chemistry choice (NMC vs LFP) per duty-cycle archetype",
      "Explain why passenger-car ageing studies do not transfer 1:1 to trucks",
    ],
  },
  "model-families": {
    icon: "🧩",
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
    text: "text-violet-300",
    border: "border-violet-500/40",
    chip: "bg-violet-500/15 text-violet-300",
    takeaways: [
      "Place any ageing model on the physics-content ladder: throughput → semi-empirical → mechanistic → ML",
      "Critique pure Ah-throughput models and justify why V2G work needs stress-factor sensitivity",
      "Match model family to question: BMS estimation, warranty, dispatch optimisation, or cell design",
    ],
  },
  "parameter-identification": {
    icon: "🧪",
    gradient: "from-fuchsia-500/25 via-fuchsia-500/10 to-transparent",
    text: "text-fuchsia-300",
    border: "border-fuchsia-500/40",
    chip: "bg-fuchsia-500/15 text-fuchsia-300",
    takeaways: [
      "Design a calendar + cycle test matrix (and know why factorial designs explode)",
      "Run the fitting workflow: per-condition curves → stress-factor regression → dynamic-profile validation",
      "Spot identifiability traps: acceleration changing the mechanism, calendar contamination, sparse grids",
    ],
  },
  "v2g-integration": {
    icon: "⚡",
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
    text: "text-emerald-300",
    border: "border-emerald-500/40",
    chip: "bg-emerald-500/15 text-emerald-300",
    takeaways: [
      "Turn degradation into a marginal €/kWh cost — and immediately critique the linear version",
      "Rank grid services by ageing intensity and explain why throughput pricing misprices them",
      "Embed an ageing model into a dispatch optimiser (simulation-in-loop vs linearised cost term)",
    ],
  },
  roadmap: {
    icon: "🗺️",
    gradient: "from-cyan-500/25 via-cyan-500/10 to-transparent",
    text: "text-cyan-300",
    border: "border-cyan-500/40",
    chip: "bg-cyan-500/15 text-cyan-300",
    takeaways: [
      "Walk the 5-step pipeline: question → model family → data → identification → V2G integration",
      "Use the decision tree to defend your model choice in a thesis colloquium",
      "Leave with a deliverables checklist you can lift straight into a thesis plan",
    ],
  },
  literature: {
    icon: "📚",
    gradient: "from-indigo-500/25 via-indigo-500/10 to-transparent",
    text: "text-indigo-300",
    border: "border-indigo-500/40",
    chip: "bg-indigo-500/15 text-indigo-300",
    takeaways: [
      "Navigate the literature by category instead of drowning in search results",
      "Screen any ageing paper in five minutes with the six-point checklist",
      "Spot the heavy-duty literature gap — and the thesis opportunity inside it",
    ],
  },
  "schmalstieg-2014": {
    icon: "🏛️",
    gradient: "from-yellow-500/25 via-yellow-500/10 to-transparent",
    text: "text-yellow-300",
    border: "border-yellow-500/40",
    chip: "bg-yellow-500/15 text-yellow-300",
    takeaways: [
      "Explain the Schmalstieg 2014 model structure — calendar, cycle, superposition — from first principles",
      "Derive why t^0.75 appears (not √t) and what it tells you about SEI growth in NMC/graphite",
      "Describe the electrothermal feedback loop and why it is essential for truck/V2G simulation",
      "Critically assess what the model cannot predict (sudden death, plating, C-rate) and which extensions address each gap",
      "Follow the step-by-step fitting recipe to re-parameterise the model for a new cell",
    ],
  },
};

export const GROUP_THEME: Record<string, { icon: string; text: string; bar: string }> = {
  "Physics & Mechanisms": { icon: "⚛️", text: "text-rose-300", bar: "bg-rose-400" },
  "Application Context": { icon: "🚛", text: "text-lime-300", bar: "bg-lime-400" },
  "Modelling": { icon: "🧩", text: "text-violet-300", bar: "bg-violet-400" },
  "Research Landscape": { icon: "📚", text: "text-indigo-300", bar: "bg-indigo-400" },
  "Key Paper Deep-Dive": { icon: "🏛️", text: "text-yellow-300", bar: "bg-yellow-400" },
};
