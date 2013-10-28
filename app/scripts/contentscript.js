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

function insertLink (options) {
  var filters = setupFilterData(options),
    $toolbar = $('#issues-toolbar'),
    $customFilters = $toolbar.clone(false),
    assignee = options.assignee,
    currentUrl = location.href.split('?'),
    $filters,
    item;

  $customFilters.find('.filter-label').text('Custom Filters:');
  $customFilters.addClass('custom-filters');
  $filters = $customFilters.find('.filter-control')
  $filters.empty();
  
  for(item in filters) {
    item = filters[item];

    $filters.append('<li id="' + item.id + '"' 
      + (currentUrl.length == 2 && currentUrl[1] === item.url ? ' aria-pressed="true"' : '') + '>'
      + '<a href="?' + item.url + '">' + item.label + '</a>'
      + '</li>');
  }

  $customFilters.find('.filter-controls').replaceWith($filters);
  $customFilters.find('.issues-toolbar-right, .issues-toolbar-left').remove();
  $toolbar.after($customFilters);
}

function getRepoName () {
  return $('.repo-link').attr('href').slice(1);
}

chrome.extension.sendRequest({method: "getOptions"}, function(response) {
  insertLink(response);
});

chrome.extension.sendMessage({ 
  action: "getPageData",
  pageName: getRepoName()
});
