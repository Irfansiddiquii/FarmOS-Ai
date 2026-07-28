import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log("=== CHECKING AUTH USERS ===");
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Failed to list auth users:", authError);
  } else {
    console.log(`Found ${users?.length} users in auth.users pool:`);
    users?.forEach(u => {
      console.log(`- ID: ${u.id} | Email: ${u.email} | CreatedAt: ${u.created_at} | Meta:`, u.user_metadata);
    });
  }

  console.log("\n=== CHECKING PUBLIC PROFILES ===");
  const { data: profiles, error: profError } = await supabase.from("profiles").select("*");
  if (profError) {
    console.error("Failed to list profiles:", profError);
  } else {
    console.log(`Found ${profiles?.length} profiles in public.profiles:`);
    profiles?.forEach(p => {
      console.log(`- ID: ${p.id} | Email: ${p.email} | Name: ${p.name} | Role: ${p.role}`);
    });
  }
}

run();
