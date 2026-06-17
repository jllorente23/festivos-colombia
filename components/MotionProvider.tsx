"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const REVEAL_SELECTOR =
  "[data-reveal], .holiday-table-body .holiday-table-row, .yearnav a";

const REVEAL_FROM = {
  opacity: 0,
  y: 24,
  filter: "blur(10px)",
  clipPath: "inset(0 0 100% 0)",
};

const REVEAL_TO = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  clipPath: "inset(0 0 0% 0)",
  duration: 0.8,
  ease: "expo.out" as const,
};

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR);

        if (targets.length) {
          gsap.set(targets, REVEAL_FROM);
        }

        ScrollTrigger.batch(REVEAL_SELECTOR, {
          start: "top 92%",
          onEnter: (batch) => {
            gsap.to(batch, {
              ...REVEAL_TO,
              stagger: 0.08,
              overwrite: true,
            });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, {
              ...REVEAL_TO,
              stagger: 0.08,
              overwrite: true,
            });
          },
          onLeave: (batch) => {
            gsap.killTweensOf(batch);
            gsap.set(batch, REVEAL_FROM);
          },
          onLeaveBack: (batch) => {
            gsap.killTweensOf(batch);
            gsap.set(batch, REVEAL_FROM);
          },
        });

        ScrollTrigger.batch(".holiday-table-body .holiday-table-row.is-today", {
          start: "top 88%",
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { scale: 0.98 },
              {
                scale: 1,
                duration: 0.6,
                ease: "expo.out",
                stagger: 0.04,
                overwrite: true,
              },
            );
          },
          onEnterBack: (batch) => {
            gsap.fromTo(
              batch,
              { scale: 0.98 },
              {
                scale: 1,
                duration: 0.6,
                ease: "expo.out",
                stagger: 0.04,
                overwrite: true,
              },
            );
          },
          onLeave: (batch) => {
            gsap.killTweensOf(batch);
            gsap.set(batch, { scale: 0.98 });
          },
          onLeaveBack: (batch) => {
            gsap.killTweensOf(batch);
            gsap.set(batch, { scale: 0.98 });
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(REVEAL_SELECTOR, { clearProps: "all" });
      });
    });

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
