import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CiudadComponentsPage from './ciudad.page-object';
import CiudadUpdatePage from './ciudad-update.page-object';
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

describe('Ciudad e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ciudadComponentsPage: CiudadComponentsPage;
  let ciudadUpdatePage: CiudadUpdatePage;
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
    ciudadComponentsPage = new CiudadComponentsPage();
    ciudadComponentsPage = await ciudadComponentsPage.goToPage(navBarPage);
  });

  it('should load Ciudads', async () => {
    expect(await ciudadComponentsPage.title.getText()).to.match(/Ciudads/);
    expect(await ciudadComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Ciudads', async () => {
    const beforeRecordsCount = (await isVisible(ciudadComponentsPage.noRecords)) ? 0 : await getRecordsCount(ciudadComponentsPage.table);
    ciudadUpdatePage = await ciudadComponentsPage.goToCreateCiudad();
    await ciudadUpdatePage.enterData();

    expect(await ciudadComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(ciudadComponentsPage.table);
    await waitUntilCount(ciudadComponentsPage.records, beforeRecordsCount + 1);
    expect(await ciudadComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await ciudadComponentsPage.deleteCiudad();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(ciudadComponentsPage.records, beforeRecordsCount);
      expect(await ciudadComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(ciudadComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
