"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [installed, setInstalled] = useState(false)

  const downloadExtension = () => {
    // Create a zip file with the manifest and extension files
    const link = document.createElement("a")
    link.href = "/manifest.json"
    link.download = "ai-fact-checker-manifest.json"
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Fact Checker</h1>
          <p className="text-xl text-gray-700 mb-8">
            Instantly verify any text with AI-powered fact-checking. Just highlight text and get a truth rating.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button onClick={downloadExtension} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Download Extension
            </Button>
            <Button variant="outline" size="lg" onClick={() => setInstalled(!installed)}>
              How to Install
            </Button>
          </div>

          {installed && (
            <Card className="bg-blue-50 border-blue-200 p-6 text-left">
              <h3 className="font-bold text-lg mb-4">Installation Steps:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Download the extension files (manifest.json and content.js)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>
                    Open Chrome and go to <code className="bg-white px-2 py-1 rounded">chrome://extensions/</code>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Enable "Developer mode" in the top right</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>Click "Load unpacked" and select the extension folder</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">5.</span>
                  <span>Now highlight any text on any website to fact-check it!</span>
                </li>
              </ol>
            </Card>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-lg mb-2">Instant Results</h3>
            <p className="text-gray-600">Get immediate fact-check results with a 1-10 truth rating</p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
            <p className="text-gray-600">Uses advanced AI to analyze and verify claims across any topic</p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-bold text-lg mb-2">Chat Support</h3>
            <p className="text-gray-600">Ask follow-up questions and get deeper context with our AI assistant</p>
          </Card>
        </div>

        {/* Usage Example */}
        <Card className="p-8 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-700">
            <p>1. Simply highlight any text on a webpage</p>
            <p>2. A popup appears with an instant fact-check result</p>
            <p>3. Review the truth rating (1-10) and explanation</p>
            <p>4. Click "More Context" to open an interactive chat for deeper analysis</p>
            <p>5. Ask follow-up questions to understand why a claim is true or false</p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p>Powered by AI • Built for accuracy and transparency</p>
        </div>
      </div>
    </main>
  )
}
