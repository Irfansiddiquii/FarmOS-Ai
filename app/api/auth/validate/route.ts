import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = process.env.ROLE_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json({ valid: false, error: "ROLE_SECRET environment variable is not set on the server" }, { status: 500 });
    }

    const { userId, role, signature } = await req.json();

    if (!userId || !role || !signature) {
      return NextResponse.json({ valid: false, reason: "Missing validation payload" }, { status: 200 });
    }

    const hmac = createHmac("sha256", SECRET);
    hmac.update(`${userId}:${role}`);
    const expectedSignature = hmac.digest("hex");

    if (signature === expectedSignature) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, reason: "Signature mismatch" });
    }
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
