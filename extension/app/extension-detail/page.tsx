"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ExtensionDetailPage() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get text from query parameter
    const params = new URLSearchParams(window.location.search)
    const selectedText = params.get("text")
    if (selectedText) {
      setText(decodeURIComponent(selectedText))
      // Initial AI response
      generateInitialResponse(decodeURIComponent(selectedText))
    }
  }, [])

  const generateInitialResponse = async (selectedText: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      })
      const data = await response.json()
      setMessages([
        {
          role: "assistant",
          content: `Fact Check: ${data.explanation}\n\nConfidence: ${data.confidence}\n\nRating: ${data.rating}/10`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    setInputValue("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          question: userMessage,
          conversationHistory: messages,
        }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Detailed Fact Check</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-gray-700">{text}</p>
          </div>

          <div className="space-y-4 mb-6 h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center text-gray-500">
                <p>Thinking...</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask a follow-up question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
