import { browser, element, by } from 'protractor';

import { LogOut } from './admin/helper.e2e-spec';

describe('Sign In e2e Tests', function () {

  let expectedMsg = 'Sign In';

  beforeEach(function () {
    browser.get('');

    element(by.id('sign-in-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('sign-in')).getText()).toEqual(expectedMsg);
  });

  it('should not found an user', function() {
    element(by.id('name')).sendKeys('admin');
    element(by.id('email')).sendKeys('admin.email');

    element(by.id('sign-in-submit')).click();

    expect(element(by.className('alert-success')).isPresent()).
        toBe(false);
  });

  // won't create user if rails server is not up
  it('should found an user', function() {
    element(by.id('name')).sendKeys('admin');
    element(by.id('email')).sendKeys('admin@admin.com');

    element(by.id('sign-in-submit')).click();

    expect(element(by.className('alert-success')).getText()).
        toContain('Your user has been logged in!');
  });

  afterAll(function () {
    LogOut();
  });
});
