"use client";

import { motion } from "framer-motion";
import { Database, Server, Network, Shield, Rocket, Gauge } from "lucide-react";

const cards = [
  { title: "High Throughput APIs", desc: "Carefully tuned REST endpoints with caching and rate limiting.", icon: Server },
  { title: "Optical Character Recognition (OCR)", desc: "OCR that extract, process, and structure text from images and documents with high accuracy.", icon: Network },
  { title: "Data Modeling", desc: "Relational schemas, document stores, and indexing strategies.", icon: Database },
  { title: "Security & Auth", desc: "Spring Security, JWT, OAuth and RBAC.", icon: Shield },
  { title: "Performance", desc: "Optimizing Spring Boot APIs with profiling and faster responses using efficient queries, caching, and threading.", icon: Gauge },
  { title: "Deployment", desc: "Docker pipelines and containerized deployments.", icon: Rocket },
];

export function Showcase() {
  return (
    <section className="container mx-auto px-6 py-16 max-w-6xl">
      <motion.h2 className="section-heading" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        What I Build
      </motion.h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} className="pro-card p-5" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.5 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3">
              <div className="icon-chip"><c.icon className="h-4 w-4" /></div>
              <div className="font-semibold">{c.title}</div>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
