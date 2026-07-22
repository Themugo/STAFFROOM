import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEMO_USERS = [
  {
    email: "owner@staffroom.demo",
    password: "Demo@123",
    full_name: "Platform Owner",
    role: "SYSTEM_OWNER",
    must_change_password: true,
  },
  {
    email: "admin@acmecorp.demo",
    password: "Demo@123",
    full_name: "Alice Admin",
    role: "ADMIN",
    must_change_password: false,
  },
  {
    email: "hr.admin@acmecorp.demo",
    password: "Demo@123",
    full_name: "Bob HR",
    role: "DEPARTMENT_ADMIN",
    must_change_password: false,
  },
  {
    email: "staff@acmecorp.demo",
    password: "Demo@123",
    full_name: "Carol Staff",
    role: "EMPLOYEE",
    must_change_password: false,
  },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results = [];

    // Fetch all existing users ONCE before the loop (fixes M19 N+1 query)
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const existingEmails = new Set(
      (allUsers?.users || []).map((u) => u.email?.toLowerCase())
    );

    for (const user of DEMO_USERS) {
      // Check if user exists using the pre-fetched list
      if (existingEmails.has(user.email.toLowerCase())) {
        results.push({ email: user.email, status: "already_exists" });
        continue;
      }

      // Create user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      });

      if (createError) {
        results.push({ email: user.email, status: "error", error: createError.message });
        continue;
      }

      // Update profile with role and must_change_password
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          role: user.role,
          must_change_password: user.must_change_password,
        })
        .eq("id", newUser.user.id);

      if (updateError) {
        results.push({ email: user.email, status: "created_but_profile_failed", error: updateError.message });
      } else {
        results.push({
          email: user.email,
          status: "created",
          id: newUser.user.id,
          role: user.role,
          must_change_password: user.must_change_password,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
