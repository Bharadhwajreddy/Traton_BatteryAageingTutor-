// Content type system for the BatteryAgeTutor concept-map app.
//
// Every learning section is a list of Blocks. Blocks carry a `depth`:
//   - "core"   : always visible (default postdoc-level explanation)
//   - "deeper" : only visible when the page-level "Go deeper" toggle is on
// Core text blocks may carry an optional `clarify` variant that replaces the
// main text when the page-level "Clarify" mode is on (simpler wording,
// more analogies, fewer equations).
//
// Inline markup supported by the text renderer (see Blocks.tsx):
//   **bold**, *italic*, `code`, [[glossary-term]] -> hover tooltip,
//   lines starting with "- " -> bullet list, "### " -> sub-heading.

export type ToolId =
  | "calendar-explorer"
  | "cycle-explorer"
  | "soc-window"
  | "v2g-dispatch"
  | "mechanism-diagram"
  | "arrhenius";

export type CalloutTone = "misconception" | "truck" | "tip" | "assumption";

export interface TextBlock {
  kind: "text";
  depth: "core" | "deeper";
  heading?: string;
  /** Main explanation, postdoc level (or advanced level if depth === "deeper"). */
  body: string;
  /** Simpler re-explanation shown when "Clarify" mode is active (core blocks only). */
  clarify?: string;
}

export interface EquationBlock {
  kind: "equation";
  depth: "core" | "deeper";
  latex: string;
  /** Short label, e.g. "Arrhenius temperature scaling" */
  label?: string;
  /** Plain-language walkthrough of every symbol and what the equation says. */
  explanation: string;
}

export interface CalloutBlock {
  kind: "callout";
  depth: "core" | "deeper";
  tone: CalloutTone;
  title: string;
  body: string;
}

export interface ToolBlock {
  kind: "tool";
  depth: "core" | "deeper";
  tool: ToolId;
  /** What the student should try / look for when playing with the tool. */
  note?: string;
}

export type Block = TextBlock | EquationBlock | CalloutBlock | ToolBlock;

export interface Section {
  slug: string;
  title: string;
  /** One-line description shown on the concept map. */
  summary: string;
  /** Slugs of sections that are conceptually upstream (drawn as edges). */
  prerequisites: string[];
  /** Estimated reading time in minutes (core path). */
  minutes: number;
  blocks: Block[];
}

export interface GlossaryEntry {
  term: string;
  short: string;
  long?: string;
}
