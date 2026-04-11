import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Wrench,
  Bell,
  Lock,
  Building2,
  Eye,
  AlertTriangle,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const features = [
  {
    icon: Eye,
    title: "Visitor Management",
    description:
      "Students pre-register visitors. Security verifies at the gate. Complete audit trail of who enters and exits the building.",
    category: "Security",
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    description:
      "Students report issues directly through the app. Managers track and resolve requests efficiently.",
    category: "Operations",
  },
  {
    icon: Bell,
    title: "Messages & Announcements",
    description:
      "Broadcast important notices, alerts, and updates to all students instantly.",
    category: "Communication",
  },
  {
    icon: CalendarDays,
    title: "Community Events",
    description:
      "Share upcoming events, activities, and community news to keep students informed.",
    category: "Community",
  },
  {
    icon: Building2,
    title: "Building Information",
    description:
      "Centralised access to building details, contact numbers, emergency procedures, and key policies.",
    category: "Information",
  },
  {
    icon: BookOpen,
    title: "House Rules Access",
    description:
      "Digitised house rules always available in the app. No excuses for not knowing the rules.",
    category: "Information",
  },
  {
    icon: Shield,
    title: "Security Verification",
    description:
      "Security guards use the app to verify visitors, manage access, and maintain building safety.",
    category: "Security",
  },
  {
    icon: Lock,
    title: "Code-Based Access",
    description:
      "Unique permanent codes for students and security. You are linked to all your unit student residents and security guards.",
    category: "Security",
  },
  {
    icon: AlertTriangle,
    title: "Subscription Control",
    description:
      "Building access is controlled by subscription. If not renewed, access suspends automatically until payment is restored.",
    category: "Management",
  },
];

export default function Features() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/get-started" : "/manager-login");
  };

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Features"
          title="Built for Student Living"
          description="Every feature is designed to simplify operations, improve security, and enhance the student living experience."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative p-6 lg:p-8 rounded-2xl border border-border/60 bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
              <span className="absolute top-6 right-6 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                {feature.category}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 h-12 text-base font-semibold"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
