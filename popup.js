document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusLabel = document.getElementById('statusLabel');

  // Updates the UI based on the enabled state
  function updateUI(enabled) {
    toggleSwitch.checked = enabled;
    statusLabel.textContent = enabled ? 'Enabled' : 'Disabled';
    statusLabel.style.color = enabled ? '#4CAF50' : '#666';
  }

  // Sends a message to the active tab
  function sendMessageToActiveTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message).catch(error => {
          console.error("Could not send message to content script:", error);
        });
      }
    });
  }

  // Initialize state from storage with error handling
  chrome.storage.sync.get('enabled', function(data) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving storage data:", chrome.runtime.lastError);
      return;
    }
    const enabled = data.enabled !== undefined ? data.enabled : true;
    updateUI(enabled);
  });

  // Toggle switch event listener with error handling
  toggleSwitch.addEventListener('change', function() {
    const enabled = toggleSwitch.checked;
    chrome.storage.sync.set({enabled: enabled}, function() {
      if (chrome.runtime.lastError) {
        console.error("Error setting storage data:", chrome.runtime.lastError);
        return;
      }
      updateUI(enabled);
      sendMessageToActiveTab({action: "toggle", enabled: enabled});
    });
  });
});
