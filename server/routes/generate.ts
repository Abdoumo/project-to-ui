import { RequestHandler } from "express";
import OpenAI from "openai";

interface GenerateRequest {
  platform: "web" | "mobile";
  description: string;
}

interface GenerateResponse {
  appStructure: string;
  screens: string;
  designSystem: string;
  code: string;
}

export const handleGenerate: RequestHandler = async (req, res) => {
  try {
    const { platform, description } = req.body as GenerateRequest;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const lmStudioApiUrl = process.env.LM_STUDIO_API_URL;
    const lmStudioModel = process.env.LM_STUDIO_MODEL;

    if (!lmStudioApiUrl || !lmStudioModel) {
      console.error("LM Studio configuration not found in .env file");
      return res.status(500).json({ error: "LM Studio configuration not found" });
    }

    const prompt = `You are an expert UI/UX designer and frontend architect. Generate a complete app design based on this description:

App Type: ${platform === "web" ? "Web App" : "Mobile App"}
Description: ${description}

Provide your response in this exact format:

APP STRUCTURE:
[Provide a brief overview of the app structure, main roles, and panels]

SCREENS:
[List key screens/pages with descriptions and key components]

DESIGN SYSTEM:
[Define color palette (use modern colors), typography, spacing, and UI style]

CODE TEMPLATE:
[Provide a basic React/HTML template structure the user can build upon]

Focus on:
- Clean, modern UI (minimal, similar to Notion + Vercel style)
- Responsive design
- Realistic content (no lorem ipsum)
- Production-ready approach`;

    console.log("Calling LM Studio API for platform:", platform);
    console.log("Using model:", lmStudioModel);

    let generatedText: string;

    try {
      const rawResponse = await fetch(`${lmStudioApiUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: lmStudioModel,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!rawResponse.ok) {
        const errorData = await rawResponse.text();
        console.error("LM Studio API error:", rawResponse.status, errorData);
        return res.status(rawResponse.status).json({
          error: `LM Studio API error: ${rawResponse.status} - ${errorData}`
        });
      }

      const response = await rawResponse.json();
      console.log("LM Studio response:", JSON.stringify(response, null, 2));

      if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        console.error("Invalid LM Studio response format:", response);
        return res.status(500).json({
          error: "Invalid API response: no choices returned. Check LM Studio logs."
        });
      }

      generatedText = response.choices[0]?.message?.content;

      if (!generatedText) {
        console.error("No text in LM Studio response:", response);
        return res.status(500).json({ error: "No content generated from API" });
      }
    } catch (fetchError) {
      console.error("LM Studio fetch error:", fetchError);
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      return res.status(500).json({
        error: `Failed to connect to LM Studio: ${errorMsg}. Ensure it's running at ${lmStudioApiUrl}`
      });
    }

    const genResult: GenerateResponse = {
      appStructure: extractSection(generatedText, "APP STRUCTURE"),
      screens: extractSection(generatedText, "SCREENS"),
      designSystem: extractSection(generatedText, "DESIGN SYSTEM"),
      code: extractSection(generatedText, "CODE TEMPLATE"),
    };

    console.log("Successfully generated app design");
    res.json(genResult);
  } catch (error) {
    console.error("Generation error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: `Server error: ${errorMsg}` });
  }
};

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:(.+?)(?=\\n[A-Z]+:|$)`, "is");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}
