import { element, by } from 'protractor';

import {
  SignIn, LogOut, AddUser, RemoveUser, GetRandomInt
} from '../helper.e2e-spec';

describe('Admin User e2e Tests', function () {

  const testUserName  = `test${GetRandomInt(1, 1000000)}`;
  const testUserEmail = `${testUserName}@test.com`;

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    element(by.id('admin-user-link')).click();
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin User';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('admin-user')).getText()).toEqual(expectedMsg);
  });

  it('should display an add button', function () {
    expect(element(by.id('add-user')).isPresent()).toBeTruthy();
  });

  it('should navigate to add new user', function () {
    element(by.id('add-user')).click();

    expect(element(by.css('h1')).getText()).toEqual('Admin User Detail');
    expect(element(by.id('name')).getText()).toEqual('');
    expect(element(by.id('email')).getText()).toEqual('');
  });

  it('should navigate to edit an user', function () {
    let userElement = element.all(by.className('users')).get(1);
    userElement.getAttribute('value')
      .then((name) => {

        userElement.click();

        expect(element(by.id('name')).getAttribute('value')).toEqual(name);
      });
  });

  it('should add an user', function () {
    let userElement = element(by.id(`delete-${testUserName}`));

    AddUser(testUserName, testUserEmail);

    element(by.id('admin-user-link')).click();

    expect(userElement.isPresent()).toBeTruthy();
  });

  it('should delete an user', function () {
    let userElement = element(by.id(`delete-${testUserName}`));

    RemoveUser(testUserName);

    element(by.id('admin-user-link')).click();

    expect(userElement.isPresent()).toBeFalsy();
  });

  it('should shown an existing user', function () {
    let userElement = element.all(by.className('users')).get(2);
    userElement.getAttribute('value')
      .then((name) => {

        element(by.id('user-search-box')).sendKeys(name);

        element.all(by.className('users')).count().then((size: number) => {
          expect(size).toBe(1);
        });
      });
  });

  it('should not shown a no existing user', function () {
    let userName = 'f4k3N4m3';

    element(by.id('user-search-box')).sendKeys(userName);

    element.all(by.className('users')).count().then((size: number) => {
      expect(size).toBe(0);
    });
  });

  afterAll(function () {
    LogOut();
  });
});
