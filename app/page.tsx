import { ImmersiveHero } from "@/components/home/ImmersiveHero";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { BentoGrid } from "@/components/home/BentoGrid";

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
    </>
  );
}
