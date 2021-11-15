import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ComentariosComponentsPage from './comentarios.page-object';
import ComentariosUpdatePage from './comentarios-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Comentarios e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let comentariosComponentsPage: ComentariosComponentsPage;
  let comentariosUpdatePage: ComentariosUpdatePage;
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
    comentariosComponentsPage = new ComentariosComponentsPage();
    comentariosComponentsPage = await comentariosComponentsPage.goToPage(navBarPage);
  });

  it('should load Comentarios', async () => {
    expect(await comentariosComponentsPage.title.getText()).to.match(/Comentarios/);
    expect(await comentariosComponentsPage.createButton.isEnabled()).to.be.true;
  });

  /* it('should create and delete Comentarios', async () => {
        const beforeRecordsCount = await isVisible(comentariosComponentsPage.noRecords) ? 0 : await getRecordsCount(comentariosComponentsPage.table);
        comentariosUpdatePage = await comentariosComponentsPage.goToCreateComentarios();
        await comentariosUpdatePage.enterData();

        expect(await comentariosComponentsPage.createButton.isEnabled()).to.be.true;
        await waitUntilDisplayed(comentariosComponentsPage.table);
        await waitUntilCount(comentariosComponentsPage.records, beforeRecordsCount + 1);
        expect(await comentariosComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

        await comentariosComponentsPage.deleteComentarios();
        if(beforeRecordsCount !== 0) {
          await waitUntilCount(comentariosComponentsPage.records, beforeRecordsCount);
          expect(await comentariosComponentsPage.records.count()).to.eq(beforeRecordsCount);
        } else {
          await waitUntilDisplayed(comentariosComponentsPage.noRecords);
        }
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
