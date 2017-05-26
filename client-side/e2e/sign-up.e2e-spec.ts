import { browser, element, by } from 'protractor';

import { RemoveUser, LogOut, GetRandomInt } from './admin/helper.e2e-spec';

describe('Sign Up e2e Tests', function () {

  let expectedMsg = 'Sign Up';

  beforeEach(function () {
    browser.get('');

    element(by.id('sign-up-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('sign-up')).getText()).toEqual(expectedMsg);
  });

  it('should not create an user', function() {
    let userName  = `testName${GetRandomInt(1, 1000000)}`;
    let userEmail = userName;

    element(by.id('name')).sendKeys(userName);
    element(by.id('email')).sendKeys(userEmail);

    element(by.id('sign-up-submit')).click();

    expect(element(by.className('alert-success')).isPresent()).
        toBe(false);
  });

  // won't create user if rails server is not up
  it('should add one user', function() {
    let userName  = `testName${GetRandomInt(1, 1000000)}`;
    let userEmail = `${userName}@foo.com`;

    element(by.id('name')).sendKeys(userName);
    element(by.id('email')).sendKeys(userEmail);

    element(by.id('sign-up-submit')).click();

    expect(element(by.className('alert-success')).getText()).
        toContain('Your user has been created');

    // remove user just created
    RemoveUser(userName);
  });

  afterAll(function () {
    LogOut();
  });
});
