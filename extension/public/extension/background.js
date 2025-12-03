// Service worker for the extension

// Import config (will be available globally)
importScripts('config.js');

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Fact Checker extension installed")
})

// Keep service worker alive
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.type);
  
  if (request.type === "FACT_CHECK") {
    handleFactCheck(request.text, sendResponse)
    return true // Keep the channel open for async response
  }
  
  if (request.type === "MORE_CONTEXT") {
    handleMoreContext(request.text, request.truthLevel, sendResponse)
    return true
  }
  
  if (request.type === "CHAT_MESSAGE") {
    handleChatMessage(request.message, request.context, sendResponse)
    return true
  }
})

async function handleFactCheck(text, sendResponse) {
  try {
    console.log('Fact checking text:', text);
    
    const response = await fetch(`${BACKEND_URL}/api/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('Backend error:', err)
      sendResponse({ error: err.error || 'Backend request failed' })
      return
    }
    
    const data = await response.json()
    console.log('Backend response:', data)
    
    sendResponse(data)
  } catch (error) {
    console.error('Fact check error:', error);
    sendResponse({ error: error.message })
  }
}

async function handleMoreContext(text, truthLevel, sendResponse) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/more-context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, truthLevel })
    })
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      sendResponse({ error: err.error || 'Backend request failed' })
      return
    }
    
    const data = await response.json()
    sendResponse(data)
  } catch (error) {
    sendResponse({ error: error.message })
  }
}

async function handleChatMessage(message, context, sendResponse) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, context })
    })
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      sendResponse({ error: err.error || 'Backend request failed' })
      return
    }
    
    const data = await response.json()
    sendResponse(data)
  } catch (error) {
    sendResponse({ error: error.message })
  }
}

// Debug: run a batch of test prompts and log outputs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TEST_RUN') {
    const tests = request.prompts || [
      'The sky is green.',
      'Barack Obama was the 44th President of the USA.',
      'COVID-19 vaccines cause microchips.',
      'The Eiffel Tower is in Paris.'
    ]
    (async () => {
      for (const t of tests) {
        await new Promise((resolve) => {
          handleFactCheck(t, (res) => {
            console.log('TEST RESULT for:', t, '=>', res)
            resolve()
          })
        })
      }
      sendResponse({ ok: true })
    })()
    return true
  }
})
