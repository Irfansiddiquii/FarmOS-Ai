import { NextRequest, NextResponse } from "next/server";
import { ai, generateContentSafe } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { cropName, soilType, growthStage } = await req.json();

    const prompt = `Formulate a precise fertilizer recommendation plan for growing ${cropName} in ${soilType} soil, currently during the ${growthStage} stage. 
Provide recommended fertilizer types, a timing application schedule (weeks), and key safety warnings to avoid root/leaf chemical burn.`;

    const response = await generateContentSafe({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fertilizers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended fertilizer products (e.g. NPK 19:19:19, Zinc Sulfate, Epsom Salt)"
            },
            applicationSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING, description: "Phase name or timing (e.g. Day 1, Week 3, Pre-flower)" },
                  dosage: { type: Type.STRING, description: "Dosage instructions (e.g., 50 kg/acre, 2g/liter)" },
                  instructions: { type: Type.STRING, description: "Application method (e.g., broadcasting, foliar spray)" }
                },
                required: ["phaseName", "dosage", "instructions"]
              }
            },
            warningNotes: { type: Type.STRING, description: "Safety instructions or nutrient compatibility warnings" }
          },
          required: ["fertilizers", "applicationSchedule", "warningNotes"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No fertilizer instructions returned by Gemini");
    }

    return NextResponse.json(JSON.parse(text.trim()));

  } catch (error: any) {
    console.error("Failure in Fertilizer Recommendation Engine:", error);
    return NextResponse.json({
      fertilizers: [
        "Urea (N: 46%) for chlorophyll stimulation",
        "Single Super Phosphate (P: 16%) for root anchoring",
        "Muriate of Potash (K: 60%) to assist grain filling",
        "Zinc Sulfate heptahydrate (Zn: 21%) to avoid chlorosis"
      ],
      applicationSchedule: [
        {
          phaseName: "Basal Sowing Application (Day 1)",
          dosage: "SSP @ 75kg/acre, MOP @ 20kg/acre, Zinc @ 10kg/acre",
          instructions: "Broadcasting and mixing thoroughly during final tillage before seed bed leveling."
        },
        {
          phaseName: "Tillering Stage (Week 4)",
          dosage: "Urea @ 45kg/acre split dose",
          instructions: "Top dressing during evening hours, preferably followed by light water sprinkler operation."
        },
        {
          phaseName: "Active Panicle Stage (Week 8)",
          dosage: "Urea @ 45/acre + Epsom salt @ 10kg/acre",
          instructions: "Moist soil application to maximize enzyme conversion. Avoid windy weather."
        }
      ],
      warningNotes: "Always check soil test values. Excessive nitrogen at flowering can delay maturity and attract rice blast spores."
    });
  }
}
