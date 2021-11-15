import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class ComentariosUpdatePage {
  pageTitle: ElementFinder = element(by.id('profeMeQuieroGraduarApp.comentarios.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  textInput: ElementFinder = element(by.css('textarea#comentarios-text'));
  dateInput: ElementFinder = element(by.css('input#comentarios-date'));
  starsSelect: ElementFinder = element(by.css('select#comentarios-stars'));
  authorInput: ElementFinder = element(by.css('input#comentarios-author'));
  anuncioSelect: ElementFinder = element(by.css('select#comentarios-anuncio'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTextInput(text) {
    await this.textInput.sendKeys(text);
  }

  async getTextInput() {
    return this.textInput.getAttribute('value');
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return this.dateInput.getAttribute('value');
  }

  async setStarsSelect(stars) {
    await this.starsSelect.sendKeys(stars);
  }

  async getStarsSelect() {
    return this.starsSelect.element(by.css('option:checked')).getText();
  }

  async starsSelectLastOption() {
    await this.starsSelect.all(by.tagName('option')).last().click();
  }
  async setAuthorInput(author) {
    await this.authorInput.sendKeys(author);
  }

  async getAuthorInput() {
    return this.authorInput.getAttribute('value');
  }

  async anuncioSelectLastOption() {
    await this.anuncioSelect.all(by.tagName('option')).last().click();
  }

  async anuncioSelectOption(option) {
    await this.anuncioSelect.sendKeys(option);
  }

  getAnuncioSelect() {
    return this.anuncioSelect;
  }

  async getAnuncioSelectedOption() {
    return this.anuncioSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setTextInput('text');
    expect(await this.getTextInput()).to.match(/text/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getDateInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.starsSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setAuthorInput('author');
    expect(await this.getAuthorInput()).to.match(/author/);
    await this.anuncioSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
