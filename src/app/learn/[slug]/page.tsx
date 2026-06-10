import { notFound } from "next/navigation";
import { SECTIONS, getSection } from "@/content";
import { SectionPage } from "@/components/SectionPage";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ slug: s.slug }));
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();
  return <SectionPage section={section} />;
}
