"use client";

import { motion } from "framer-motion";

const tech = [
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Machine Learning",
  "Data Analysis",
  "Redis",
  "SQL",
  "Hibernate/JPA",
];

export function Marquee() {
  return (
    <div className="relative py-8 overflow-hidden border-y border-gray-200 dark:border-gray-700">
      <motion.div
        className="flex gap-10 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400"
        animate={{ x: [0, -600] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-10">
            {tech.map((t) => (
              <span key={`${i}-${t}`}>{t}</span>
            ))}
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fafaf9] dark:from-[#0c0a09] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fafaf9] dark:from-[#0c0a09] to-transparent" />
    </div>
  );
}
