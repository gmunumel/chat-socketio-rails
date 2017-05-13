import { browser, element, by } from 'protractor';

import { SignIn, LogOut, GetRandomInt } from '../helper.e2e-spec';

describe('Admin Chat Room Detail e2e Tests', function () {

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    browser.get('/admin/chat-room/detail/2');
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin Chat Room Detail';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.admin-chat-room-detail')).getText()).toEqual(expectedMsg);
  });

  it('should display a save button', function () {
    expect(element(by.id('chat-room-detail-save')).isPresent()).toBeTruthy();
  });

  it('should display a back button', function () {
    expect(element(by.id('chat-room-detail-back')).isPresent()).toBeTruthy();
  });

  it('should navigate to chat rooms list', function () {
    element(by.id('chat-room-detail-back')).click();

    expect(element(by.css('h1')).getText()).toEqual('Admin Chat Room');
  });

  it('should update a chat room', function () {
    element(by.id('title')).getAttribute('value')
      .then((oldTitle) => {
        let newTitle = oldTitle + '-' + GetRandomInt(1, 1000000);

        expect(oldTitle).not.toBe(newTitle);

        setChatRoomTitle(newTitle);

        browser.get('/admin/chat-room/detail/2');

        expect(element(by.id('title')).getAttribute('value')).toBe(newTitle);

        // clean up the chat room title
        setChatRoomTitle(oldTitle);
      });
  });

  afterAll(function () {
    LogOut();
  });

  function setChatRoomTitle(title: string): void {
    element(by.id('title')).clear();

    element(by.id('title')).sendKeys(title);

    element(by.id('chat-room-detail-save')).click();
  };
});
