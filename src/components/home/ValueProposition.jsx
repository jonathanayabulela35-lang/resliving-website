import { motion } from "framer-motion";
import { Shield, Bell, Wrench, FileText, Users, Lock } from "lucide-react";
import SectionHeading from "../SectionHeading";

const values = [
  {
    icon: Shield,
    title: "Visitor Management",
    description: "Track and manage all visitors entering the building with real-time security verification."
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    description: "Students submit maintenance issues directly through the app, streamlining repairs."
  },
  {
    icon: Bell,
    title: "Announcements",
    description: "Broadcast important messages and updates to all residents instantly."
  },
  {
    icon: FileText,
    title: "House Rules Access",
    description: "Digitised house rules always available. No more lost paperwork or confusion."
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Keep residents engaged with community news, events, and building updates."
  },
  {
    icon: Lock,
    title: "Code-Based Access",
    description: "Unique codes for students and security ensure only authorised people join your building."
  },
];

export default function ValueProposition() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why ResLiving"
          title="Everything Your Building Needs"
          description="A complete management platform designed specifically for student accommodation and residential buildings."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 lg:p-8 rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}