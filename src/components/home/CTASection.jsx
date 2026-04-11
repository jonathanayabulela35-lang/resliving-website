import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-primary overflow-hidden"
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px"
            }} />
          </div>

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to Modernise Your Building?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
              Join ResLiving and give your residents the smart living experience they deserve.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white px-8 h-12 text-base font-semibold shadow-lg">
                  Set Up Your Building
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base font-medium border-white/20 text-white hover:bg-white/10 bg-transparent">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}