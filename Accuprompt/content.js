console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received in content script:', request);
  if (request.action === "getInputText") {
    let inputText = '';
    
    // Get text from input fields and textareas
    const inputFields = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
    inputFields.forEach(field => {
      inputText += field.value + '\n';
    });
    
    // Get text from contenteditable elements
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
      inputText += element.innerText + '\n';
    });
    
    // Get selected text
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      inputText += selection.toString() + '\n';
    }
    
    // Get text from active element (if it's an input field)
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      inputText += activeElement.value + '\n';
    }
    
    console.log('Input text collected:', inputText);
    sendResponse({inputText: inputText.trim()});
  }
  return true;  // Indicates that the response is sent asynchronously
});

console.log('Content script listener set up');