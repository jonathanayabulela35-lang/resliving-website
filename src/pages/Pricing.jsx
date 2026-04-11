import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Shield, Users, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";

const PRICE_PER_CODE = 150;

const included = [
  "Student unit access codes",
  "1 building security code (free)",
  "Visitor management",
  "Maintenance requests",
  "Announcements & messages",
  "Community events & news",
  "House rules access",
  "Security verification",
  "Manager dashboard",
  "Code sharing & download",
];

export default function Pricing() {
  const [codeCount, setCodeCount] = useState(10);

  const handleChange = (val) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1 && num <= 9999) {
      setCodeCount(num);
    }
  };

  const total = codeCount * PRICE_PER_CODE;

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Simple, Transparent Pricing"
          description="Pay only for the student codes you need. No hidden fees. Security code always included."
        />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-card p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Left: Calculator */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Pricing Calculator</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Enter the number of student codes to see your monthly cost.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Number of Student Codes</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCodeCount(Math.max(1, codeCount - 1))}
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <Input
                        type="number"
                        value={codeCount}
                        onChange={(e) => handleChange(e.target.value)}
                        className="text-center text-lg font-semibold h-10 w-24"
                        min={1}
                        max={9999}
                      />
                      <button
                        onClick={() => setCodeCount(Math.min(9999, codeCount + 1))}
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/10">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Price per code</span>
                      <span className="text-sm font-medium text-foreground">R{PRICE_PER_CODE}/month</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Student codes</span>
                      <span className="text-sm font-medium text-foreground">× {codeCount}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Security code</span>
                      <span className="text-sm font-medium text-green-600">Included</span>
                    </div>
                    <div className="border-t border-primary/10 mt-4 pt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-semibold text-foreground">Monthly Total</span>
                        <span className="text-3xl font-bold text-primary">R{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/get-started" className="block">
                    <Button size="lg" className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 text-base font-semibold">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: What's included */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-6">Everything Included</h3>
                <ul className="space-y-3.5">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/60">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">No lock-in contract</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Pay monthly. Cancel anytime. Building access suspends if not renewed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}