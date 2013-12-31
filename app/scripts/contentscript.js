'use strict';

function setupFilterData (options) {
  var assignee = options.assignee,
    filters;
    
  filters = [
    {
      label: 'My Priorities',
      id: 'my-priorities',
      url: 'status=open&status=new&sort=-priority&responsible=' + assignee,
    }
  ];

  return filters;
}

function createCustomToolbar (options) {
  var filters = setupFilterData(options),
    $toolbar = document.querySelector('#issues-toolbar'),
    $customFilters = document.createElement('div'),
    $container = document.createElement('div'),
    $label = document.createElement('p'),
    assignee = options.assignee,
    $filterList;

  $customFilters.id = 'custom-filters-toolbar';
  $container.className = 'filter-container';
  $label.className = 'filter-label';
  $label.textContent = 'Custom Filters:';

  $filterList = createFilterList(filters);

  $container.appendChild($label); 
  $container.appendChild($filterList); 
  $customFilters.appendChild($container);
  
  // Add our toolbar to page
  insertAfter($toolbar, $customFilters);
}

function createFilterList (filters) {
  var $filters = document.createElement('ul'),
    currentUrl = location.href.split('?'),
    $filter,
    $link,
    item;

  $filters.className = 'filter-control';

  for (item in filters) {
    item = filters[item];
    $filter = document.createElement('li');
    $filter.id = item.id;

    if (currentUrl.length === 2 && currentUrl[1] === item.url) {
      $filter['aria-pressed'] = true;
    }

    $link = document.createElement('a');
    $link.href = '?' + item.url;
    $link.textContent = item.label;
    $filter.appendChild($link);
    $filters.appendChild($filter);
  }

  return $filters;
}

function insertAfter (referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getRepoName () {
  return document.querySelector('.repo-link').href.slice(1);
}

chrome.extension.sendRequest({method: "getOptions"}, function (response) {
  createCustomToolbar(response);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) { 
  if (message === 'getPageData') {
    sendResponse({
      action: "getPageData",
      pageName: getRepoName()
    });
  }
});
