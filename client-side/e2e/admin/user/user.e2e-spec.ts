import { element, by } from 'protractor';

import { SignIn, LogOut, AddUser, RemoveUser } from '../helper.e2e-spec';

describe('Admin User e2e Tests', function () {

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
    expect(element(by.css('.admin-user')).getText()).toEqual(expectedMsg);
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
    let userElement = element.all(by.css('.users')).get(1);
    userElement.getAttribute('value')
      .then((name) => {

        userElement.click();

        expect(element(by.id('name')).getAttribute('value')).toEqual(name);
      });
  });

  it('should delete an user', function () {
    let userName  = 'test1234';
    let userEmail = 'test1234@test.com';

    AddUser(userName, userEmail);

    expect(element(by.id(`delete-${userName}`)).isPresent()).toBeTruthy();

    RemoveUser(userName);

    expect(element(by.id(`delete-${userName}`)).isPresent()).toBeFalsy();
  });

  afterAll(function () {
    LogOut();
  });
});
