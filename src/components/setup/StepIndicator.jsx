import { Check } from "lucide-react";

const steps = [
  { label: "Building Details" },
  { label: "Choose Codes" },
  { label: "Review" },
  { label: "Payment" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-destructive text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`hidden sm:block text-xs font-medium ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 lg:w-12 h-px ${isCompleted ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}