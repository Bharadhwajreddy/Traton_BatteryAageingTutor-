import katex from "katex";

export function Equation({ latex, display = true }: { latex: string; display?: boolean }) {
  const html = katex.renderToString(latex, {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });
  return (
    <span
      className={display ? "block overflow-x-auto py-1" : "inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
