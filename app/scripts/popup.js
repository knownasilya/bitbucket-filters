'use strict';

function displayCurrentRepo (data) {
  var $repoName = document.querySelector('#repo-name'),
    $filter = document.querySelector('#filter'),
    $params = document.createElement('span'),
    $addFilter = document.querySelector('#add-filter');

  $repoName.textContent = data.pageName;
  $params.id = 'filter-param';
  $params.textContent = data.params;
  data.label = $filter.value;

  insertAfter($filter, $params);
  $addFilter.addEventListener('click', addFilter(data));
}

function addFilter (data) {
  return function () {
    var id = 'bb-filters:' + data.pageName;

    chrome.storage.sync.get(id, function (filters) {
      var projectFilters = filters[id];

      if (!(projectFilters instanceof Array)) {
        projectFilters = [];
      }

      projectFilters.push({ label: data.label, params: data.params });
      filters[id] = projectFilters;

      chrome.storage.sync.set(filters, function () {
        // Notify that we saved.
        message('Filter Saved');
      });
    });
  };
}

function message (message) {
  var $container = document.querySelector('#message-container'),
    $message = document.createElement('p');

  $message.className = 'message';
  $message.textContent = message;

  $container.appendChild($message);
  setTimeout(function () {
    $container.removeChild($message);  
  }, 3500);
}

function insertAfter (referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function paramsToObj(params, joinDuplicates) {
  var result = {},
    temp,
    decodedKey,
    decodedValue,
    items;

  items = params.split('&');   // remove leading ? and split

  for (var i = 0; i < items.length; i++) {
    temp = items[i].split('=');
  
    if (temp[0]) {
      if (temp.length < 2) {
        temp.push('');
      }

      decodedKey = decodeURIComponent(temp[0]);
      decodedValue = decodeURIComponent(temp[1]);

      if (result[decodedKey] && decodedValue) {
        result[decodedKey] += ',' + decodedValue;
      }
      else {
        result[decodedKey] = decodedValue;        
      }
    }
  }
  
  return result;
}

chrome.tabs.query({ active: true }, function (tabResults) {
  var tabKey = 0,
    tab,
    params;

  if (tabResults && tabResults.length) {
    for (tabKey in tabResults) {
      if (tabResults[tabKey].url.indexOf('bitbucket.org') !== -1) {
        console.dir(tabResults[0]);
        tab = tabResults[tabKey];
        params = tab && tab.url ? tab.url.split('?')[1] : '';

        chrome.tabs.sendMessage(tab.id, 'getPageData', function (response) {
          if (response) {
            if (this.params) {
              response.params = this.params;
            }

            displayCurrentRepo(response);
          }
        }.bind({ params: params }));
      }
    }
  }
});
