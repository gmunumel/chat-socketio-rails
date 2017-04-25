import { browser, element, by } from 'protractor';

describe('Admin Chat Room e2e Tests', function () {

  let expectedMsg = 'Admin Chat Room';

  beforeEach(function () {
    browser.get('');

    element(by.id('admin-chat-room-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('.admin-chat-room')).getText()).toEqual(expectedMsg);
  });

});
