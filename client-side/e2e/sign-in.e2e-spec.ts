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

  // won't search user if the API is not up
  // it('should search user', function() {
  //   element(by.id('name')).sendKeys('test-name');
  //   element(by.id('email')).sendKeys('test.email@foo.com');

  //   element(by.id('sign-in-submit')).click();

  //   expect(element(by.css('.alert-success')).getText()).
  //       toContain('Your user has been searched');
  // });

  it('should not search an user', function() {
    element(by.id('name')).sendKeys('test-name');
    element(by.id('email')).sendKeys('test.email');

    element(by.id('sign-in-submit')).click();

    expect(element(by.css('.alert-success')).isPresent()).
        toBe(false);
  });
});
