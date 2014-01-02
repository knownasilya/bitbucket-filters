'use strict';

(function () {
  var repoName = getRepoName(),
    appId = 'bb-filters';

  function setupFilterData (options, cb) {
    var assignee = options.assignee,
      projectId = appId + ':' + repoName;


    chrome.storage.sync.get(projectId, function (filters) {
      cb(filters[projectId]);
    });
    /* 
    filters = [
      {
        label: 'My Priorities',
        id: 'my-priorities',
        url: 'status=open&status=new&sort=-priority&responsible=' + assignee,
      }
    ];

    return filters;
    */
  }

  function createCustomToolbar (options) {
    setupFilterData(options, function (filters) {
      var $toolbar = document.querySelector('#issues-toolbar'),
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
    });
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

      if (item.label && item.params) {
        $filter = document.createElement('li');
        //$filter.id = item.id;

        if (currentUrl.length === 2 && currentUrl[1] === item.params) {
          $filter['aria-pressed'] = true;
        }

        $link = document.createElement('a');
        $link.href = '?' + item.params;
        $link.textContent = item.label;
        $filter.appendChild($link);
        $filters.appendChild($filter);
      }
    }

    return $filters;
  }

  function insertAfter (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function getRepoName () {
    var url = document.querySelector('.repo-link').href,
      urlArr = url.split('/').reverse(),
      repoName = urlArr.length >= 2 ? urlArr[1] + '/' + urlArr[0] : urlArr.join('/');

    return repoName;
  }

  chrome.extension.sendRequest({method: 'getOptions'}, function (response) {
    createCustomToolbar(response);
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) { 
    if (message === 'getPageData') {
      sendResponse({
        action: 'getPageData',
        pageName: getRepoName()
      });
    }
  });
}());
