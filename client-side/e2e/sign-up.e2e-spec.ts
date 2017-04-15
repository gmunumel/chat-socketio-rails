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

  // won't create user if the API is not up
  // it('should add one user', function() {
  //   element(by.id('name')).sendKeys('test-name');
  //   element(by.id('email')).sendKeys('test.email@foo.com');

  //   element(by.id('sign-up-submit')).click();

  //   expect(element(by.css('.alert-success')).getText()).
  //       toContain('Your user has been created');
  // });

  it('should not create an user', function() {
    element(by.id('name')).sendKeys('test-name');
    element(by.id('email')).sendKeys('test.email');

    element(by.id('sign-up-submit')).click();

    expect(element(by.css('.alert-success')).isPresent()).
        toBe(false);
  });
});
