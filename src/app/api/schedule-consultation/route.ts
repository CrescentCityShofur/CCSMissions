import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? "";

const BASE_FEE = 15000;
const GROWTH_FUND_RATE = 0.10;
const TRAVEL_THRESHOLD_MILES = 30;
const TRAVEL_SURCHARGE_PER_MILE = 100;
const CCS_HQ_ADDRESS = "New Orleans, LA";

async function getTravelDistance(destination: string): Promise<number> {
  if (!googleMapsApiKey) return 0;
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(CCS_HQ_ADDRESS)}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${googleMapsApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const distanceText = data?.rows?.[0]?.elements?.[0]?.distance?.text;
    if (distanceText) {
      const miles = parseFloat(distanceText.replace(/[^0-9.]/g, ""));
      return isNaN(miles) ? 0 : miles;
    }
    return 0;
  } catch {
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["stakeholderName", "stakeholderEmail", "stakeholderPhone", "meetingType", "siteAddress", "preferredDate", "preferredTime"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const isOnsite = body.meetingType === "onsite";
    let travelSurcharge = 0;
    let distanceMiles = 0;

    if (isOnsite) {
      distanceMiles = await getTravelDistance(body.siteAddress);
      if (distanceMiles > TRAVEL_THRESHOLD_MILES) {
        travelSurcharge = Math.round((distanceMiles - TRAVEL_THRESHOLD_MILES) * TRAVEL_SURCHARGE_PER_MILE);
      }
    }

    const growthFund = Math.round(BASE_FEE * GROWTH_FUND_RATE);
    const totalPrice = BASE_FEE + growthFund + travelSurcharge;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error: dbError } = await supabase
      .from("consultations")
      .insert({
        stakeholder_name: body.stakeholderName,
        stakeholder_email: body.stakeholderEmail,
        stakeholder_phone: body.stakeholderPhone,
        meeting_type: body.meetingType,
        site_address: body.siteAddress,
        preferred_date: body.preferredDate,
        preferred_time: body.preferredTime,
        base_fee: BASE_FEE,
        growth_fund: growthFund,
        travel_surcharge: travelSurcharge,
        total_price: totalPrice,
        price: totalPrice / 100,
        distance_miles: distanceMiles || null,
        status: "pending_payment",
        paid: false,
      })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json({ error: "Failed to save consultation request." }, { status: 500 });
    }

    const consultationId = data.id;

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY." }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: totalPrice,
            product_data: {
              name: `CCS Missions Consultation — ${body.meetingType === "onsite" ? "On-Site" : "Virtual"}`,
              description: `Consultation for ${body.stakeholderName} on ${body.preferredDate} at ${body.preferredTime}.`,
            },
          },
        },
      ],
      metadata: { consultation_id: consultationId, stakeholder_email: body.stakeholderEmail },
      success_url: `${req.headers.get("origin") ?? ""}/success?consultation=${consultationId}`,
      cancel_url: `${req.headers.get("origin") ?? ""}/`,
    });

    await supabase
      .from("consultations")
      .update({ stripe_checkout_url: session.url })
      .eq("id", consultationId);

    return NextResponse.json({ checkoutUrl: session.url, price: totalPrice, consultationId });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal server error." }, { status: 500 });
  }
}
