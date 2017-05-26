import { browser, element, by } from 'protractor';

import { SignIn, LogOut }       from '../helper.e2e-spec';

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

  it('should navigate to edit a message', function () {
    let messageElement = element.all(by.xpath('//ul[@class="chat"]/li/div/p')).get(1);

    messageElement.getText()
      .then((body) => {

        // little hack to scroll down the whole page to move where the delete button is
        browser.executeScript('window.scrollTo(0, 10000);').then(() => {
          messageElement.click();

          element(by.id('body')).getAttribute('value')
            .then((messageDetailBody) => {
              expect(body).toEqual(messageDetailBody);
            });
        });
      });
  });

  afterAll(function () {
    LogOut();
  });
});
