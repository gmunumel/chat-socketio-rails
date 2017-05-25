import { browser, element, by } from 'protractor';

describe('About e2e Tests', function () {

  let expectedMsg = 'About';

  beforeEach(function () {
    browser.get('');

    element(by.id('about-link')).click();
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.className('about')).getText()).toEqual(expectedMsg);
  });

});
