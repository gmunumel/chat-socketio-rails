import { browser, element, by } from 'protractor';

import { SignIn, LogOut, AddMessage, RemoveMessage } from '../helper.e2e-spec';

describe('Admin Message e2e Tests', function () {

  const chatRoomId = 1;

  beforeAll(function () {
    SignIn();
  });

  beforeEach(function () {
    element(by.id('admin-message-link')).click();

    // select chat-room
    element(by.id(`select-${chatRoomId}`)).click();
  });

  // This is used for testing purposes.
  // Redis and rails servers must be running for this to work

  let expectedMsg = 'Admin Message';

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('admin-message')).getText()).toEqual(expectedMsg);
  });

  it('should display an add button', function () {
    expect(element(by.id('add-message')).isPresent()).toBeTruthy();
  });

  // it('should navigate to add new chat room', function () {
  //   element(by.id('add-chat-room')).click();

  //   expect(element(by.css('h1')).getText()).toEqual('Admin Chat Room Detail');
  //   expect(element(by.id('title')).getText()).toEqual('');
  // });

  it('should navigate to edit a message', function () {
    let messageElement = element.all(by.xpath('//ul[@class="chat"]/li/div/input')).get(1);
    messageElement.getAttribute('value')
      .then((body) => {

        console.log('======> messageElement: ' + messageElement);
        // browser.pause();

        // little hack to scroll down the whole page to move where the delete button is
        browser.executeScript('window.scrollTo(0, 10000);').then(() => {
          messageElement.click();

          //browser.pause();

          //let messageDetailBody = element.all(by.id('body')).map((elem: any) => elem.getText());
          element(by.id('body')).getAttribute('value')
              .then((messageDetailBody) => {

                  console.log('=====> body: ' + body);
                  console.log('=====> new body: ' + messageDetailBody);
              });

          

          // browser.pause();

          // expect(body).toEqual(messageDetailBody);
          //expect(element(by.id('body')).getAttribute('value')).toEqual(body);
        });
      });
  });

  // it('should delete a chat room', function () {
  //   let title    = 'test1234';
  //   let chatRoomElement = element(by.id(`delete-${title}`));

  //   AddChatRoom(title);

  //   element(by.id('admin-chat-room-link')).click();

  //   expect(chatRoomElement.isPresent()).toBeTruthy();

  //   RemoveChatRoom(title);

  //   element(by.id('admin-chat-room-link')).click();

  //   expect(chatRoomElement.isPresent()).toBeFalsy();
  // });

  // it('should shown an existing chat room', function () {
  //   let chatRoomElement = element.all(by.className('chat-rooms')).get(2);
  //   chatRoomElement.getAttribute('value')
  //     .then((title) => {

  //       element(by.id('chat-room-search-box')).sendKeys(title);

  //       element.all(by.className('chat-rooms')).count().then((size: number) => {
  //         expect(size).toBe(1);
  //       });
  //     });
  // });

  // it('should not shown a no existing chat room', function () {
  //   let title = 'f4k3T1tl3';

  //   element(by.id('chat-room-search-box')).sendKeys(title);

  //   element.all(by.className('chat-rooms')).count().then((size: number) => {
  //     expect(size).toBe(0);
  //   });
  // });

  afterAll(function () {
    LogOut();
  });
});
