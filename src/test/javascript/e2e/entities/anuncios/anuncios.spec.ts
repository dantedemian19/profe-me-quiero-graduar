import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AnunciosComponentsPage from './anuncios.page-object';
import AnunciosUpdatePage from './anuncios-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Anuncios e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let anunciosComponentsPage: AnunciosComponentsPage;
  let anunciosUpdatePage: AnunciosUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    anunciosComponentsPage = new AnunciosComponentsPage();
    anunciosComponentsPage = await anunciosComponentsPage.goToPage(navBarPage);
  });

  it('should load Anuncios', async () => {
    expect(await anunciosComponentsPage.title.getText()).to.match(/Anuncios/);
    expect(await anunciosComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Anuncios', async () => {
    const beforeRecordsCount = (await isVisible(anunciosComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(anunciosComponentsPage.table);
    anunciosUpdatePage = await anunciosComponentsPage.goToCreateAnuncios();
    await anunciosUpdatePage.enterData();

    expect(await anunciosComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(anunciosComponentsPage.table);
    await waitUntilCount(anunciosComponentsPage.records, beforeRecordsCount + 1);
    expect(await anunciosComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await anunciosComponentsPage.deleteAnuncios();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(anunciosComponentsPage.records, beforeRecordsCount);
      expect(await anunciosComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(anunciosComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
