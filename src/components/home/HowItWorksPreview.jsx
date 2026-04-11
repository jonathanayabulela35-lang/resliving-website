import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, QrCode, Smartphone } from "lucide-react";
import SectionHeading from "../SectionHeading";

const steps = [
  {
    icon: CreditCard,
    step: "01",
    title: "Manager Purchases Codes",
    description: "Building managers sign up on this website, enter building details, and purchase student access codes."
  },
  {
    icon: QrCode,
    step: "02",
    title: "Codes Are Generated",
    description: "Unique codes are generated for each student unit and one security code for the building."
  },
  {
    icon: Smartphone,
    step: "03",
    title: "Students & Security Join via App",
    description: "Students and security guards download the ResLiving mobile app and join using their unique codes."
  },
];

export default function HowItWorksPreview() {
  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Simple Setup"
          title="Get Started in 3 Steps"
          description="Setting up your building on ResLiving takes just minutes."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div className="text-5xl font-bold text-primary/[0.07] mb-4">{item.step}</div>
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link to="/how-it-works">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}