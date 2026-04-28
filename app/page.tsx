import { ImmersiveHero } from "@/components/home/ImmersiveHero";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { EditorialSection } from "@/components/home/EditorialSection";
import { InfoBar } from "@/components/InfoBar";

export default function HomePage() {
  return (
    <>
      <ImmersiveHero />
      <FeaturedDrop />
      <EditorialSection />
      <InfoBar />
    </>
  );
}
