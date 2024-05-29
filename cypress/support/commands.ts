/// <reference types="cypress" />

export {};

// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.contains('Local Auth').click();
  cy.contains('in with Local Auth').should('exist');

  // Fill in the credentials
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);

  // Submit the form
  cy.get('button[type="submit"]').click();

  cy.get('h1').should('contain', 'Welcome,');
});

Cypress.Commands.add('setupStripe', () => {
  cy.visit('/settings/payment');

  /*
  cy.get('fieldset.ToggleBox').within(() => {
    // Click the first radio button
    cy.get('input[type="radio"]').first().check();
  });
  */
  cy.contains('Connect to Stripe').click();

  // Click the "Skip this form" button
  cy.origin('https://connect.stripe.com', () => {
    cy.contains('span', 'Skip this form').click();
  });

  cy.url().should('contain', '/login');
  
  cy.contains('Log in with Local Auth').click();
  cy.visit('/settings/payment');

  cy.contains('Your Stripe account is connected').should('exist');
});

Cypress.Commands.add("populateCardInformationForm", (creditCardDetails) => {
  cy.get('iframe')
    .its('0.contentDocument')
    .should('exist')
    .its('body')
    .should('not.be.undefined')
    .should('not.be.empty')
    .then(cy.wrap)
    .within(() => {
      cy.get('input[name="cardnumber"]').type(creditCardDetails.cardNumber);
      cy.get('input[name="exp-date"]').type(creditCardDetails.expiry);
      cy.get('input[name="cvc"]').type(creditCardDetails.cvcNumber);
      cy.get('input[name="postal"]').type(creditCardDetails.zip);
    })
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable
      setupStripe(): Chainable
      populateCardInformationForm(creditCardDetails: { cardNumber: string, expiry: string, cvcNumber: string, zip: string }): Chainable
      // Add other custom command type definitions if needed
    }
  }
}