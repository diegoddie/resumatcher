import { stripe } from "@/utils/stripe/stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST() {
  try {
    // The user comes from the Clerk session, never from the request body
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Recupera l'ID cliente Stripe dal database
    const supabase = await createAdminClient();
    
    // Prima otteniamo il subscription_id
    const { data: subscriptionData, error } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", userId)
      .single();

    if (error || !subscriptionData?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No subscription found for this user" },
        { status: 404 }
      );
    }

    // Recupera il customer ID dalla sottoscrizione Stripe
    let customerId: string;
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);
      customerId = subscription.customer as string;
    } catch {
      // Sottoscrizione di un altro account Stripe (es. account precedente)
      return NextResponse.json(
        { error: "No subscription found for this user" },
        { status: 404 }
      );
    }

    // Crea la sessione del portale clienti
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
