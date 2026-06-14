"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Typewriter } from "../ui/Typewriter";
import { ThemeToggle } from "../ui/ThemeToggle";

const highlights = [
  {
    label: "Core Focus",
    value: "API design & ML Integration",
  },
  {
    label: "Toolbox",
    value: "Spring Boot, Hugging Face, TF, Docker",
  },
  {
    label: "Datastores",
    value: "PostgreSQL, Oracle",
  },
];

export function Hero() {
  return (
    <section id="top" className="relative flex flex-col items-center py-10 md:py-16">
      <div className="container mx-auto px-3 max-w-3xl text-center">
        <div className="flex w-full justify-end mb-2">
          <ThemeToggle />
        </div>

        <motion.p
          className="label-gold md:text-sm"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Software Development Engineer
        </motion.p>

        <motion.div
          className="relative mt-3 inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            className="pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 rounded-full blur-3xl opacity-40 dark:opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,175,55,0.35) 0%, rgba(184,134,11,0.12) 45%, transparent 70%)",
            }}
            aria-hidden
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-gold">
            Parvin Raj
          </h1>
        </motion.div>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-sm md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Crafting resilient backend systems in Java & Spring Boot — with a
          passion for performance, observability, and elegant architecture.
        </motion.p>

        <motion.p
          className="mx-auto mt-3 max-w-lg text-xs md:text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typewriter
            phrases={[
              "Java | Spring Boot | PostgreSQL | ML",
              "REST APIs | Microservices | Data Analysis",
              "Scalability | Reliability | Performance",
            ]}
          />
        </motion.p>

        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {highlights.map((item) => (
            <div key={item.label} className="hero-card group">
              <div
                className="mb-2 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-14"
                style={{
                  background: "linear-gradient(90deg, #b8860b, #f5d061)",
                }}
              />
              <div className="label-gold text-[10px]">{item.label}</div>
              <div className="mt-1.5 text-sm font-semibold text-brand dark:text-gray-100">
                {item.value}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <a
            className="group rounded-full p-2 text-gray-600 ring-1 ring-transparent transition hover:text-gold-dark hover:ring-gold/30 dark:text-gray-300 dark:hover:text-gold-light"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5 opacity-80 group-hover:opacity-100" />
          </a>
          <a
            className="group rounded-full p-2 text-gray-600 ring-1 ring-transparent transition hover:text-gold-dark hover:ring-gold/30 dark:text-gray-300 dark:hover:text-gold-light"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-5 w-5 opacity-80 group-hover:opacity-100" />
          </a>
          <a
            className="group rounded-full p-2 text-gray-600 ring-1 ring-transparent transition hover:text-gold-dark hover:ring-gold/30 dark:text-gray-300 dark:hover:text-gold-light"
            href="#contact"
          >
            <Mail className="h-5 w-5 opacity-80 group-hover:opacity-100" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
