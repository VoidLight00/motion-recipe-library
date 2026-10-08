import { recipes } from "@/lib/catalog";
import RecipeDetail from "@/components/RecipeDetail";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: recipes.find((r) => r.slug === slug)?.titleKo || "작품" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.slug === slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
