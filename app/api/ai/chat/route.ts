import { NextRequest, NextResponse } from "next/server";
import { ai, generateContentSafe } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request messages" }, { status: 400 });
    }

    // Build history / system instruction combination
    const systemPrompt = `You are FarmOS AI, a certified, world-class agronomist, crop doctor, and intelligent agricultural advisor. 
You assist farmers with soil preparation, crop selection, nutrient schedules, disease diagnosis, weather management, market selling tips, and equipment operations.

Key Guidelines:
1. Provide accurate, practical, actionable agricultural advice.
2. support multiple languages: English, Hindi (हिन्दी), and Hindi written in Latin script (Hinglish) based on the user's input language.
3. Be respectful, supportive, humble, and friendly.
4. If appropriate, recommend modern practices like organic farming, drip irrigation, or precise fertilizer splitting.
5. Advise on prevention strategies (e.g., maintaining moisture, crop rotation).

Farmer's Current Context:
- State/Location: ${context?.state || "Unknown"}
- District: ${context?.district || "Unknown"}
- Farms Managed: ${JSON.stringify(context?.farms || [])}
- Active Sown Crops: ${JSON.stringify(context?.crops || [])}
`;

    // Convert messages to Gemini format or send as a chat prompt
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Create actual content history
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Generate output
    const response = await generateContentSafe({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I am currently analyzing your agricultural query. Could you please specify your crop variety?";
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Gemini Assistant Route Error:", error);
    return NextResponse.json({ 
      reply: "Agronomy service is briefly busy. Please verify your internet connection. (Error: " + (error.message || "Connection Limit") + ")" 
    }, { status: 200 }); // Return cleanly to client with a helpful message
  }
}
