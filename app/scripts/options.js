'use strict';

function save () {
  var assignee = document.getElementById('assignee'),
    status;

  localStorage['assignee'] = assignee.value;
  
  // Update status to let user know options were saved.
  status = document.getElementById('status');
  status.innerHTML = 'Options Saved.';

  setTimeout(function() {
    status.innerHTML = '';
  }, 750);
}

function init () {
  document.querySelector('#save').addEventListener('click', save);
}

document.addEventListener('DOMContentLoaded', init);

