import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import CiudadUpdatePage from './ciudad-update.page-object';

const expect = chai.expect;
export class CiudadDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('profeMeQuieroGraduarApp.ciudad.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-ciudad'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class CiudadComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('ciudad-heading'));
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
    await navBarPage.getEntityPage('ciudad');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateCiudad() {
    await this.createButton.click();
    return new CiudadUpdatePage();
  }

  async deleteCiudad() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const ciudadDeleteDialog = new CiudadDeleteDialog();
    await waitUntilDisplayed(ciudadDeleteDialog.deleteModal);
    expect(await ciudadDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/profeMeQuieroGraduarApp.ciudad.delete.question/);
    await ciudadDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(ciudadDeleteDialog.deleteModal);

    expect(await isVisible(ciudadDeleteDialog.deleteModal)).to.be.false;
  }
}
