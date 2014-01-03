'use strict';

(function () {
  var parser = new DOMParser();
  // Executed at bottom of file
  function init () {
    var repoName = getRepoName(),
      appId = 'bb-filters',
      projectId = appId + ':' + repoName,
      $dialogBtn,
      $submitFilterBtn;
    // get relavent data
    // - repo name
    // - current filters

    getFilters(appId, repoName, function (filters) {
      // add toolbar if it doesn't exist
      var elements = createToolbar(filters);
    
      if (!(filters instanceof Object)) {
        filters = {};
      }
      // bind events - add filter button, submit button
      bindEvents(projectId, filters, elements.openDialogBtn, elements.addFilterBtn);
    }, this);

  }

  function toDom (template) {
    var wrapper = document.createElement('div');

    wrapper.innerHTML= template;

    return wrapper.firstChild;
  }

  function bindEvents (projectId, filters, $openDialogEl, $submitFilterEl) {
    var $dialog;

    $openDialogEl.addEventListener('click', function (event) {
      $dialog = document.querySelector('#bb-add-filter-dialog');

      $dialog.className = $dialog.className + ' dialog-open';
      $dialog.addEventListener('mouseout', function (event) {
        if (event && event.currentTarget) {
          var baseClass = event.currentTarget.className.replace('dialog-open', '').trim();
          event.currentTarget.className = baseClass;
        }
      });
    });

    $submitFilterEl.addEventListener('click', createAddFilterHandler(projectId));

  }

  function getFilters (appId, repoName, cb, context) {
    var projectId = appId + ':' + repoName;

    chrome.storage.sync.get(appId, function (filters) {
      var result = {};

      result[repoName] = filters[repoName];
      result['*'] = filters['*'];

      cb.call(context, result);
    });
  }

  function createToolbar (filters) {
    var $originalToolbar = document.querySelector('#issues-toolbar'),
      $toolbar = document.createElement('div'),
      $container = document.createElement('div'),
      $openDialogBtn = document.createElement('a'),
      $addFilterBtn,
      $addFilterDialog = document.createElement('div'),
      $label = document.createElement('p'),
      toolbarId = 'bb-custom-filters-toolbar',
      $filterList;

    $toolbar.id = toolbarId;
    $container.className = 'filter-container';
    $label.className = 'filter-label';
    $label.textContent = 'Custom Filters:';
    $openDialogBtn.className = 'aui-button aui-button-compact';
    $openDialogBtn.textContent = 'new filter';
    $openDialogBtn.id = 'bb-add-filter';

    $addFilterDialog = toDom(JST.dialog());//createDialog('bb-add-filter-dialog', 300);
    $filterList = createFilterList(filters);

    $container.appendChild($label); 
    $container.appendChild($filterList); 
    $container.appendChild($openDialogBtn); 
    $container.appendChild($addFilterDialog); 
    $toolbar.appendChild($container);
    
    // Add our toolbar to page
    if (!document.querySelector('#' + toolbarId)) {
      insertAfter($originalToolbar, $toolbar);
    }

    return {
      toolbar: $toolbar,
      openDialogBtn: $openDialogBtn,
      addFilterBtn: $addFilterBtn
    };
  }

  function createDialog (id, width) {
    var $dialog = document.createElement('div'),
      $contents = document.createElement('div'),
      $container = document.createElement('div'),
      $arrow = document.createElement('div');

    $dialog.id = id;
    $dialog.className = 'aui-inline-dialog';
    $contents.className = 'contents';
    $container.className = 'clone-dialog';
    $arrow.className = 'arrow aui-css-arrow';
    
    $contents.appendChild($container);
    $dialog.appendChild($contents);
    $dialog.appendChild($arrow);

    return $dialog;
  }

  function createFilterList (filters) {
    var $filters = document.createElement('ul'),
      currentUrl = location.href.split('?'),
      $filter,
      $link,
      itemParam,
      label;

    $filters.className = 'filter-control';

    for (itemParam in filters) {
      if (filters.hasOwnProperty(itemParam)) {
        label = filters[itemParam];

        if (label) {
          $filter = document.createElement('li');
          //$filter.id = item.id;

          if (currentUrl.length === 2 && currentUrl[1] === itemParam) {
            $filter['aria-pressed'] = true;
          }

          $link = document.createElement('a');
          $link.href = '?' + itemParam;
          $link.textContent = label;
          $filter.appendChild($link);
          $filters.appendChild($filter);
        }
      }
    }

    return $filters;
  }

  function insertAfter (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function message (message) {
    var $container = document.querySelector('#bb-message-container'),
      $message = document.createElement('p');

    $message.className = 'message';
    $message.textContent = message;

    $container.appendChild($message);

    setTimeout(function () {
      $container.removeChild($message);  
    }, 3500);
  }

  function createAddFilterHandler (projectId, filters) {
    return function () {
      var projectFilters = filters[projectId],
        globalFilters = filters['*'],
        addGlobal = document.querySelector('#bb-add-filter-global').value;

      // has params
      if (document.location.search) {    
        params = document.location.search.replace('?', '');
        filters[projectId] = projectFilters;

        chrome.storage.sync.set(filters, function () {
          // Notify that we saved.
          message('Filter Saved');
        });
      }
    };
  }

  function getRepoName () {
    var url = document.querySelector('.repo-link').href,
      urlArr = url.split('/').reverse(),
      repoName = urlArr.length >= 2 ? urlArr[1] + '/' + urlArr[0] : urlArr.join('/');

    return repoName;
  }

  init();
}());
