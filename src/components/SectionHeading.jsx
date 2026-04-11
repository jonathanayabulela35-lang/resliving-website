import { motion } from "framer-motion";

export default function SectionHeading({ badge, title, description, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}