import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

// Initialize the Google Gen AI client with server-side API Key & Telemetry user agent
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Executes a generateContent call with transient error retry logic (503, 429, etc.),
 * and optional fallback model support (e.g. falling back from gemini-3.5-flash to gemini-3.1-flash-lite).
 */
export async function generateContentSafe(
  params: GenerateContentParameters,
  maxRetries = 2
): Promise<GenerateContentResponse> {
  const modelsToTry = [
    params.model || "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
  ];

  // De-duplicate model list
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const model of uniqueModels) {
    const runParams = { ...params, model };
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent(runParams);
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err || "").toLowerCase();
        const errStatus = err?.status || err?.code || "";
        
        // Check for common transient errors (e.g. 503, 429, or "UNAVAILABLE", "high demand", "RESOURCE_EXHAUSTED", "overloaded")
        const isTransient = 
          errMsg.includes("503") || 
          errMsg.includes("429") || 
          errMsg.includes("unavailable") || 
          errMsg.includes("high demand") || 
          errMsg.includes("resource exhausted") || 
          errMsg.includes("overloaded") ||
          errMsg.includes("busy") ||
          errStatus === "UNAVAILABLE" || 
          errStatus === 503 ||
          errStatus === 429;

        if (isTransient && attempt < maxRetries) {
          // Wait for transient retry with a brief delay (e.g. 400ms)
          await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
          continue;
        }
        // Break from inner loop to try the fallback model or bubble up
        break;
      }
    }
  }

  throw lastError || new Error("Failed to generate content from primary and fallback models");
}

