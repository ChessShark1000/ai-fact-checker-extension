// Popup script for managing extension state

// Load saved state
chrome.storage.sync.get(['extensionEnabled'], (result) => {
  const enabled = result.extensionEnabled !== false; // Default to true
  document.getElementById('extensionToggle').checked = enabled;
  updateStatus(enabled);
});

// Handle toggle changes
document.getElementById('extensionToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.sync.set({ extensionEnabled: enabled });
  updateStatus(enabled);
  
  // Notify all tabs about the state change
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        type: 'TOGGLE_EXTENSION', 
        enabled: enabled 
      }).catch(() => {}); // Ignore errors for tabs that don't have content script
    });
  });
});

function updateStatus(enabled) {
  const statusText = document.getElementById('statusText');
  const footerStatus = document.getElementById('footerStatus');
  
  if (enabled) {
    statusText.textContent = 'Highlighting enabled';
    footerStatus.textContent = 'Extension is active and ready to use';
  } else {
    statusText.textContent = 'Highlighting disabled';
    footerStatus.textContent = 'Extension is currently disabled';
  }
}
