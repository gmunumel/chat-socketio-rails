import { browser, element, by } from 'protractor';

import {
  SignIn, LogOut, AddMessage, RemoveMessage, GetRandomInt
} from '../helper.e2e-spec';

describe('Admin Message Detail e2e Tests', function () {

  const chatRoomId  = 1;
  const url         = '/admin/chat-room/1/message/detail/1';
  const testMessage = `test-${GetRandomInt(1, 1000000)}`;

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    browser.get(url);
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin Message Detail';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('admin-message-detail')).getText()).toEqual(expectedMsg);
  });

  it('should display an update button', function () {
    expect(element(by.id('message-detail-update')).isPresent()).toBeTruthy();
  });

  it('should display a back button', function () {
    expect(element(by.id('message-detail-back')).isPresent()).toBeTruthy();
  });

  it('should display a delete button', function () {
    expect(element(by.id('message-detail-delete')).isPresent()).toBeTruthy();
  });

  it('should navigate to message list', function () {
    element(by.id('message-detail-back')).click();

    expect(element(by.css('h1')).getText()).toEqual('Admin Message');
  });

  it('should update a message', function () {
    element(by.id('body')).getAttribute('value')
      .then((originalBody) => {
        let testBody = `testBody-${GetRandomInt(1, 1000000)}`;

        expect(originalBody).not.toBe(testBody);

        setMessageBody(testBody);

        browser.get(url);

        element(by.id('body')).getAttribute('value')
          .then((newBody) => {

            expect(testBody).toEqual(newBody);

            // clean up the message body
            setMessageBody(originalBody);
          });
      });
  });

  it('should add a message', function () {
    let messageElement = element.all(by.xpath('//ul[@class="chat"]/li/div/p')).last();

    AddMessage(testMessage, chatRoomId);

    element(by.id('admin-message-link')).click();

    messageElement.getText()
      .then((newBody: string) => {

        expect(testMessage).toBe(newBody);
      });
  });

  it('should delete a message', function () {
    let messageElement = element.all(by.xpath('//ul[@class="chat"]/li/div/p')).last();

    RemoveMessage(testMessage, chatRoomId);

    messageElement.getText()
      .then((newBody: string) => {

        expect(testMessage).not.toBe(newBody);
      });
  });

  afterAll(function () {
    LogOut();
  });

  function setMessageBody(body: string): void {
    element(by.id('body')).clear();

    element(by.id('body')).sendKeys(body);

    element(by.id('message-detail-update')).click();

    browser.waitForAngular();
  };
});
