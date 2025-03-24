import { stripe } from "@/utils/stripe/stripe";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .single();

    let customerId: string | undefined = undefined;
    
    // Se esiste già una sottoscrizione, recuperiamo il customerId da Stripe
    if (subscriptionData?.stripe_subscription_id) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);
      customerId = subscription.customer as string;
    } else {
      // Se non esiste, creiamo un nuovo cliente Stripe
      const { data: userData } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (userData) {
        // Crea un nuovo cliente Stripe
        const customer = await stripe.customers.create({
          email: userData.email,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          metadata: {
            userId: userId
          }
        });
        
        customerId = customer.id;
      }
    }

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 