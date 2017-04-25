import { browser, element, by } from 'protractor';

describe('Admin User e2e Tests', function () {

  let expectedMsg = 'Admin User';

  beforeEach(function () {
    browser.get('');

    element(by.id('admin-user-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.admin-user')).getText()).toEqual(expectedMsg);
  });

});
