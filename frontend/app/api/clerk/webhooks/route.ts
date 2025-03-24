import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(req: Request){
    const SIGNING_SECRET = process.env.SIGNING_SECRET
  
  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Get event type
  const eventType = evt.type

  // Initialize Supabase client
  const supabase = await createAdminClient()

  // Handle different webhook events
  try {
    switch (eventType) {
      case 'user.created': {
        // Extract user data from the webhook event
        const { id, email_addresses, image_url, first_name, last_name } = evt.data

        const primaryEmail = email_addresses?.[0]?.email_address

        // Insert the new user into Supabase
        const { error } = await supabase
          .from('users')
          .insert({
            id,
            email: primaryEmail,
            first_name,
            last_name,
            avatar_url: image_url,
            created_at: new Date().toISOString(),
          })

        if (error) {
          console.error('Error creating user in Supabase:', error)
          return new Response(`Error creating user: ${error.message}`, { status: 500 })
        }

        return new Response('User created successfully', { status: 200 })
      }
      
      case 'user.updated': {
        // Extract user data from the webhook event
        const { id, email_addresses, image_url, first_name, last_name } = evt.data

        const primaryEmail = email_addresses?.[0]?.email_address

        // Update the user in Supabase
        const { error } = await supabase
          .from('users')
          .update({
            email: primaryEmail,
            first_name,
            last_name,
            avatar_url: image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)

        if (error) {
          console.error('Error updating user in Supabase:', error)
          return new Response(`Error updating user: ${error.message}`, { status: 500 })
        }

        return new Response('User updated successfully', { status: 200 })
      }
      
      case 'user.deleted': {
        // Extract user ID from the webhook event
        const { id } = evt.data

        // Delete the user from Supabase
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting user from Supabase:', error)
          return new Response(`Error deleting user: ${error.message}`, { status: 500 })
        }

        return new Response('User deleted successfully', { status: 200 })
      }
      
      default:
        // For any other event types, acknowledge receipt
        return new Response('Webhook received', { status: 200 })
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}