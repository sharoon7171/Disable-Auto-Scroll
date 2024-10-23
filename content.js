(function() {
    let isEnabled = true;
  
    function preventDefault(e) {
      if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  
    function handleMouseDown(e) {
      if (isEnabled && e.button === 1) {
        preventDefault(e);
      }
    }
  
    function handleMouseUp(e) {
      if (isEnabled && e.button === 1) {
        if (e.target.tagName !== 'A') {
          preventDefault(e);
        }
      }
    }
  
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
  
    chrome.storage.sync.get('enabled', function(data) {
      if (data.enabled !== undefined) {
        isEnabled = data.enabled;
      }
      updateListeners();
    });
  
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "toggle") {
        isEnabled = request.enabled;
        updateListeners();
      }
    });
  
    updateListeners();
  })();