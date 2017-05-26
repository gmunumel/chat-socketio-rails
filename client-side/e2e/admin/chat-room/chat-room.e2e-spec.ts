import { element, by } from 'protractor';

import {
  SignIn, LogOut, AddChatRoom, RemoveChatRoom, GetRandomInt
} from '../helper.e2e-spec';

describe('Admin Chat Room e2e Tests', function () {

  const testChatRoom = `test-${GetRandomInt(1, 1000000)}`;

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    element(by.id('admin-chat-room-link')).click();
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin Chat Room';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('admin-chat-room')).getText()).toEqual(expectedMsg);
  });

  it('should display an add button', function () {
    expect(element(by.id('add-chat-room')).isPresent()).toBeTruthy();
  });

  it('should navigate to add new chat room', function () {
    element(by.id('add-chat-room')).click();

    expect(element(by.css('h1')).getText()).toEqual('Admin Chat Room Detail');
    expect(element(by.id('title')).getText()).toEqual('');
  });

  it('should navigate to edit a chat room', function () {
    let userElement = element.all(by.className('chat-rooms')).get(1);
    userElement.getAttribute('value')
      .then((title) => {

        userElement.click();

        expect(element(by.id('title')).getAttribute('value')).toEqual(title);
      });
  });

  it('should add a chat room', function () {
    let chatRoomElement = element(by.id(`delete-${testChatRoom}`));

    AddChatRoom(testChatRoom);

    element(by.id('admin-chat-room-link')).click();

    expect(chatRoomElement.isPresent()).toBeTruthy();
  });

  it('should delete a chat room', function () {
    let chatRoomElement = element(by.id(`delete-${testChatRoom}`));

    RemoveChatRoom(testChatRoom);

    element(by.id('admin-chat-room-link')).click();

    expect(chatRoomElement.isPresent()).toBeFalsy();
  });

  it('should shown an existing chat room', function () {
    let chatRoomElement = element.all(by.className('chat-rooms')).get(2);
    chatRoomElement.getAttribute('value')
      .then((title) => {

        element(by.id('chat-room-search-box')).sendKeys(title);

        element.all(by.className('chat-rooms')).count().then((size: number) => {
          expect(size).toBe(1);
        });
      });
  });

  it('should not shown a no existing chat room', function () {
    let title = 'f4k3T1tl3';

    element(by.id('chat-room-search-box')).sendKeys(title);

    element.all(by.className('chat-rooms')).count().then((size: number) => {
      expect(size).toBe(0);
    });
  });

  afterAll(function () {
    LogOut();
  });
});
