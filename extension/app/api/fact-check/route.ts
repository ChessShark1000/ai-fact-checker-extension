import { generateText } from "ai"

export async function POST(request: Request) {
  const { text } = await request.json()

  if (!text || text.length < 10) {
    return Response.json({
      error: "Text too short for fact-checking",
    })
  }

  try {
    const { text: response } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `You are a fact-checking AI. Analyze the following text and provide a truth rating from 1-10 (1 being completely false, 10 being completely true) and a brief explanation.

Text to check: "${text}"

Respond in JSON format with exactly these fields:
{
  "rating": <number 1-10>,
  "explanation": "<brief explanation of why you gave this rating>",
  "confidence": "<low/medium/high>",
  "sources": "<mention any well-known facts or sources if relevant>"
}`,
      temperature: 0.7,
    })

    // Parse the AI response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const result = JSON.parse(jsonMatch[0])

    return Response.json({
      rating: Math.max(1, Math.min(10, result.rating)),
      explanation: result.explanation || "Unable to verify this claim.",
      confidence: result.confidence || "medium",
      sources: result.sources || "",
      originalText: text,
    })
  } catch (error) {
    console.error("Fact-check error:", error)
    return Response.json({ error: "Failed to check fact" }, { status: 500 })
  }
}
