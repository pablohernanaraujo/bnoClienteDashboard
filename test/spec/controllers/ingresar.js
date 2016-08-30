'use strict';

describe('Controller: IngresarCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp'));

  var IngresarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresarCtrl = $controller('IngresarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should work', function () {
    expect(true).toBe(true);
  });
});
