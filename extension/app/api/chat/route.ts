import { generateText } from "ai"

export async function POST(request: Request) {
  const { text, question, conversationHistory } = await request.json()

  if (!text || !question) {
    return Response.json({ error: "Missing required fields" })
  }

  try {
    // Build conversation context
    const conversationContext = conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")

    const { text: response } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `You are a helpful fact-checking assistant. The user highlighted this text for fact-checking:

"${text}"

Previous conversation:
${conversationContext}

User question: ${question}

Provide a helpful, concise response that helps the user understand the claim better. Be factual and explain your reasoning.`,
      temperature: 0.7,
    })

    return Response.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
