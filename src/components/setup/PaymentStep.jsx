import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Lock, RefreshCcw } from "lucide-react";

const PRICE_PER_CODE = 250;

export default function PaymentStep({ data, onBack, onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState("");

  const codeCount = data.student_code_limit || 1;
  const total = codeCount * PRICE_PER_CODE;

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setNotice("");

      await onComplete();
    } catch (error) {
      setNotice(error?.message || "Unable to start Paystack checkout.");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Monthly Subscription</h2>
          <p className="text-sm text-muted-foreground">
            Start your monthly ResLiving subscription with Paystack
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="p-5 rounded-2xl border border-destructive/10 bg-destructive/[0.02] text-center">
          <p className="text-sm text-muted-foreground mb-1">Monthly Amount</p>
          <p className="text-4xl font-bold text-primary">R{total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {codeCount} student codes billed monthly + 1 security code included
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-start gap-3">
            <RefreshCcw className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Monthly renewal</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your subscription remains active through monthly renewal payments.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Secure Paystack checkout</p>
              <p className="text-sm text-muted-foreground mt-1">
                You’ll be redirected to Paystack to complete your first monthly payment securely.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-sm font-medium text-foreground mb-2">What happens after payment</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Your building subscription is activated</li>
              <li>• Your security code is generated</li>
              <li>• Your student codes are generated</li>
              <li>• Renew monthly to keep your building active</li>
            </ul>
          </div>
        </div>

        {notice ? (
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
            {notice}
          </div>
        ) : null}

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="h-12"
            disabled={processing}
          >
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
                Redirecting to Paystack...
              </div>
            ) : (
              `Continue to Paystack`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
