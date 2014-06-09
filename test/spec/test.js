/*global describe, it */
'use strict';

(function () {
  var log = {},
    logData;

  // stub console.log
  log = function (m) {
    logData = null;
    logData = m;
  };

  window.console.log = log;

  describe('BBFilters', function () {
    describe('content-script', function () {
      it('message - log message with no container', function () {

        message('hh');
        expect(logData).to.equal('hh');
      });
    });
  });
})();
