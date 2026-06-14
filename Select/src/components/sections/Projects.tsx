"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

const projects = [
  { title: "Face Recognition System (AuthFace)", description: "Machine learning–based microservice for intelligent processing, built with Flask and Oracle for scalable and efficient data handling.", tech: ["Python", "Flask", "OracleDB", "Machine Learning"], link: "https://github.com/Parvin-Raj/face_recognition_v2" },
  { title: "IRIS Eye Recognition System (IrisVault)", description: "AI-powered iris recognition system for secure and fast authentication, using machine learning to accurately identify users based on unique eye patterns.", tech: ["Machine Learning", "Python", "Flask", "OracleDB"], link: "https://github.com/Parvin-Raj/iris_eye_recognition_v1" },
  { title: "Ticket Booking System", description: "Scalable ticket booking system with real-time availability, secure reservations, and efficient data management for seamless user experience.", tech: ["Java", "PostgreSQL", "Spring Boot", "React"], link: "https://github.com/" },
];

export function Projects() {
  return (
    <section id="projects" className="container mx-auto px-6 py-20 max-w-6xl">
      <motion.h2 className="section-heading-lg" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        Projects
      </motion.h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p, idx) => (
          <motion.a key={p.title} href={p.link} target="_blank" rel="noreferrer" className="group pro-card p-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.5 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }}>
            <h3 className="text-xl font-semibold group-hover:text-brand-accent dark:group-hover:text-gold-light transition-colors">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs">{t}</span>
              ))}
            </div>
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-brand-accent dark:text-gold-light">
              <Github className="h-4 w-4" /> View on GitHub
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
