it('App loads correctly', () => {
  cy.visit('http://localhost:5173/')
  cy.get('h1').contains('Vite + React')
})
