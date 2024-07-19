document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['key_save', 'api_key'], function(result) {
    if (result.key_save) {
      showMainScreen();
    } else {
      showWelcomeScreen();
    }
  });

  document.getElementById('save-key').addEventListener('click', saveApiKey);
  document.getElementById('generate').addEventListener('click', generateResponse);
  document.getElementById('copy').addEventListener('click', copyResponse);
});

function saveApiKey() {
  const apiKey = document.getElementById('api-key').value;
  chrome.storage.sync.set({ api_key: apiKey, key_save: true }, function() {
    showMainScreen();
  });
}

function showWelcomeScreen() {
  document.getElementById('welcome-screen').style.display = 'block';
  document.getElementById('main-screen').style.display = 'none';
}

function showMainScreen() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'block';
}

function generateResponse() {
  console.log('Generate response function called');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (chrome.runtime.lastError) {
      console.error('Error querying tabs:', chrome.runtime.lastError);
      alert('Error: Unable to query tabs. Please try again.');
      return;
    }
    
    if (tabs.length === 0) {
      console.error('No active tab found');
      alert('Error: No active tab found. Please try again on an active webpage.');
      return;
    }

    const activeTab = tabs[0];
    console.log('Active tab:', activeTab);
    
    // Directly attempt to inject and execute the content script
    chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      files: ['content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error injecting script:', chrome.runtime.lastError);
        alert('Error: Unable to inject content script. Please refresh the page and try again.');
      } else {
        console.log('Content script injected successfully');
        // Wait a short time to ensure the content script is ready
        setTimeout(() => sendMessageToContentScript(activeTab.id), 100);
      }
    });
  });
}

function sendMessageToContentScript(tabId) {
  chrome.tabs.sendMessage(tabId, {action: "getInputText"}, function(response) {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
      alert('Error: Unable to communicate with the page. Please refresh and try again.');
    } else if (response && response.inputText) {
      console.log('Input text received:', response.inputText);
      callGroqApi(response.inputText);
    } else {
      console.log('Unexpected response:', response);
      alert('No input text found on the page. Please make sure there is text in input fields or text areas.');
    }
  });
}


async function callGroqApi(inputText) {
  chrome.storage.sync.get(['api_key'], async function(result) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${result.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are a prompt enhancement specialist. Your task is to refine user-provided prompts, making them more elaborate and comprehensive. For each prompt:

Analyze for potential areas of expansion and detail.
Enhance the prompt to extract maximum relevant information.
Add specific questions or points to cover all possible aspects.
Ensure the improved prompt is clear, focused, and thorough.
Maintain the original intent while significantly expanding its scope.

Respond only with the improved, elaborate prompt. Provide no explanations or additional text.`,
            },
            {
              role: "user",
              content: inputText
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const responseText = data.choices[0]?.message?.content || "";
      document.getElementById('result').textContent = responseText;
      document.getElementById('copy').style.display = 'block'; // Show the copy button
    } catch (error) {
      console.error('Error calling Groq API:', error);
      chrome.storage.sync.set({ key_save: false });
      showWelcomeScreen();
      alert(`Error calling Groq API: ${error.message}. Please check your API key and try again.`);
    }
  });
}

function copyResponse() {
  const resultText = document.getElementById('result').textContent;
  navigator.clipboard.writeText(resultText).then(function() {
    // Optional: Add some visual feedback that the text was copied
    console.log('Response copied to clipboard');
  });
}