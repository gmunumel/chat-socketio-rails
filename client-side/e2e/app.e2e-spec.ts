import { browser, element, by } from 'protractor';

describe('Client Side Chat E2E Tests', function () {

  let expectedMsg = 'My App Page';

  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
  });

});
