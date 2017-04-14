import { browser, element, by } from 'protractor';

describe('Sign In e2e Tests', function () {

  let expectedMsg = 'Sign In';

  beforeEach(function () {
    browser.get('');

    element(by.id('sign-in-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.sign-in')).getText()).toEqual(expectedMsg);
  });

});
