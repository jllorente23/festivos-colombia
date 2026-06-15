import { getHolidays, isoDate } from "@/lib/holidays";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://festivoscolombia.link";

export default function JsonLd({ year }: { year: number }) {
  const hs = getHolidays(year);
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Festivos en Colombia ${year}`,
    url: `${SITE}/festivos/${year}`,
    numberOfItems: hs.length,
    itemListElement: hs.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: h.name,
        startDate: isoDate(h.date),
        endDate: isoDate(h.date),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        description: h.why,
        location: { "@type": "Country", name: "Colombia" },
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
