import { browser, element, by, protractor } from 'protractor';

// NOTICE: Redis and rails servers must be running for this to work

// To sign in a specific user. 
export function SignIn(): void {

  browser.get('');

  // Click on sign in link
  element(by.id('sign-in-link')).click();

  // Fill user data
  element(by.id('name')).sendKeys('admin');
  element(by.id('email')).sendKeys('admin@admin.com');

  // Sign in submit button
  element(by.id('sign-in-submit')).click();
}

// To log out
export function LogOut(): void {

  browser.get('');

  // Click on log out link
  element(by.id('admin-log-out')).click();
}

// Create a dummy user. Will be remove later
export function AddUser(userName: string, userEmail: string): void {

  SignIn();

  element(by.id('admin-user-link')).click();

  element(by.id('add-user')).click();

  element(by.id('name')).sendKeys(userName);
  element(by.id('email')).sendKeys(userEmail);

  browser.executeScript('window.scrollTo(0,0);').then(() => {
    element(by.id('user-detail-save')).click();
  });
}

// To remove a specific user. For clean up purposes
export function RemoveUser(userName: string): void {

  SignIn();

  element(by.id('admin-user-link')).click();

  let elementToClick = element(by.id(`delete-${userName}`));

  // wait for the element to be clickable 
  browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 10000)
    .then (() => {
      // little hack to scroll down the whole page. This is good to click the delete btn
      browser.executeScript('window.scrollTo(0,10000);').then(() => {
        elementToClick.click();
      });
    });
}

export function GetRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
