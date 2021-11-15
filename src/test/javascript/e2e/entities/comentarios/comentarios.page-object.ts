import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import ComentariosUpdatePage from './comentarios-update.page-object';

const expect = chai.expect;
export class ComentariosDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('profeMeQuieroGraduarApp.comentarios.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-comentarios'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ComentariosComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('comentarios-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('comentarios');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateComentarios() {
    await this.createButton.click();
    return new ComentariosUpdatePage();
  }

  async deleteComentarios() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const comentariosDeleteDialog = new ComentariosDeleteDialog();
    await waitUntilDisplayed(comentariosDeleteDialog.deleteModal);
    expect(await comentariosDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /profeMeQuieroGraduarApp.comentarios.delete.question/
    );
    await comentariosDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(comentariosDeleteDialog.deleteModal);

    expect(await isVisible(comentariosDeleteDialog.deleteModal)).to.be.false;
  }
}
