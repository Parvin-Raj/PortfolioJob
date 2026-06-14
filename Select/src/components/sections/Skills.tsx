"use client";

import { motion } from "framer-motion";
import { Database, Cog, Boxes, Code2 } from "lucide-react";

const skillCategories = [
  { title: "Programming Languages", icon: Code2, items: [{ name: "Java", level: 90 }, { name: "Python", level: 80 }, { name: "Machine Learning", level: 70 }] },
  { title: "Frameworks", icon: Cog, items: [{ name: "Spring Boot", level: 92 }, { name: "Spring Security", level: 85 }, { name: "Hibernate/JPA", level: 88 }] },
  { title: "Databases", icon: Database, items: [{ name: "PostgreSQL", level: 90 }, { name: "OracleSql", level: 80 }, { name: "Redis", level: 75 }] },
  { title: "Tools", icon: Boxes, items: [{ name: "Docker", level: 80 }, { name: "VS Code", level: 70 }, { name: "GitHub", level: 90 }] },
];

export function Skills() {
  return (
    <section id="skills" className="container mx-auto px-6 py-20 max-w-6xl">
      <motion.h2 className="section-heading-lg" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        Skills
      </motion.h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((cat, idx) => (
          <motion.div key={cat.title} className="pro-card p-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.5 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3">
              <div className="icon-chip"><cat.icon className="h-4 w-4" /></div>
              <h3 className="text-lg font-semibold">{cat.title}</h3>
            </div>
            <div className="mt-4 space-y-3">
              {cat.items.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{item.level}%</span>
                  </div>
                  <div className="mt-1 skill-bar">
                    <motion.div className="skill-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${item.level}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
