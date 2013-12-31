'use strict';

function displayCurrentRepo (data) {
  var $repoName = document.querySelector('#repo-name h5');

  $repoName.textContent = data.pageName;
}

chrome.tabs.query({ active: true }, function (tabResults) {
  var tab,
    tabKey = 0;

  if (tabResults && tabResults.length) {
    for (tabKey in tabResults) {
      if (tabResults[tabKey].url.indexOf('bitbucket.org') !== -1) {
        console.dir(tabResults[0]);
        tab = tabResults[tabKey];
      
        chrome.tabs.sendMessage(tab.id, 'getPageData', function (response) {
          console.dir(response);
          displayCurrentRepo(response);
        });
      }
    }
  }
});


chrome.extension.onMessage.addListener(function(request, sender) {
  console.log('on request');
  if (request.action == 'getPageData') {
    displayCurrentRepo(request.pageName);
  }
  else {
  }
});
