'use strict';

var repoName = getRepoName(),
  appId = 'bb-filters',
  projectId = appId + ':' + repoName,
  currentFilter,
  params = [];

// Executed at bottom of file
function init() {
  // get relavent data
  // - repo name
  // - current filters

  getFilters(function (filters) {
    // add toolbar if it doesn't exist
    createFilterList(filters);
  }, this);

  var $issuesQuery = document.querySelector('#filters-filters');

  if ($issuesQuery) {
    addSaveSearchBtn($issuesQuery);
  }
}

function addSaveSearchBtn($issuesQuery) {
  var $searchBtn = $issuesQuery.querySelector('.buttons-container button[type=submit]');
  var $saveSearchBtn = document.createElement('button');

  $saveSearchBtn.textContent = 'Save & Search';
  $saveSearchBtn.id = 'bb-save-search';
  $saveSearchBtn.setAttribute('type', 'button');
  $saveSearchBtn.className = 'aui-button aui-style aui-button-primary';
  $searchBtn.insertAdjacentHTML('afterend', $saveSearchBtn.outerHTML);

  $issuesQuery.querySelector('#bb-save-search').addEventListener('click', function (event) {
    var $filterContainer = document.querySelector('#filters');
    var name = prompt('What would you like to call this filter?', currentFilter || '');

    if ($filterContainer && name) {
      params = [];

      for (var i = 0; i < $filterContainer.childNodes.length; i++) {
        parseFilter($filterContainer.childNodes[i]);
      }

      addFilter(repoName, { name: name, params: serializeParams(params) }, function (filter) {
        if (filter) {
          window.open('http://bitbucket.org/' + repoName + '/issues?' + filter.params, '_self');
        }
      });
    }
  });
}

function parseFilter($filter) {
  if ($filter.className.indexOf('filter_') > -1) {
    var name = $filter.className.replace('filter_', '');
    var availableParams = params[name];
    var numParams = availableParams ? availableParams.length : 0;
    var $modifierSelect = $filter.querySelector('.filter-comp select[name=comp_' + name + (numParams + 1) + ']');
    var $valueElement = $filter.querySelector('.filter-query select[name=' + name + (numParams + 1) + ']');
    var isSelect = !!$valueElement;

    if (!isSelect) {
      $valueElement = $filter.querySelector('.filter-query input[name=' + name + (numParams + 1) + ']');
    }

    if ($modifierSelect && $valueElement) {
      var modifier = $modifierSelect.selectedOptions[0].value;
      var value;

      if (isSelect) {
        value = $valueElement.selectedOptions[0].value;
      }
      else {
        value = $valueElement.value;
      }

      if (!params[name]) {
        params[name] = [{
          modifier: modifier,
          value: value
        }];
      }
      else {
        params[name].push({
          modifier: modifier,
          value: value
        });
      }
    }
  }
}

function serializeParams(params) {
  return encodeURI(Object.keys(params).map(function (key) {
    var selections = params[key];

    return selections.map(function (selection) {
      return encodeURIComponent(key) + '=' + selection.modifier + selection.value;
    }).join('&');
  }).join('&'));
}

function addFilter(repoName, data, cb) {
  chrome.storage.sync.get(function (filters) {
    var repoFilters = filters[repoName];

    if (!(repoFilters instanceof Array)) {
      repoFilters = [];
    }

    updateFilter(repoFilters, { name: data.name, params: data.params }, data.deleteMe, function (repoFilters) {
      if (repoFilters) {
        filters[repoName] = repoFilters;

        chrome.storage.sync.set(filters, function () {
          cb && cb(data);
        });
      }
      else {
        cb && cb();
      }
    });
  });
}

function updateFilter(filters, filter, deleteMe, cb) {
  var exists = filters.filter(function (item) {
    return item && item.name === filter.name;
  }).length > 0;

  if (exists) {
    if (confirm(deleteMe ? 'Are you sure you want to delete this filter?' : 'There appears to already exist a \'' + filter.name + '\' filter, would you like to overwrite it?')) {
      return cb(filters.map(function (item) {
        if (deleteMe && item.name === filter.name) {
          return;
        }
        else {
          return item && item.name.toLowerCase() === filter.name.toLowerCase() ? filter : item;
        }
      }).filter(function (item) {
        return item;
      }));
    }
    else {
      cb(false);
    }
  }
  else {
    filters.push(filter);
    cb(filters);
  }
}

function getFilters(cb, context) {
  chrome.storage.sync.get(function (filters) {
    cb.call(context || this, filters);
  });
}

