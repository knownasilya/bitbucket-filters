'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.pageAction.show(tabId);
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.method == "getOptions") {
    sendResponse({ assignee: localStorage['assignee'] });
  }
  else {
    sendResponse({}); // snub them.
  }
});
