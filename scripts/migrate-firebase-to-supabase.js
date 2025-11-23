import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Path to your exported Firebase JSON file
const firebaseDataPath = './firebase-export.json';

// Supabase table name
const supabaseTable = 'userlogs';

async function migrateFirebaseToSupabase() {
  // Read Firebase data
  const rawData = fs.readFileSync(firebaseDataPath);
  const firebaseData = JSON.parse(rawData);

  // Example: Firestore export format
  // { "users": { "userId1": { ...userData }, "userId2": { ...userData } } }
  const users = firebaseData.users || firebaseData;

  // Prepare data for Supabase
  const records = Object.values(users).map(user => ({
    name: user.name || 'Unknown',
    email: user.email,
    admin: user.admin || false,
    uid: user.uid || user.id,
    createdAt: user.createdAt || new Date().toISOString(),
    // Add other fields as needed
  }));

  // Insert records in batches
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase.from(supabaseTable).insert(batch);
    if (error) {
      console.error('Error inserting batch:', error.message);
      return;
    }
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }

  console.log('Migration complete!');
}

migrateFirebaseToSupabase();
