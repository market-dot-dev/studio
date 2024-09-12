/// <reference types="cypress" />

describe('gitwallet smoke test', () => {
  it('admin user can log in', () => {
    // log in
    cy.login('agraves', 'hunter2');
    cy.visit('/login');
    cy.contains('Login to Gitwallet').should('not.exist');

    // check stripe is connected
    cy.visit('/settings/payment');
    cy.contains('Your Stripe account is connected').should('exist');

    // edit the tier
    cy.visit('/tiers');
    cy.contains('Buy me a Coffee')
    .parents('.tremor-Card-root') // Traverse to the parent container
    .within(() => {
      cy.contains('Edit').click();
    });

    // make it available for sale
    cy.contains('h3', 'Buy me a Coffee').should('be.visible');
    cy.get('[data-cy="available-for-sale"]').check();
    cy.contains('button', 'Update Tier').click();
    cy.wait(3000);

    // visit checkout
    cy.contains('button', 'Get Started').click();
    cy.contains('Purchase Buy me a Coffee').should('exist');
    cy.wait(3000);
    const creditCardDetails = { cardNumber: '4242424242424242', expiry: '1232', cvcNumber: '123', zip: '90210' }
    cy.populateCardInformationForm(creditCardDetails);
    cy.get('[data-cy="checkout-button"]').click();

    // verify transaction went through
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
  });
})
