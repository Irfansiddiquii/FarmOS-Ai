import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";

const SECRET = process.env.ROLE_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json({ error: "ROLE_SECRET environment variable is not set on the server" }, { status: 500 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // If Supabase keys are configured, check profile role on the server
    if (supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: profile, error: dbErr } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (dbErr || !profile) {
        return NextResponse.json({ error: "User profile not found inside the secure store" }, { status: 403 });
      }

      // Restrict role switching: non-admins can only sign their registered role
      if (profile.role !== "admin" && role !== profile.role) {
        return NextResponse.json({ error: "Unauthorized role transition action" }, { status: 403 });
      }
    } else {
      // Fallback for verification/mock environment only if keys are missing
      const ALLOWED_ADMINS = ["usr-1", "usr-3"];
      if (role === "admin" && !ALLOWED_ADMINS.includes(userId)) {
        return NextResponse.json({ error: "Unauthorized admin signature request" }, { status: 403 });
      }
    }

    const hmac = createHmac("sha256", SECRET);
    hmac.update(`${userId}:${role}`);
    const signature = hmac.digest("hex");

    return NextResponse.json({ signature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
