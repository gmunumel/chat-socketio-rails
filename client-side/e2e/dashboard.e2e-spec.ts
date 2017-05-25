import { browser, element, by } from 'protractor';

describe('Dashboard e2e Tests', function () {

  let expectedMsg = 'Dashboard';

  beforeEach(function () {
    browser.get('');

    element(by.id('dashboard-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('dashboard')).getText()).toEqual(expectedMsg);
  });

});
