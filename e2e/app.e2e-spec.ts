import { AngularCliAdvancedPage } from './app.po';

describe('angular-cli-advanced App', () => {
  let page: AngularCliAdvancedPage;

  beforeEach(() => {
    page = new AngularCliAdvancedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
