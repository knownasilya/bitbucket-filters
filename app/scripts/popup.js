'use strict';

function displayCurrentRepo (data) {
  var $repoName = $('.repo-name h5');

  $repoName.html(data.repoName);
}


chrome.extension.onMessage.addListener(function(request, sender) {
  console.log('on request');
  if (request.action == "getPageData") {
    displayCurrentRepo(request.pageName);
  }
  else {
  }
});
