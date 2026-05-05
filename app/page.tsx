import { ImmersiveHero } from "@/components/home/ImmersiveHero";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { BentoGrid } from "@/components/home/BentoGrid";
import { HeroBanner } from "@/components/banani/HeroBanner";
import { SeasonDrops } from "@/components/banani/SeasonDrops";
import { ShopByCategory } from "@/components/banani/ShopByCategory";
import { NewArrivals } from "@/components/banani/NewArrivals";
import { CollectionDrops } from "@/components/banani/CollectionDrops";

const MARQUEE_ITEMS = ['NOT MADE TO FIT IN','MADE TO STAND OUT','DROP 001 · SS26','LIMITED EDITION','ILUMINATEES','WEAR THE DREAM'];

export default function HomePage() {
  return (
    <>
      <ImmersiveHero />

      {/* Marquee */}
      <div className="mq">
        <div className="mq-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="mq-item">{item}<span className="mq-sep"> · </span></span>
          ))}
        </div>
      </div>

      <FeaturedDrop />
      <BentoGrid />

      {/* Banani sections */}
      <HeroBanner />
      <SeasonDrops />
      <ShopByCategory />
      <NewArrivals />
      <CollectionDrops />
    </>
  );
}
