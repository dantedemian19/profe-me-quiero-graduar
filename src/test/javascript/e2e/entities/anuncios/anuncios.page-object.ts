import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import AnunciosUpdatePage from './anuncios-update.page-object';

const expect = chai.expect;
export class AnunciosDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('profeMeQuieroGraduarApp.anuncios.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-anuncios'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class AnunciosComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('anuncios-heading'));
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
    await navBarPage.getEntityPage('anuncios');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateAnuncios() {
    await this.createButton.click();
    return new AnunciosUpdatePage();
  }

  async deleteAnuncios() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const anunciosDeleteDialog = new AnunciosDeleteDialog();
    await waitUntilDisplayed(anunciosDeleteDialog.deleteModal);
    expect(await anunciosDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/profeMeQuieroGraduarApp.anuncios.delete.question/);
    await anunciosDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(anunciosDeleteDialog.deleteModal);

    expect(await isVisible(anunciosDeleteDialog.deleteModal)).to.be.false;
  }
}