function createFilterList(filters) {
  var $originalToolbar = document.querySelector('#issues-toolbar'),
    $toolbar = document.createElement('div'),
    $container = document.createElement('div'),
    $label = document.createElement('p'),
    toolbarId = 'bb-custom-filters-toolbar',
    $filterList;

  $toolbar.id = toolbarId;
  $container.className = 'filter-container';
  $label.className = 'filter-label';
  $label.textContent = 'Custom Filters:';

  $filterList = createFilterListItems(repoName, filters);

  $container.appendChild($label);
  $container.appendChild($filterList);
  $toolbar.appendChild($container);

  // Add our toolbar to page
  if (!document.querySelector('#' + toolbarId) && filters[repoName] && filters[repoName].length) {
    insertAfter($originalToolbar, $toolbar);
  }

  return {
    toolbar: $toolbar
  };
}

function createFilterListItems(repoName, filters) {
  if (!filters) {
    return;
  }

  var $filters = document.createElement('ul'),
    repoFilters = filters[repoName],
    currentUrl = location.href.split('?'),
    hostSplit = currentUrl[0].split('/'),
    isQueryPage = hostSplit[hostSplit.length - 1] === 'query' ? true : false,
    isPressed = false;

  $filters.className = 'filter-status';

  if (repoFilters) {
    repoFilters.forEach(function (filter) {
      if (filter) {
        var $filter = document.createElement('li');
        isPressed = false;

        if (isQueryPage) {
          if (currentUrl.length === 2 && currentUrl[1] === filter.params) {
            isPressed = true;
            currentFilter = filter.name;
          }

          $filter = createDropdownLabel($filter, filter, isPressed);
          $filters.appendChild($filter);
        }
        else {
          if (currentUrl.length === 2 && currentUrl[1] === filter.params) {
            isPressed = true;
            currentFilter = filter.name;
          }

          $filter = createSimpleLabel($filter, filter, isPressed);
          $filters.appendChild($filter);
        }
      }
    });
  }

  return $filters;
}

function createDropdownLabel($parent, filter, isPressed) {
  var $splitBtn = document.createElement('div');
  var $btn = document.createElement('button');
  var $moreBtn = document.createElement('button');
  var $dropdown = document.createElement('div');
  var $list = document.createElement('ul');
  var $edit = document.createElement('li');
  var $editLink = document.createElement('a');
  var $delete = document.createElement('li');
  var $deleteLink = document.createElement('a');
  var name = filter.name ? filter.name : 'unknown';

  $splitBtn.id = 'filter-' + name.toLowerCase();
  $splitBtn.className = 'aui-buttons';

  $btn.className = 'aui-button aui-button-compact aui-button-split-main';
  $btn.textContent = name;
  $btn.addEventListener('click', function (event) {
    window.open('http://bitbucket.org/' + repoName + '/issues?' + filter.params, '_self');
    event.preventDefault();

    return false;
  });

  if (isPressed) {
    $btn.setAttribute('aria-pressed', true);
  }

  $moreBtn.className = 'aui-button aui-button-compact aui-dropdown2-trigger aui-button-split-more';
  $moreBtn.setAttribute('aria-owns', 'filter-' + name.toLowerCase() + '-dropdown');
  $moreBtn.setAttribute('aria-haspopup', 'true');
  $moreBtn.textContent = 'more btn';

  $dropdown.id = 'filter-' + name.toLowerCase() + '-dropdown';
  $dropdown.className = 'aui-dropdown2 aui-style-default';
  $dropdown.setAttribute('data-container', 'filter-' + name.toLowerCase());

  $list.className = 'aui-list-truncate';

  $editLink.textContent = 'Edit';
  $editLink.setAttribute('href', 'http://bitbucket.org/' + repoName + '/issues/query?' + filter.params);
  $editLink.addEventListener('click', function (event) {
    var $this = event.target;
    // TODO: save name, for saving filter.
    // Confirm overwrite, or save as new (if new name).
  });

  $deleteLink.textContent = 'Delete';
  $deleteLink.addEventListener('click', function (event) {
    // TODO: delete filter, confirm deleteion (confirm prompt)
    addFilter(repoName, { name: filter.name, params: filter.params, deleteMe: true }, function (filter) {
      if (filter) {
        window.open('http://bitbucket.org/' + repoName + '/issues/query', '_self');
      }
    });
  });

  $splitBtn.appendChild($btn);
  $splitBtn.appendChild($moreBtn);
  $edit.appendChild($editLink);
  $delete.appendChild($deleteLink);
  $list.appendChild($edit);
  $list.appendChild($delete);
  $dropdown.appendChild($list);
  $parent.appendChild($splitBtn);
  $parent.appendChild($dropdown);

  return $parent;
}

function createSimpleLabel($parent, filter, isPressed) {
  var $link = document.createElement('a');

  $link.href = '?' + filter.params;
  $link.textContent = filter.name;

  if (isPressed) {
    $parent.setAttribute('aria-pressed', true);
  }

  $parent.appendChild($link);

  return $parent;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getRepoName() {
  var $body = document.querySelector('body'),
    currentRepoRaw = $body.getAttribute('data-current-repo'),
    currentRepo = currentRepoRaw ? JSON.parse(currentRepoRaw) : {};

  return currentRepo.fullslug;
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

init();
