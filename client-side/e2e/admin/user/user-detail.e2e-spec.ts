import { browser, element, by } from 'protractor';

import { SignIn, LogOut, GetRandomInt } from '../helper.e2e-spec';

describe('Admin User Detail e2e Tests', function () {

  const url = '/admin/user/detail/2';

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    browser.get(url);
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin User Detail';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('admin-user-detail')).getText()).toEqual(expectedMsg);
  });

  it('should display a save button', function () {
    expect(element(by.id('user-detail-save')).isPresent()).toBeTruthy();
  });

  it('should display a back button', function () {
    expect(element(by.id('user-detail-back')).isPresent()).toBeTruthy();
  });

  it('should navigate to users list', function () {
    element(by.id('user-detail-back')).click();

    expect(element(by.css('h1')).getText()).toEqual('Admin User');
  });

  it('should update an user', function () {
    element(by.id('name')).getAttribute('value')
      .then((originalName) => {
        let testUserName = `testName-${GetRandomInt(1, 1000000)}`;

        expect(originalName).not.toBe(testUserName);

        setUserName(testUserName);

        browser.get(url);

        element(by.id('name')).getAttribute('value')
          .then((newUserName) => {
            expect(testUserName).toEqual(newUserName);

            // clean up the user name
            setUserName(originalName);
          });
      });
  });

  afterAll(function () {
    LogOut();
  });

  function setUserName(name: string): void {
    element(by.id('name')).clear();

    element(by.id('name')).sendKeys(name);

    element(by.id('user-detail-save')).click();

    browser.waitForAngular();
  };
});
