import { expectToBeRejected } from '../../../../support/util';

const chapterData = {
  name: 'New Chapter Name',
  description: 'New Description',
  city: 'New City',
  region: 'New Region',
  country: 'New Country',
  category: 'New Category',
  image_url: 'https://example.com/new-image.jpg',
};
const chapterId = 1;

describe('chapter edit dashboard', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });
  it('allows admins to edit a chapter', () => {
    cy.login('admin@of.chapter.one');
    cy.visit(`/dashboard/chapters/${chapterId}/edit`);

    cy.findByRole('textbox', { name: 'Chapter name' })
      .clear()
      .type(chapterData.name);
    cy.findByRole('textbox', { name: 'Description' })
      .clear()
      .type(chapterData.description);
    cy.findByRole('textbox', { name: 'City' }).clear().type(chapterData.city);
    cy.findByRole('textbox', { name: 'Region' })
      .clear()
      .type(chapterData.region);
    cy.findByRole('textbox', { name: 'Country' })
      .clear()
      .type(chapterData.country);
    cy.findByRole('textbox', { name: 'Category' })
      .clear()
      .type(chapterData.category);
    cy.findByRole('textbox', { name: 'Image Url' })
      .clear()
      .type(chapterData.image_url);

    cy.findByRole('form', { name: 'Save Chapter Changes' })
      .findByRole('button', { name: 'Save Chapter Changes' })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/chapters/);
    cy.contains('New Chapter Name');
  });

  it('rejects requests from members, but allows them from owners', () => {
    // confirm the chapter is ready to be updated (i.e. doesn't not already have
    // the new name)
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.contains('loading').should('not.exist');
    cy.contains(chapterData.name).should('not.exist');

    cy.login('test@user.org');

    cy.updateChapter(chapterId, chapterData).then((response) => {
      expectToBeRejected(response);

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name).should('not.exist');
    });

    // back to owner
    cy.login();
    cy.updateChapter(chapterId, chapterData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name);
    });
  });

  it('only accepts chapter deletion requests from owners', () => {
    cy.login('admin@of.chapter.one');

    cy.deleteChapter(chapterId).then((response) => {
      expectToBeRejected(response);
    });

    cy.login();
    cy.deleteChapter(chapterId).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;
    });
  });
});