import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Building2, User, CreditCard, Shield } from "lucide-react";

const PRICE_PER_CODE = 250;

export default function ReviewStep({ data, onNext, onBack }) {
  const total = (data.student_code_limit || 1) * PRICE_PER_CODE;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Review Your Order</h2>
          <p className="text-sm text-muted-foreground">Please confirm everything is correct</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Building */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Building Details</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{data.building_name}</span>
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium text-foreground">{data.building_address}</span>
            <span className="text-muted-foreground">Units</span>
            <span className="font-medium text-foreground">{data.number_of_units}</span>
            {data.max_visitors > 0 && (
              <>
                <span className="text-muted-foreground">Max visitors</span>
                <span className="font-medium text-foreground">{data.max_visitors}</span>
              </>
            )}
            {data.sleepover_fee > 0 && (
              <>
                <span className="text-muted-foreground">Sleepover fee</span>
                <span className="font-medium text-foreground">R{data.sleepover_fee}</span>
              </>
            )}
          </div>
        </div>

        {/* Manager */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Manager</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{data.manager_name}</span>
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{data.manager_email}</span>
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium text-foreground">{data.manager_phone}</span>
          </div>
        </div>

        {/* Billing */}
        <div className="p-5 rounded-2xl border border-primary/10 bg-primary/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Subscription</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Student codes</span>
            <span className="font-medium text-foreground">{data.student_code_limit}</span>
            <span className="text-muted-foreground">Security code</span>
            <span className="font-medium text-green-600">Included</span>
            <span className="text-muted-foreground">Price per code</span>
            <span className="font-medium text-foreground">R{PRICE_PER_CODE}/mo</span>
          </div>
          <div className="border-t border-primary/10 mt-3 pt-3 flex justify-between items-baseline">
            <span className="text-base font-semibold">Monthly Total</span>
            <span className="text-2xl font-bold text-primary">R{total.toLocaleString()}/mo</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={onBack} variant="outline" size="lg" className="h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            size="lg"
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white h-12 text-base font-semibold"
          >
            Proceed to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
