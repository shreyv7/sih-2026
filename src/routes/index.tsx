import { createFileRoute } from "@tanstack/react-router";
import { ManipalGlobeLanding } from "@/components/carbon/manipal-globe-landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAHE Globe Experience" },
      {
        name: "description",
        content:
          "Presentation landing page for MAHE Manipal with a rotating globe and cinematic zoom into the campus region.",
      },
      { property: "og:title", content: "MAHE Globe Experience" },
      {
        property: "og:description",
        content: "Start from the globe, zoom into Manipal, and segue into campus building stories.",
      },
    ],
  }),
  component: ManipalGlobeLanding,
});
