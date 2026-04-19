import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { email, residence_id, codes_purchased } = await req.json();

    if (!email || !residence_id || !codes_purchased) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const amount = Number(codes_purchased) * 150 * 100; // Paystack uses cents
    const reference = `resliving_${residence_id}_${Date.now()}`;

    const callback_url = `${Deno.env.get("SITE_URL")}/manager/dashboard/payment-success`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
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
          residence_id,
          codes_purchased,
        },
      }),
    });

    const data = await paystackRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});