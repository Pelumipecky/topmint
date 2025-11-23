import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin(email, password, name = 'Admin') {
  // Sign up the user with Supabase Auth
  const response = await supabase.auth.signUp({
    email,
    password,
  });

  const user = response.data?.user;
  const signUpError = response.error;
  console.log('SignUp response:', response);
  if (signUpError || !user) {
    console.error('Error creating admin user:', signUpError);
    return;
  }

  // Insert admin record into userlogs table
  const { data, error: insertError } = await supabase
    .from('userlogs')
    .insert([
      {
        name,
        email,
        admin: true,
        uid: user.id,
        created_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    console.error('Error inserting admin record:', insertError.message);
    return;
  }

  console.log('Admin created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
}

// Example usage:
// Replace with your desired email and password
createAdmin('admin@topmint.com', 'Admin123!', 'Admin');
