import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Webhook secret is missing", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`⚠️ Webhook signature verification failed: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  // Inizializzo il client Supabase
  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        if (!userId || !subscriptionId) {
          console.error("Missing required data in webhook", { userId, subscriptionId });
          return new NextResponse("Missing required data", { status: 400 });
        }

        console.log(`🔔 Checkout completed for user ${userId}`);

        // Recupero i dettagli dell'abbonamento da Stripe
        const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId);
        const currentPeriodEnd = new Date(subscriptionDetails.current_period_end * 1000);
        const currentPeriodStart = new Date(subscriptionDetails.current_period_start * 1000);

        // Controllo se esiste già una sottoscrizione per questo utente
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (existingSubscription) {
          // Aggiorno la sottoscrizione esistente
          await supabase
            .from("subscriptions")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan: "pro",
              credits: 999999, // Praticamente illimitati
              is_active: true,
              start_date: currentPeriodStart.toISOString(),
              end_date: currentPeriodEnd.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else {
          // Creo una nuova sottoscrizione
          await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan: "pro",
              credits: 999999, // Praticamente illimitati
              is_active: true,
              start_date: currentPeriodStart.toISOString(),
              end_date: currentPeriodEnd.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Recupero il customer ID e trovo l'utente corrispondente
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
        
        if (subscriptionData) {
          console.log(`🔔 Subscription updated for user ${subscriptionData.user_id}`);
          
          // Determino il piano in base allo stato della sottoscrizione
          const plan = subscription.status === "active" ? "pro" : "free";
          const credits = plan === "pro" ? 999999 : 3;
          const isActive = subscription.status === "active";
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          const currentPeriodStart = new Date(subscription.current_period_start * 1000);
          
          // Aggiorno la sottoscrizione nel database
          await supabase
            .from("subscriptions")
            .update({
              plan,
              credits,
              is_active: isActive,
              start_date: currentPeriodStart.toISOString(),
              end_date: currentPeriodEnd.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`🔔 Subscription cancelled: ${subscription.id}`);
        
        // Trova l'utente dalla sottoscrizione
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
        
        if (subscriptionData) {
          // Ripristina il piano gratuito
          await supabase
            .from("subscriptions")
            .update({
              plan: "free",
              credits: 3,
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        // Opzionale: aggiorna lo stato della sottoscrizione o invia un'email all'utente
        console.log(`🔔 Payment failed for subscription: ${subscriptionId}`);
        break;
      }
      
      default: {
        console.log(`🔔 Unhandled event type: ${event.type}`);
      }
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
