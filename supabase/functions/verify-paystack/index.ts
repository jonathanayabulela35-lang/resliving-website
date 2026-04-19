import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

serve(async (req) => {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Missing reference" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({
          error: verifyJson?.message || "Failed to verify Paystack payment",
          details: verifyJson,
        }),
        { status: verifyRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const payment = verifyJson?.data;

    if (!payment || payment.status !== "success") {
      return new Response(
        JSON.stringify({
          error: "Payment was not successful",
          details: payment,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const metadata = payment.metadata || {};

    const building_name = metadata.building_name || "";
    const building_address = metadata.building_address || "";
    const number_of_units = Number(metadata.number_of_units || 0);
    const numbering_format = metadata.numbering_format || "numeric";
    const manager_name = metadata.manager_name || "";
    const manager_email = metadata.manager_email || payment.customer?.email || "";
    const manager_phone = metadata.manager_phone || "";
    const emergency_ambulance = metadata.emergency_ambulance || "";
    const emergency_fire = metadata.emergency_fire || "";
    const emergency_police = metadata.emergency_police || "";
    const max_visitors = Number(metadata.max_visitors || 0);
    const sleepover_fee = Number(metadata.sleepover_fee || 0);
    const house_rules_url = metadata.house_rules_url || "";
    const student_code_limit = Number(metadata.student_code_limit || 1);
    const owner_email = metadata.owner_email || manager_email;
    const monthly_total = Number(metadata.monthly_total || (student_code_limit * 150));

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") || "https://resliving.co.za";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase server environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 1);

    const security_code = `SEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { data: residence, error: residenceError } = await supabase
      .from("residences")
      .insert({
        name: building_name,
        address: building_address,
        num_units: number_of_units,
        numbering_format,
        manager_name,
        manager_email,
        manager_phone,
        emergency_ambulance,
        emergency_fire,
        emergency_police,
        max_visitors,
        sleepover_fee,
        house_rules_url,
        security_code,
        subscription_status: "active",
        subscription_expires_at: end.toISOString(),
        student_code_limit,
        codes_purchased: student_code_limit,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: end.toISOString(),
        last_payment_date: now.toISOString(),
        owner_email,
      })
      .select()
      .single();

    if (residenceError) {
      return new Response(
        JSON.stringify({
          error: residenceError.message,
          where: "creating residence",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const generateUnitLabels = (count: number, format: string) => {
      const labels: string[] = [];

      for (let i = 1; i <= count; i++) {
        if (format === "numeric") {
          labels.push(String(i));
        } else {
          labels.push(`Unit ${i}`);
        }
      }

      return labels;
    };

    const generateUnitCode = () =>
      `UNIT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const labels = generateUnitLabels(student_code_limit, numbering_format);

    const units = labels.map((label) => ({
      residence_id: residence.id,
      unit_number: label,
      unit_code: generateUnitCode(),
      is_occupied: false,
    }));

    const { error: unitsError } = await supabase
      .from("units")
      .insert(units);

    if (unitsError) {
      return new Response(
        JSON.stringify({
          error: unitsError.message,
          where: "creating units",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (resendApiKey && manager_email) {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: "ResLiving <info@resliving.co.za>",
          to: [manager_email],
          subject: "Payment Successful — Your ResLiving Building Is Now Active",
          html: `
            <h2>Payment Successful</h2>

            <p>Hello ${manager_name || "Manager"},</p>

            <p>Your payment has been successfully received and your ResLiving building is now active.</p>

            <h3>Subscription Details</h3>
            <ul>
              <li><strong>Building:</strong> ${building_name}</li>
              <li><strong>Student Codes:</strong> ${student_code_limit}</li>
              <li><strong>Monthly Subscription:</strong> R${monthly_total}/month</li>
            </ul>

            <p>Your building has been fully set up, and your security and student access codes have been generated.</p>

            <p>You can now manage your building, monitor activity, and access all features from your dashboard.</p>

            <p>
              <a href="${siteUrl}/manager/dashboard">
                Go to Dashboard
              </a>
            </p>

            <hr />

            <p style="font-size: 12px; color: #666;">
              If you did not make this payment, please contact us immediately at info@resliving.co.za.
            </p>

            <p>— ResLiving</p>
          `,
        });
      } catch (emailError) {
        console.error("Resend email error:", emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified, building activated, and confirmation email sent",
        residence_id: residence.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unexpected server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});