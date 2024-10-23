(function() {
    let isEnabled = true;
  
    // Prevents default middle-click behavior
    function preventDefault(e) {
      if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  
    // Handles mousedown event
    function handleMouseDown(e) {
      if (isEnabled && e.button === 1) {
        preventDefault(e);
      }
    }
  
    // Handles mouseup event
    function handleMouseUp(e) {
      if (isEnabled && e.button === 1) {
        if (e.target.tagName !== 'A') {
          preventDefault(e);
        }
      }
    }
  
    // Updates event listeners based on the enabled state
    function updateListeners() {
      if (isEnabled) {
        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mouseup', handleMouseUp, true);
        document.addEventListener('click', preventDefault, true);
      } else {
        document.removeEventListener('mousedown', handleMouseDown, true);
        document.removeEventListener('mouseup', handleMouseUp, true);
        document.removeEventListener('click', preventDefault, true);
      }
    }
  
    // Initialize state from storage
    chrome.storage.sync.get('enabled', function(data) {
      if (data.enabled !== undefined) {
        isEnabled = data.enabled;
      }
      updateListeners();
    });
  
    // Listen for toggle messages
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "toggle") {
        isEnabled = request.enabled;
        updateListeners();
      }
    });
  
    updateListeners();
  })();