/// <reference types="cypress" />

describe('Contract Management', () => {
  it('admin user can create a contract with a URL', () => {
    // Login and navigate to contracts page
    cy.login('agraves', 'hunter2');
    cy.visit('/login');
    cy.contains('Login to Gitwallet').should('not.exist');
    cy.visit('/contracts');
    cy.contains('GitWallet Standard MSA').should('exist');

    // Create new contract
    cy.contains('button', 'New Contract').click();
    cy.get('input[name="name"]').type('Sample Contract');
    cy.get('textarea[name="description"]').type('This is a sample contract');
    cy.get('input[name="storage"][value="link"]').check();
    cy.get('input[name="url"]').type('https://example.com/contracts/sample');
    cy.contains('button', 'Create Contract').click();

    // Verify contract creation
    cy.contains('created successfully', { timeout: 10000 }).should('exist');
    cy.visit('/contracts');
    cy.contains('GitWallet Standard MSA').should('exist');
    cy.contains('Sample Contract').should('exist');

    // Check contract details
    cy.contains('a', 'Sample Contract').click();
    cy.contains('Sample Contract').should('exist');
    cy.contains('This is a sample contract').should('exist');

    cy.wait(1000);
    
    cy.get('a:contains("View")').then($a => {
      const contractUrl = $a.attr('href');
  
      // Verify contract URL
      cy.visit(contractUrl);
      cy.get('embed').should('have.attr', 'src', 'https://example.com/contracts/sample#toolbar=0');
      
      cy.go('back');
      cy.wait(1000);
      
      // Delete contract
      cy.contains('button', 'Delete')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      
      cy.wait(1000);
      
      cy.contains('button', 'Delete Contract')
        .should('be.visible')
        .and('not.be.disabled')
        .click();

      // Verify contract deletion
      cy.url().should('include', '/contracts', { timeout: 10000 });
      cy.contains('GitWallet Standard MSA').should('exist');
      cy.contains('h1', 'Sample Contract').should('not.exist');
    });
  });
});