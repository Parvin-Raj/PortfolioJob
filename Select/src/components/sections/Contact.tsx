"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

const CONTACT = {
  email: "parvinraj0607@gmail.com",
  phone: "9363358130",
  address:
    "29A, Maruthakutty Street Rathinapuri, Coimbatore, TamilNadu - 641027",
};

async function sendViaFormSubmit(data: FormValues) {
  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT.email)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _subject: `Portfolio contact from ${data.name}`,
        _replyto: data.email,
        _captcha: "false",
        _template: "table",
      }),
    }
  );

  const result = await res.json().catch(() => ({}));
  const ok =
    res.ok &&
    (result.success === true ||
      result.success === "true" ||
      result.message === "Form submitted successfully");
  if (!ok) {
    throw new Error(
      typeof result.message === "string"
        ? result.message
        : "Could not deliver message."
    );
  }
}

const inputClass =
  "rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition w-full text-sm dark:border-gray-600 dark:bg-gray-900/50";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setStatus("idle");
      setErrorMessage(null);
      console.log('[Contact] Submitting form:', data);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      console.log('[Contact] API response:', res.status, result);

      if (res.ok && result.ok === true) {
        setStatus("sent");
        reset();
        return;
      }

      // Server SMTP failed — deliver via FormSubmit from the browser
      console.log('[Contact] API failed, trying FormSubmit fallback');
      await sendViaFormSubmit(data);
      setStatus("sent");
      reset();
    } catch (err) {
      console.error('[Contact] Error:', err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <section id="contact" className="container mx-auto px-6 py-20 max-w-3xl">
      <motion.h2
        className="section-heading-lg"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Contact
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 pro-card p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Name</span>
            <input {...register("name")} placeholder="Your name" className={inputClass} />
            {formState.errors.name && (
              <span className="text-sm text-red-600">{formState.errors.name.message}</span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Email</span>
            <input {...register("email")} placeholder="you@example.com" className={inputClass} />
            {formState.errors.email && (
              <span className="text-sm text-red-600">{formState.errors.email.message}</span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Message</span>
            <textarea
              {...register("message")}
              rows={5}
              placeholder="Tell me about your project or role..."
              className={inputClass}
            />
            {formState.errors.message && (
              <span className="text-sm text-red-600">{formState.errors.message.message}</span>
            )}
          </label>

          <button type="submit" disabled={formState.isSubmitting} className="btn-primary mt-2 w-full sm:w-auto">
            <Send className="h-4 w-4" />
            {formState.isSubmitting ? "Sending..." : "Send Message"}
          </button>
          {status === "sent" && (
            <div className="text-sm text-brand-accent dark:text-gold-light">
              Message sent successfully. I will get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {errorMessage || "Something went wrong."}
            </div>
          )}
        </div>
      </motion.form>

      <motion.div
        className="mt-10 pro-card p-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold text-brand dark:text-white mb-4">
          Contact details
        </h3>
        <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand-accent dark:text-gold-light" />
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Email: </span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-brand-accent hover:underline dark:text-gold-light"
              >
                {CONTACT.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand-accent dark:text-gold-light" />
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Mobile no: </span>
              <a href={`tel:+91${CONTACT.phone}`} className="hover:underline">
                {CONTACT.phone}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-accent dark:text-gold-light" />
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Address: </span>
              {CONTACT.address}
            </div>
          </li>
        </ul>
      </motion.div>
    </section>
  );
}
