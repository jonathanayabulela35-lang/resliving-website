import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");

        if (!reference) {
          setMessage("No payment reference was found.");
          return;
        }

        const { data, error } = await supabase.functions.invoke("verify-paystack", {
          body: { reference },
        });

        if (error) {
          throw new Error(error.message || "Payment verification failed.");
        }

        if (!data?.success) {
          throw new Error(data?.error || "Payment could not be verified.");
        }

        setMessage("Payment successful. Redirecting to your dashboard...");

        setTimeout(() => {
          navigate("/manager/dashboard", { replace: true });
        }, 1500);
      } catch (error) {
        setMessage(error.message || "Something went wrong while verifying payment.");
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Payment Status
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}