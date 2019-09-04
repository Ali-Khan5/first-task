chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo && changeInfo.status == "complete") {
    chrome.tabs.executeScript(tabId, { file: "jquery.min.js" }, function() {
      chrome.tabs.executeScript(tabId, { file: "script.js" });
    });
  }
});

function onWindowLoad() {
  var message = document.querySelector("#message");
  chrome.tabs.executeScript({ file: "jquery.min.js" }, function() {
    chrome.tabs.executeScript(
      null,
      {
        file: "getPagesSource.js"
      },
      function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText =
            "There was an error injecting script : \n" +
            chrome.runtime.lastError.message;
        }
      }
    );
  });
}

window.onload = onWindowLoad;
