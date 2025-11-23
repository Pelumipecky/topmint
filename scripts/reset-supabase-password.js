import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function resetPassword(email, newPassword) {
  // Supabase Admin API does not allow password reset via client SDK for security reasons.
  // You must use the Supabase dashboard or REST API with service role key.
  console.log('To reset a password, use the Supabase dashboard (Authentication > Users > Reset Password) or the REST API with service role key.');
  console.log(`Email: ${email}`);
  console.log(`New Password: ${newPassword}`);
}

// Example usage:
resetPassword('admin@topmint.com', 'Admin123!');
