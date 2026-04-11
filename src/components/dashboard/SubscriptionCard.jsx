import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard } from "lucide-react";
import moment from "moment";

export default function SubscriptionCard({ residence }) {
  if (!residence) return null;

  const isActive = residence.subscription_status === "active";
  const expiryDate = residence.subscription_expires_at
    ? moment(residence.subscription_expires_at).format("DD MMM YYYY")
    : "N/A";

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Subscription</h3>
        <Badge variant={isActive ? "default" : "destructive"} className={isActive ? "bg-green-600 hover:bg-green-600" : ""}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" />
            Monthly total
          </span>
          <span className="font-semibold text-foreground">R{residence.monthly_total?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Expires
          </span>
          <span className="font-medium text-foreground">{expiryDate}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Student codes</span>
          <span className="font-medium text-foreground">{residence.student_code_limit}</span>
        </div>
      </div>
    </div>
  );
}