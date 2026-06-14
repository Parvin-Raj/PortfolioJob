"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timeline = [
  { date: "March 2025 — Present", title: "Associate Software Developer", org: "Rumango Software and Consulting Services", details: "Associate Software Developer with hands-on experience in building secure banking applications using Java and Spring Boot. Skilled in developing REST APIs, integrating databases, implementing authentication/authorization, and working in Agile teams to deliver scalable backend systems." },
  { date: "September 2021 - May 2025", title: "B.E Computer and Communication Engineering", org: "Sri Eshwar College of Engineering", details: "Focused on software development, programming, databases, and networking with hands-on academic projects." },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="container mx-auto px-6 py-20 max-w-5xl">
      <motion.h2 className="section-heading-lg" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        Experience & Education
      </motion.h2>
      <div ref={ref} className="relative mt-10">
        <motion.div className="absolute left-4 top-0 h-full w-0.5 origin-top bg-brand/30 dark:bg-brand-accent/40" style={{ scaleY }} />
        <div className="space-y-10">
          {timeline.map((t, i) => (
            <motion.div key={i} className="relative ml-10 pro-card p-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5 }} viewport={{ once: true }}>
              <div className="absolute -left-9 top-5 h-3 w-3 rounded-full bg-brand ring-4 ring-brand/15 dark:bg-brand-accent dark:ring-brand-accent/20" />
              <div className="text-sm text-gray-500 dark:text-gray-400">{t.date}</div>
              <div className="mt-1 font-semibold">{t.title} · {t.org}</div>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{t.details}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
