import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, CreditCard, QrCode, Smartphone, ShieldCheck, XCircle } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const steps = [
  {
    icon: Building2,
    step: "1",
    title: "Manager Sets Up Building",
    description: "The building manager or owner visits this website, enters building details including name, address, number of units, house rules, visitor policies, and emergency contacts.",
    color: "bg-primary"
  },
  {
    icon: CreditCard,
    step: "2",
    title: "Purchase Student Codes",
    description: "The manager selects how many student codes they need. Each code costs R150/month. They can purchase fewer codes than total units if needed. Security code is always included for free.",
    color: "bg-primary"
  },
  {
    icon: QrCode,
    step: "3",
    title: "Codes Are Generated",
    description: "After successful payment, the system generates one unique security code for the building and unique student codes for each purchased unit. These codes are permanent and reusable.",
    color: "bg-primary"
  },
  {
    icon: Smartphone,
    step: "4",
    title: "Students & Security Join via App",
    description: "Students download the ResLiving mobile app and enter their unit code to join. Security guards enter the building's security code. Everyone is now connected to the building.",
    color: "bg-destructive"
  },
  {
    icon: ShieldCheck,
    step: "5",
    title: "Building Stays Active",
    description: "As long as the subscription is paid monthly, all students and security have full access to the app's features — visitor management, maintenance, messages, and more.",
    color: "bg-primary"
  },
  {
    icon: XCircle,
    step: "6",
    title: "Access Suspends if Unpaid",
    description: "If the monthly subscription is not renewed, building access is suspended. Students and security will see an 'access suspended' message until payment is restored.",
    color: "bg-destructive"
  },
];

export default function HowItWorks() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="How It Works"
          title="Simple, Transparent Process"
          description="ResLiving makes it easy for building managers to get started and for students and security to join."
        />

        <div className="max-w-3xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6 mb-8 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-border mt-2" />
                )}
              </div>
              <div className="pb-8">
                <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role Explainer */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Managers / Owners",
              platform: "Website",
              description: "Purchase codes, manage building setup, view subscription status, and share access codes.",
              accent: "border-primary/20 bg-primary/[0.02]"
            },
            {
              title: "Students",
              platform: "Mobile App",
              description: "Join using unit code, manage visitors, submit maintenance requests, access building info.",
              accent: "border-destructive/20 bg-destructive/[0.02]"
            },
            {
              title: "Security",
              platform: "Mobile App",
              description: "Join using security code, verify visitors, manage building access, and receive alerts.",
              accent: "border-primary/20 bg-primary/[0.02]"
            },
          ].map((role, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${role.accent}`}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{role.platform}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/get-started">
            <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 h-12 text-base font-semibold">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
