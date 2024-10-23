document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusLabel = document.getElementById('statusLabel');

  function updateUI(enabled) {
    toggleSwitch.checked = enabled;
    statusLabel.textContent = enabled ? 'Enabled' : 'Disabled';
    statusLabel.style.color = enabled ? '#4CAF50' : '#666';
  }

  function sendMessageToActiveTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message).catch(error => {
          console.log("Could not send message to content script:", error);
        });
      }
    });
  }

  chrome.storage.sync.get('enabled', function(data) {
    const enabled = data.enabled !== undefined ? data.enabled : true;
    updateUI(enabled);
  });

  toggleSwitch.addEventListener('change', function() {
    const enabled = toggleSwitch.checked;
    chrome.storage.sync.set({enabled: enabled}, function() {
      updateUI(enabled);
      sendMessageToActiveTab({action: "toggle", enabled: enabled});
    });
  });
});
