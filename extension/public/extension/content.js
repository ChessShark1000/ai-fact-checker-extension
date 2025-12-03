// Content script injected into web pages

// Create styles for the popup
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  .fact-checker-popup {
    position: fixed;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    max-width: 280px;
    width: 280px;
    padding: 20px;
    color: #1a1a1a;
    transition: all 0.3s ease;
    max-height: 500px;
    overflow-y: scroll;
  }
  
  .fact-checker-popup.expanded {
    max-height: 500px;
  }
  
  .fact-checker-popup.dark {
    background: #1f1f1f;
    color: #f5f5f5;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .fact-checker-popup h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .fact-checker-popup.dark h3 {
    color: #f5f5f5;
  }
  
  .fact-icon {
    font-size: 24px;
  }
  
  .truth-rating {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .truth-score-circle {
    position: relative;
    width: 70px;
    height: 70px;
    flex-shrink: 0;
  }
  
  .score-circle-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(from 0deg, var(--score-color) 0%, var(--score-color) var(--score-percent), #f3f4f6 var(--score-percent), #f3f4f6 100%);
  }
  
  .fact-checker-popup.dark .score-circle-bg {
    background: conic-gradient(from 0deg, var(--score-color) 0%, var(--score-color) var(--score-percent), #2a2a2a var(--score-percent), #2a2a2a 100%);
  }
  
  .score-circle-inner {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .fact-checker-popup.dark .score-circle-inner {
    background: #1f1f1f;
  }
  
  .truth-score {
    font-size: 20px;
    font-weight: 700;
    color: var(--score-color);
  }
  
  .rating-details {
    flex: 1;
  }
  
  .rating-label {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--score-color);
  }
  
  .rating-description {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
  }
  
  .fact-checker-popup.dark .rating-description {
    color: #9ca3af;
  }
  
  .explanation {
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 20px;
    color: #374151;
    padding: 14px;
    background: #f9fafb;
    border-radius: 8px;
    border-left: 3px solid var(--score-color);
  }
  
  .fact-checker-popup.dark .explanation {
    color: #d1d5db;
    background: #2a2a2a;
  }
  
  .popup-actions {
    display: flex;
    gap: 0;
  }
  
  .btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
    line-height: 1;
  }
  
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
  }
  
  .fact-checker-popup.dark .close-btn {
    color: #6b7280;
  }
  
  .fact-checker-popup.dark .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }
  

  

  
  .loading {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  .fact-checker-popup.dark .spinner {
    border-color: #2a2a2a;
    border-top-color: #3b82f6;
  }
  
  .loading p {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 500;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .expanded-content {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  
  .fact-checker-popup.dark .expanded-content {
    border-top-color: #404040;
  }
  
  .detailed-explanation {
    font-size: 13px;
    line-height: 1.6;
    color: #374151;
  }
  
  .fact-checker-popup.dark .detailed-explanation {
    color: #d1d5db;
  }
  
  .detailed-explanation h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a1a1a;
  }
  
  .fact-checker-popup.dark .detailed-explanation h4 {
    color: #f5f5f5;
  }
  
  .detailed-explanation p {
    margin-bottom: 10px;
  }
  
  .detailed-explanation p:last-child {
    margin-bottom: 0;
  }
  
  .chat-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  
  .fact-checker-popup.dark .chat-section {
    border-top-color: #404040;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  .chat-header h4 {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }
  
  .fact-checker-popup.dark .chat-header h4 {
    color: #d1d5db;
  }
  
  .chat-toggle-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chat-toggle-btn:hover {
    background: #2563eb;
  }
  
  .chat-container {
    display: none;
  }
  
  .chat-container.active {
    display: block;
  }
  
  .chat-messages {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .chat-message {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.4;
  }
  
  .chat-message.user {
    background: #3b82f6;
    color: white;
    align-self: flex-end;
    max-width: 85%;
  }
  
  .chat-message.ai {
    background: #f3f4f6;
    color: #374151;
    align-self: flex-start;
    max-width: 85%;
  }
  
  .fact-checker-popup.dark .chat-message.ai {
    background: #2a2a2a;
    color: #d1d5db;
  }
  
  .chat-input-container {
    display: flex;
    gap: 6px;
  }
  
  .chat-input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 12px;
    font-family: inherit;
    outline: none;
  }
  
  .chat-input:focus {
    border-color: #3b82f6;
  }
  
  .fact-checker-popup.dark .chat-input {
    background: #2a2a2a;
    border-color: #404040;
    color: #f5f5f5;
  }
  
  .chat-send-btn {
    padding: 8px 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chat-send-btn:hover {
    background: #2563eb;
  }
  
  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .typing-indicator {
    display: inline-block;
    font-size: 16px;
    letter-spacing: 2px;
    animation: typing 1.4s infinite;
  }
  
  @keyframes typing {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  

`
document.head.appendChild(styleSheet)

console.log('=== AI Fact Checker Content Script Loaded ===');

// Extension state
let extensionEnabled = true;
let lastSelectedText = '';
let popupJustClosed = false;

// Load extension state
chrome.storage.sync.get(['extensionEnabled'], (result) => {
  extensionEnabled = result.extensionEnabled !== false;
  console.log('AI Fact Checker loaded. Enabled:', extensionEnabled);
});

// Listen for state changes
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_EXTENSION') {
    extensionEnabled = message.enabled;
    console.log('AI Fact Checker toggled. Enabled:', extensionEnabled);
    if (!extensionEnabled) {
      hideFactCheckerPopup();
    }
  }
});

// Listen for text selection
document.addEventListener("mouseup", (e) => {
  console.log('Mouseup event detected');
  
  // Don't trigger if clicking inside the popup
  if (e.target.closest('.fact-checker-popup')) {
    console.log('Clicked inside popup, ignoring');
    return;
  }
  
  // If popup was just closed, ignore this mouseup event
  if (popupJustClosed) {
    console.log('Popup just closed, ignoring this event');
    popupJustClosed = false;
    return;
  }
  
  if (!extensionEnabled) {
    console.log('AI Fact Checker is disabled');
    return;
  }
  
  const selectedText = window.getSelection().toString().trim()
  console.log('Selected text length:', selectedText.length, 'Text:', selectedText.substring(0, 50));

  // Only show popup if text is new and long enough
  if (selectedText && selectedText.length > 10 && selectedText !== lastSelectedText) {
    console.log('Showing fact checker popup');
    lastSelectedText = selectedText;
    showFactCheckerPopup(selectedText)
  } else if (!selectedText || selectedText.length <= 10) {
    console.log('Text too short or empty, hiding popup');
    lastSelectedText = '';
    hideFactCheckerPopup()
  }
})

function showFactCheckerPopup(text) {
  // Remove existing popup if any
  const existing = document.getElementById("fact-checker-popup")
  if (existing) existing.remove()

  // Create popup element
  const popup = document.createElement("div")
  popup.id = "fact-checker-popup"
  popup.className = "fact-checker-popup"
  if (isDarkMode()) popup.classList.add("dark")

  // Get cursor position
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  popup.innerHTML = `
    <button class="close-btn">&times;</button>
    <div class="loading">
      <div class="spinner"></div>
      <p style="margin-top: 8px;">Fact Checking...</p>
    </div>
  `

  document.body.appendChild(popup)

  // Position popup to the right of selected text
  const top = rect.top + window.scrollY
  const left = rect.right + window.scrollX + 10 // 10px gap from selection
  
  // Keep popup on screen
  const popupWidth = 280 // Our fixed popup width
  const maxLeft = window.innerWidth - popupWidth - 20 // 20px margin
  const finalLeft = Math.min(left, maxLeft)
  const finalTop = Math.max(top, 10) // Just keep it at least 10px from top
  
  popup.style.top = finalTop + "px"
  popup.style.left = finalLeft + "px"

  // Close button
  popup.querySelector(".close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    hideFactCheckerPopup();
  })

  // Add timeout for API responses
  let responseReceived = false;
  const timeoutId = setTimeout(() => {
    if (!responseReceived) {
      popup.innerHTML = `
        <button class="close-btn">&times;</button>
        <div style="color: #ef4444; font-size: 14px; padding: 10px;">
          <strong>Timeout:</strong> No response from extension service worker.<br><br>
          Try reloading the extension or this page.
        </div>
      `
      popup.querySelector(".close-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        hideFactCheckerPopup();
      })
    }
  }, 15000); // 15 second timeout

  // Call the real API through background script
  try {
    chrome.runtime.sendMessage({ type: "FACT_CHECK", text }, (response) => {
      responseReceived = true;
      clearTimeout(timeoutId);
      
      // Check for extension context invalidation
      if (chrome.runtime.lastError) {
        console.error('Chrome runtime error:', chrome.runtime.lastError.message);
        
        // Auto-reload page if context invalidated
        if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
          popup.innerHTML = `
            <button class="close-btn">&times;</button>
            <div style="color: #3b82f6; font-size: 14px; padding: 10px;">
              <strong>Extension Updated:</strong> Reloading page...
            </div>
          `
          setTimeout(() => window.location.reload(), 1000);
          return;
        }
        
        popup.innerHTML = `
          <button class="close-btn">&times;</button>
          <div style="color: #ef4444; font-size: 14px; padding: 10px;">
            <strong>Extension Error:</strong> ${chrome.runtime.lastError.message}<br><br>
            <button onclick="window.location.reload()" style="margin-top:8px;padding:6px 12px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;">Reload Page</button>
          </div>
        `
        popup.querySelector(".close-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          hideFactCheckerPopup();
        })
        return;
      }
      
      // Log full response for debugging
      console.log('Fact check response:', response);
      
      if (response && !response.error) {
        renderFactCheckResult(popup, response)
    } else {
      const errorMsg = response?.error || 'Failed to check fact. Please try again.';
      console.error('Fact check error:', errorMsg);
      
      popup.innerHTML = `
        <button class="close-btn">&times;</button>
        <div style="color: #ef4444; font-size: 14px; padding: 10px;">
          <strong>Error:</strong> ${errorMsg}
        </div>
      `
      popup.querySelector(".close-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        hideFactCheckerPopup();
      })
    }
  })
  } catch (error) {
    // Catch synchronous errors from chrome.runtime.sendMessage
    responseReceived = true;
    clearTimeout(timeoutId);
    console.error('Failed to send message:', error);
    popup.innerHTML = `
      <button class="close-btn">&times;</button>
      <div style="color: #ef4444; font-size: 14px; padding: 10px;">
        <strong>Extension Error:</strong> Cannot communicate with extension.<br><br>
        <button onclick="window.location.reload()" style="margin-top:8px;padding:6px 12px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;">Reload Page</button>
      </div>
    `
    popup.querySelector(".close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      hideFactCheckerPopup();
    })
  }
}

function generateMockResponse(text) {
  // Simple mock AI fact-checker
  const containsCommonTruth = /sky is blue|earth|water|sun/i.test(text);
  const containsCommonFalse = /flat earth|vaccines cause|moon landing fake/i.test(text);
  
  let rating, explanation;
  
  if (containsCommonFalse) {
    rating = 2;
    explanation = "This claim is widely disputed by scientific evidence and expert consensus. Multiple credible sources contradict this statement.";
  } else if (containsCommonTruth) {
    rating = 9;
    explanation = "This statement aligns with well-established scientific facts and is supported by credible sources and expert consensus.";
  } else {
    rating = 5;
    explanation = "This claim requires more context for accurate verification. The truth rating may vary depending on specific circumstances and additional information.";
  }
  
  return {
    rating: rating,
    explanation: explanation,
    originalText: text
  };
}

function renderFactCheckResult(popup, data) {
  const rating = data.truthLevel || 5
  const scoreColor = rating >= 7 ? "#22c55e" : rating >= 4 ? "#f59e0b" : "#ef4444"
  const scorePercent = (rating * 10) + "%"
  const icon = rating >= 7 ? "✓" : rating >= 4 ? "⚠" : "✗"
  const truthLevel = `Truth Level ${rating}/10`
  const levelDesc = rating >= 8 
    ? "Highly accurate" 
    : rating >= 6 
    ? "Mostly accurate"
    : rating >= 4 
    ? "Partially accurate" 
    : "Low accuracy"

  popup.style.setProperty('--score-color', scoreColor);
  popup.style.setProperty('--score-percent', scorePercent);
  popup.classList.remove('expanded');

  // If upstream reported an error, show it prominently
  if (data && data.error) {
    popup.innerHTML = `
      <button class="close-btn">&times;</button>
      <div style="color: #ef4444; font-size: 14px; padding: 10px;">
        <strong>Error:</strong> ${escapeHTML(data.error)}
        <div style="margin-top:6px; font-size:12px; opacity:0.8;">Retry later; a fallback was attempted.</div>
      </div>
    `
    popup.querySelector(".close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      hideFactCheckerPopup();
    })
    return;
  }

  popup.innerHTML = `
    <button class="close-btn">&times;</button>
    <h3><span class="fact-icon">${icon}</span> Fact Check Result</h3>
    <div class="truth-rating">
      <div class="truth-score-circle">
        <div class="score-circle-bg"></div>
        <div class="score-circle-inner">
          <div class="truth-score">${rating}/10</div>
        </div>
      </div>
      <div class="rating-details">
        <div class="rating-label">${levelDesc}</div>
        <div class="rating-description">${truthLevel}</div>
      </div>
    </div>
    <div class="explanation">${data.assessment || data.explanation}</div>
    ${data.debug ? `<div style="margin-top:10px;font-size:12px;color:#6b7280;">Debug: Model returned non-JSON. Raw: <em>${escapeHTML(data.debug).slice(0,300)}</em></div>` : ''}
    <div class="popup-actions">
      <button class="btn btn-primary" id="more-context">More Context</button>
    </div>
  `

  popup.querySelector(".close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    hideFactCheckerPopup();
  })
  popup.querySelector("#more-context").addEventListener("click", () => {
    openDetailedView(popup, data)
  })
}

// Escape HTML to safely show raw debug text
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function openDetailedView(popup, data) {
  if (!popup) return;
  
  popup.classList.add('expanded');
  
  const rating = data.truthLevel || data.rating || 5;
  
  // Find the More Context button and replace it with loading state
  const actionsDiv = popup.querySelector('.popup-actions');
  if (actionsDiv) {
    actionsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading context...</p></div>';
  }
  
  // Store selected text for context
  const selectedText = window.getSelection().toString().trim();
  
  // Fetch detailed context from API
  chrome.runtime.sendMessage({ 
    type: "MORE_CONTEXT", 
    text: selectedText,
    truthLevel: rating
  }, (response) => {
    if (actionsDiv) {
      actionsDiv.innerHTML = '';
    }
    
    if (!response || response.error) {
      const err = response?.error || 'Unknown error';
      const expandedDiv = document.createElement('div');
      expandedDiv.className = 'expanded-content';
      expandedDiv.innerHTML = `
        <div class="detailed-explanation">
          <h4>Additional Context</h4>
          <p style="color:#ef4444"><strong>Error:</strong> ${escapeHTML(err)}</p>
          <p style="font-size:12px;opacity:0.8;">Fallback was attempted automatically. Please try again later.</p>
        </div>
      `;
      popup.appendChild(expandedDiv);
      return;
    }

    const detailedInfo = response?.explanation || generateDetailedContext(rating, data);
    const reasoning = response?.reasoning || '';
    
    // Add expanded content
    const expandedDiv = document.createElement('div');
    expandedDiv.className = 'expanded-content';
    expandedDiv.innerHTML = `
      <div class="detailed-explanation">
        <h4>Additional Context</h4>
        <p>${detailedInfo}</p>
        ${reasoning ? `<p><strong>Reasoning:</strong> ${reasoning}</p>` : ''}
      </div>
      <div class="chat-section">
        <div class="chat-header">
          <h4>Ask Questions</h4>
          <button class="chat-toggle-btn" id="chat-toggle">Start Chat</button>
        </div>
        <div class="chat-container" id="chat-container">
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-input-container">
            <input type="text" class="chat-input" id="chat-input" placeholder="Ask about this claim...">
            <button class="chat-send-btn" id="chat-send">Send</button>
          </div>
        </div>
      </div>
    `;
    
    popup.appendChild(expandedDiv);
    
    // Store full context for chat (original text + detailed explanation + reasoning)
    const fullContext = `Claim: "${selectedText}"\nExplanation: ${detailedInfo}${reasoning ? `\nReasoning: ${reasoning}` : ''}`;
    data.selectedText = selectedText;
    data.fullContext = fullContext;
    
    // Chat functionality
    const chatToggle = expandedDiv.querySelector('#chat-toggle');
    const chatContainer = expandedDiv.querySelector('#chat-container');
    const chatInput = expandedDiv.querySelector('#chat-input');
    const chatSend = expandedDiv.querySelector('#chat-send');
    const chatMessages = expandedDiv.querySelector('#chat-messages');
    
    chatToggle.addEventListener('click', () => {
      chatContainer.classList.toggle('active');
      if (chatContainer.classList.contains('active')) {
        chatToggle.textContent = 'Close Chat';
        chatInput.focus();
      } else {
        chatToggle.textContent = 'Start Chat';
      }
    });
    
    // Chat send functionality
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message user';
      userMsg.textContent = message;
      chatMessages.appendChild(userMsg);
      
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Add loading indicator
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-message ai';
      loadingMsg.innerHTML = '<span class="typing-indicator">●●●</span>';
      loadingMsg.id = 'chat-loading';
      chatMessages.appendChild(loadingMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Send to API
      chrome.runtime.sendMessage({ 
        type: "CHAT_MESSAGE", 
        message: message,
        context: data.fullContext || data.selectedText 
      }, (response) => {
        // Remove loading indicator
        const loading = document.getElementById('chat-loading');
        if (loading) loading.remove();
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message ai';
        
        if (response && !response.error) {
          aiMsg.textContent = response.response;
        } else {
          aiMsg.textContent = 'Error: ' + (response?.error || 'Failed to get response');
        }
        
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    };
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  });
}

function generateMockChatResponse(question, data) {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('source') || lowerQ.includes('where')) {
    return "In a full implementation, I would provide specific sources and citations. Currently using mock data for demonstration.";
  } else if (lowerQ.includes('why') || lowerQ.includes('how')) {
    return "The rating is based on analyzing the claim against known facts. A production version would use real AI to provide detailed reasoning.";
  } else if (lowerQ.includes('more') || lowerQ.includes('detail')) {
    return "A production system would connect to fact-checking databases and AI models to provide comprehensive context.";
  } else if (lowerQ.includes('true') || lowerQ.includes('false')) {
    return "The truth rating considers available evidence, credible sources, and expert consensus. Specific circumstances may affect accuracy.";
  } else {
    return "That's a great question. In a full implementation, I would analyze this using AI and provide a detailed answer based on verified sources.";
  }
}

function generateDetailedContext(rating, data) {
  if (rating >= 8) {
    return `<p>This claim has strong supporting evidence and aligns with verified facts and expert consensus. The information presented is consistent with credible sources and established knowledge.</p>
    <p>When evaluating similar claims, look for primary sources, peer-reviewed research, and statements from recognized authorities in the relevant field.</p>`;
  } else if (rating >= 6) {
    return `<p>This claim is largely supported by available evidence, though some details may vary or require additional context. The core assertion appears to be accurate based on current information.</p>
    <p>Consider checking multiple independent sources and being aware that specific details or circumstances may affect the complete accuracy of the claim.</p>`;
  } else if (rating >= 4) {
    return `<p>This claim contains elements of truth but may be incomplete, lack important context, or mix accurate information with questionable assertions. The situation is nuanced and requires careful consideration.</p>
    <p>It's important to examine the specific details, check for missing context, and verify individual components of the claim separately before drawing conclusions.</p>`;
  } else {
    return `<p>This claim contradicts established facts, lacks credible supporting evidence, or has been debunked by reliable sources. The assertion does not align with verified information or expert consensus.</p>
    <p>Be cautious of claims with low truth ratings and verify information through trusted fact-checking organizations and authoritative sources before sharing or accepting as fact.</p>`;
  }
}

function hideFactCheckerPopup() {
  const popup = document.getElementById("fact-checker-popup")
  if (popup) {
    popup.remove()
    popupJustClosed = true;
    lastSelectedText = '';
    // Clear text selection
    window.getSelection().removeAllRanges();
    // Reset the flag after a brief delay
    setTimeout(() => {
      popupJustClosed = false;
    }, 200);
  }
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

// Listen for dark mode changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const popup = document.getElementById("fact-checker-popup")
  if (popup) {
    if (isDarkMode()) {
      popup.classList.add("dark")
    } else {
      popup.classList.remove("dark")
    }
  }
})
