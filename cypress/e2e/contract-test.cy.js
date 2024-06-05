/// <reference types="cypress" />

describe('Contract Management', () => {
  it('admin user can create a contract with a URL', () => {
    // Log in as an admin user
    cy.login('agraves', 'hunter2');
    cy.visit('/login');
    cy.contains('Login to Gitwallet').should('not.exist');

    // Navigate to the contracts page
    cy.visit('/maintainer/contracts');
    cy.contains('Available Contracts').should('exist');

    // Click on the "Create Contract" button
    cy.contains('button', 'Create Contract').click();

    // Fill in the contract details
    cy.get('input[name="name"]').type('Sample Contract');
    cy.get('input[name="description"]').type('This is a sample contract');

    // Select the "Specify URL" radio button
    cy.get('input[name="attachmentType"][value="link"]').check();

    // Enter the contract URL
    cy.get('input[name="url"]').type('https://example.com/contracts/sample');

    // Submit the form
    cy.contains('button', 'Create Contract').click();

    cy.contains('created successfully', { timeout: 10000 }).should('exist');

    //cy.visit('/');
    cy.visit('/maintainer/contracts');

    // Verify that the contract is created successfully
    cy.contains('Available Contracts').should('exist');
    cy.contains('Sample Contract').should('exist');

    // Navigate to the contract details page
    cy.contains('Sample Contract').click();

    // Verify the contract details
    cy.contains('h1', 'Sample Contract').should('exist');
    cy.contains('This is a sample contract').should('exist');
    cy.contains('a', 'View Contract').should('have.attr', 'href', 'https://example.com/contracts/sample');

    // delete the contract
    cy.visit('/maintainer/contracts');
    cy.contains('button', 'Delete').last().click();
    cy.visit('/maintainer/contracts');
    cy.contains('Available Contracts').should('exist');
    cy.contains('h1', 'Sample Contract').should('not.exist');
  });
});