import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Minus, Plus, Shield, Users } from "lucide-react";

const PRICE_PER_CODE = 150;

export default function ChooseCodesStep({ data, setData, onNext, onBack }) {
  const codeCount = data.student_code_limit || 1;

  const setCodeCount = (val) => {
    const num = Math.max(1, Math.min(data.number_of_units || 9999, val));
    setData((prev) => ({ ...prev, student_code_limit: num }));
  };

  const total = codeCount * PRICE_PER_CODE;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Choose Student Codes</h2>
          <p className="text-sm text-muted-foreground">How many student codes do you need?</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-border bg-muted/30">
          <Label className="text-sm font-medium text-foreground mb-4 block">
            Number of Student Codes
          </Label>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCodeCount(codeCount - 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <Input
              type="number"
              value={codeCount}
              onChange={(e) => setCodeCount(parseInt(e.target.value) || 1)}
              className="text-center text-lg font-semibold h-10 w-28"
              min={1}
              max={data.number_of_units}
            />
            <button
              onClick={() => setCodeCount(codeCount + 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your building has {data.number_of_units} units. You can purchase up to {data.number_of_units} codes.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-primary/10 bg-primary/[0.02]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-muted-foreground">Student codes</span>
            <span className="text-sm font-medium">{codeCount} × R{PRICE_PER_CODE}</span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Security code
            </span>
            <span className="text-sm font-medium text-green-600">Included</span>
          </div>
          <div className="border-t border-primary/10 mt-4 pt-4 flex items-baseline justify-between">
            <span className="text-base font-semibold">Monthly Total</span>
            <span className="text-3xl font-bold text-primary">R{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="lg" className="h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
          >
            Continue to Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}