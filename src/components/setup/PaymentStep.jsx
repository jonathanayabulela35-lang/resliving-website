import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";

const PRICE_PER_CODE = 150;

export default function PaymentStep({ data, onBack, onComplete }) {
  const [processing, setProcessing] = useState(false);
  const total = (data.student_code_limit || 1) * PRICE_PER_CODE;

  const handlePayment = async () => {
    setProcessing(true);
    // Simulated payment processing
    await new Promise((r) => setTimeout(r, 2000));
    onComplete();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Payment</h2>
          <p className="text-sm text-muted-foreground">Complete your purchase to activate your building</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Amount due */}
        <div className="p-5 rounded-2xl border border-destructive/10 bg-destructive/[0.02] text-center">
          <p className="text-sm text-muted-foreground mb-1">Amount Due Today</p>
          <p className="text-4xl font-bold text-primary">R{total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.student_code_limit} student codes + 1 security code</p>
        </div>

        {/* Card form (placeholder) */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Card Number</Label>
            <Input placeholder="4242 4242 4242 4242" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Expiry Date</Label>
              <Input placeholder="MM / YY" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">CVC</Label>
              <Input placeholder="123" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Cardholder Name</Label>
            <Input placeholder="Name on card" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
          <Lock className="w-3.5 h-3.5" />
          <span>Payment is secured and encrypted. This is a demo payment flow.</span>
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="lg" className="h-12" disabled={processing}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handlePayment}
            disabled={processing}
            size="lg"
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white h-12 text-base font-semibold"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay R${total.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}