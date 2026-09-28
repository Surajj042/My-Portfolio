"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import { contact } from "../data/site.config";

type FormState = {
  name: string;
  email: string;
  service: string;
  budget: string;
  idea: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type Status = "" | "sending" | "success" | "error";

const EMPTY: FormState = { name: "", email: "", service: "", budget: "", idea: "" };

const SERVICE_OPTIONS = [
  "Odoo / ERP Development",
  "Web Development",
  "Mobile Application",
  "Others",
];

/** Exported for unit tests — keeps the rules in one place. */
export function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};
  const required: (keyof FormState)[] = ["name", "email", "service", "idea"];

  for (const field of required) {
    if (!data[field].trim()) {
      errors[field] = "This field is required.";
    }
  }
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (data.service !== "Others" && !data.budget.trim()) {
    errors.budget = "Please give a rough budget.";
  }
  return errors;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "budget" && value && !/^\d*\.?\d*$/.test(value)) return;
    const key = name as keyof FormState;
    setFormData((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateForm(formData);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");

    const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      return;
    }

    try {
      // Loaded on submit rather than at module scope. EmailJS was previously a
      // top-level import, which put ~40KB of third-party code in the critical
      // render path for a form that most visitors never use.
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        { ...formData, from_name: formData.name, reply_to: formData.email },
        publicKey,
      );
      setStatus("success");
      setFormData(EMPTY);
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = (field: keyof FormState) =>
    `p-3 rounded-md bg-white/10 border text-white focus:outline-none focus:border-blue-500 ${
      errors[field] ? "border-red-500" : "border-gray-500"
    }`;

  const describedBy = (field: keyof FormState) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <section
      id="contact"
      className="w-full min-h-[100svh] relative bg-black overflow-hidden text-white py-20 md:px-20 flex flex-col md:flex-row items-center gap-10"
    >
      <ParticlesBackground />
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-10">
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="w-full max-w-md flex flex-col items-center gap-8 text-center lg:text-left lg:items-start">
            <motion.div
              className="relative w-72 h-72 rounded-2xl shadow-lg overflow-hidden shrink-0"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/assets/Astra.png"
                alt="Suraj Gurung — open to collaborations"
                width={560}
                height={560}
                sizes="288px"
                className="object-cover w-full h-full"
              />
            </motion.div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Prefer email?
              </h2>
              <p className="text-gray-300 text-base">
                The form is one way in, not the only one.
              </p>
              <ul className="flex flex-col gap-2 mt-2">
                {contact.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-[#6dd5fa] hover:underline underline-offset-4 break-all"
                    >
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 bg-white/5 p-8 rounded-2xl shadow-lg border border-white/10"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">Let&apos;s Work Together</h2>
          <p className="text-gray-400 text-sm mb-6">
            Tell me what you&apos;re building and I&apos;ll reply with next steps.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col">
              <label htmlFor="contact-name" className="mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy("name")}
                className={fieldClass("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-red-400 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="contact-email" className="mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy("email")}
                className={fieldClass("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-red-400 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="contact-service" className="mb-1">
                Service Needed <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                aria-invalid={errors.service ? true : undefined}
                aria-describedby={describedBy("service")}
                className={fieldClass("service")}
              >
                <option value="" disabled className="text-black">
                  Something in Mind?
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p id="service-error" className="text-red-400 text-sm mt-1">
                  {errors.service}
                </p>
              )}
            </div>

            {formData.service && formData.service !== "Others" && (
              <div className="flex flex-col">
                <label htmlFor="contact-budget" className="mb-1">
                  Budget (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-budget"
                  name="budget"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 1500"
                  value={formData.budget}
                  onChange={handleChange}
                  aria-invalid={errors.budget ? true : undefined}
                  aria-describedby={describedBy("budget")}
                  className={fieldClass("budget")}
                />
                {errors.budget && (
                  <p id="budget-error" className="text-red-400 text-sm mt-1">
                    {errors.budget}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col">
              <label htmlFor="contact-idea" className="mb-1">
                Explain Your Idea <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-idea"
                name="idea"
                rows={5}
                placeholder="What are you building?"
                value={formData.idea}
                onChange={handleChange}
                aria-invalid={errors.idea ? true : undefined}
                aria-describedby={describedBy("idea")}
                className={fieldClass("idea")}
              />
              {errors.idea && (
                <p id="idea-error" className="text-red-400 text-sm mt-1">
                  {errors.idea}
                </p>
              )}
            </div>

            {/* Announced by screen readers on change, which the previous
                version's plain <p> was not. */}
            <p role="status" aria-live="polite" className="text-sm min-h-5">
              {status === "sending" && (
                <span className="text-yellow-400">Sending…</span>
              )}
              {status === "success" && (
                <span className="text-green-400">
                  Message sent successfully.
                </span>
              )}
              {status === "error" && (
                <span className="text-red-400">
                  Something went wrong. Please try email instead.
                </span>
              )}
            </p>

            <motion.button
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-md font-semibold transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={status === "sending"}
              type="submit"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
