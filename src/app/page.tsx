import type { Metadata } from "next";
import ArcLabExperience from "@/components/arc-lab/ArcLabExperience";

export const metadata: Metadata = {
  title: "Arc Lab — Arc Length & Sector Area",
  description:
    "Learn arc length, sector area, and radians with visual lessons, a hands-on circle explorer, and a scored geometry challenge.",
  openGraph: {
    title: "Arc Lab — Arc Length & Sector Area",
    description:
      "Explore circle measurements and test your understanding with a touch-friendly geometry game.",
    type: "website",
  },
};

export default function Home() {
  return <ArcLabExperience />;
}
