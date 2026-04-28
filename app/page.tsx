import { HeroSection } from "@/components/HeroSection";
import { DropStrip } from "@/components/DropStrip";
import { EditorialGrid } from "@/components/EditorialGrid";
import { InfoBar } from "@/components/InfoBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DropStrip />
      <EditorialGrid />
      <InfoBar />
    </>
  );
}
