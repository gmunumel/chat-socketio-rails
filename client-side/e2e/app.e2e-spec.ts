import { ClientSidePage } from './app.po';

describe('client-side App', function() {
  let page: ClientSidePage;

  beforeEach(() => {
    page = new ClientSidePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
