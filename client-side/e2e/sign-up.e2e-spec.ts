import { browser, element, by } from 'protractor';

describe('Sign Up e2e Tests', function () {

  let expectedMsg = 'Sign Up';

  beforeEach(function () {
    browser.get('');

    element(by.id('sign-up-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.sign-up')).getText()).toEqual(expectedMsg);
  });

});
