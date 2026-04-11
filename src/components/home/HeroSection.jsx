import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] to-transparent">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              <Shield className="w-3.5 h-3.5" />
              Smart Student Accommodation
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
              Modern Living,{" "}
              <span className="text-primary">Managed</span>{" "}
              <span className="text-destructive">Smarter</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ResLiving helps student accommodation and residential buildings manage access, communication, and daily operations — all in one platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/get-started">
              <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 h-12 text-base font-semibold shadow-lg shadow-destructive/20">
                Set Up Your Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base font-medium border-primary/20 text-primary hover:bg-primary/5">
                Learn How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { icon: Building2, label: "Building Management" },
              { icon: Shield, label: "Secure Access Control" },
              { icon: Users, label: "Student & Security App" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2.5 text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary/60" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}