"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  sectionWidth?: number | string; // e.g., '100vw'
  gap?: number; // rem-based gap for Tailwind gap-x
};

export function HorizontalScroll({
  children,
  sectionWidth = "100vw",
  gap = 4,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const sections = Array.isArray(children) ? children : [children];

  const scrollToIndex = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, sections.length - 1));
    const x = clamped * el.clientWidth;
    el.scrollTo({ left: x, behavior: "smooth" });
    setIndex(clamped);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w > 0) setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollXProgress } = useScroll({ container: containerRef });
  const progressW = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="horizontal-scroll-container no-scrollbar overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        <div className={`flex gap-${gap}`} style={{ width: "max-content", display: "flex", flexDirection: "row" }}>
          {sections.map((child, i) => (
            <section
              key={i}
              className="snap-start shrink-0"
              style={{ 
                width: sectionWidth, 
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {child}
            </section>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-5 mx-auto flex w-11/12 items-center justify-center gap-3">
        {sections.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className="group"
          >
            {i === index ? (
              <CircleDot className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-foreground/50 group-hover:text-primary transition" />
            )}
          </button>
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
        <button
          aria-label="Previous"
          onClick={() => scrollToIndex(index - 1)}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface/80 dark:bg-white/10 backdrop-blur border borderc/70 dark:border-white/10 shadow-soft-elevated hover:shadow-neon-blue transition disabled:opacity-50"
          disabled={index === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        <button
          aria-label="Next"
          onClick={() => scrollToIndex(index + 1)}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface/80 dark:bg-white/10 backdrop-blur border borderc/70 dark:border-white/10 shadow-soft-elevated hover:shadow-neon-blue transition disabled:opacity-50"
          disabled={index === sections.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
