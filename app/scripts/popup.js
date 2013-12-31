'use strict';

function displayCurrentRepo (data) {
  var $repoName = $('#repo-name h5'),
    $filter = $('#filter'),
    $filters = $('<ul/>'),
    $item,
    $label,
    values,
    value,
    filter;

  $repoName.text(data.pageName);
  //$filter.val(data.params);
  filter = paramsToObj(data.params);

  for(var key in filter) { 
    if (filter.hasOwnProperty(key)) { 
      if (filter[key].indexOf(',') !== -1) {
        values = filter[key].split(',');

        for (var v in values) {
          values[v] = '"' + values[v] + '"';
        }

        value = values.join(' or ');
      }
      else {
        value = filter[key];
      }

      $label = $('<span/>').addClass('label').text(key + ':');
      $item = $('<li/>').text(value);
      $item.prepend($label);
      $filters.append($item);
    } 
  }

  $filter.after($filters);
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


chrome.extension.onMessage.addListener(function(request, sender) {
  console.log('on request');
  if (request.action == "getPageData") {
    displayCurrentRepo(request.pageName);
  }
  else {
  }
});
