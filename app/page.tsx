import { recipes } from "@/lib/catalog";
import Library from "@/components/Library";
export default function Home() {
  return <Library recipes={recipes} />;
}
