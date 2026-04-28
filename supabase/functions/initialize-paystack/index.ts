import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    const email = payload.manager_email || payload.owner_email;
    const codes_purchased = Number(payload.student_code_limit || 1);

    if (!email || !codes_purchased) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amount = codes_purchased * 150 * 100;
    const reference = `resliving_setup_${Date.now()}`;
    const callback_url = `${Deno.env.get("SITE_URL")}/manager/dashboard/payment-success`;

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          reference,
          callback_url,
          metadata: {
            building_name: payload.building_name || "",
            building_address: payload.building_address || "",
            number_of_units: Number(payload.number_of_units || 0),
            numbering_format: payload.numbering_format || "numeric",
            manager_name: payload.manager_name || "",
            manager_email: payload.manager_email || "",
            manager_phone: payload.manager_phone || "",
            emergency_ambulance: payload.emergency_ambulance || "",
            emergency_fire: payload.emergency_fire || "",
            emergency_police: payload.emergency_police || "",
            max_visitors: Number(payload.max_visitors || 0),
            sleepover_fee: Number(payload.sleepover_fee || 0),
            house_rules_url: payload.house_rules_url || "",
            student_code_limit: codes_purchased,
            monthly_total: Number(payload.monthly_total || codes_purchased * 150),
            owner_email: payload.owner_email || "",
          },
        }),
      }
    );

    const data = await paystackRes.json();

    if (!paystackRes.ok) {
      return new Response(JSON.stringify(data), {
        status: paystackRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unexpected server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});