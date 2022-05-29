# Testing
 
- [Testing](#Testing)
  - [Setup up Cypress](#Setup-up-Cypress)
    - [Create a sanity check](#Create-a-sanity-check)
    - [Bonus: Create a performance test *](#Bonus-Create-a-performance-test-)
  - [Create some tests for your app](#Create-some-tests-for-your-app)
    - [Write some basic assertions](#Write-some-basic-assertions)
    - [Bonus: Implementing your own tests **](#Bonus-Implementing-your-own-tests-)

## Setup up Cypress

Since we already have the Cypress packages installed (see the _devDependencies_ in your ``package.json``) we only need to tell Cypress where it will find our running Angular app.  In the ``cypress.json`` in the root directory make sure you have got you development URL set up like this:

    { "baseUrl": "http://localhost:4200" }

### Create a sanity check

1. Create or switch the directory ``cypress/integration`` and create a new test file ``misc.spec.ts``.

2. Open the file `misc.spec.ts` and add a sanity test.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    describe('misc e2e tests', () => {
      it('should do a sanity check', () => {
        cy.visit('');
      });
   
      // next test goes here
    });
    ```

    </p>
    </details>

3. Now fire up your application with ``npm start`` or ``ng s``.
4. Now it's time to test your testing by running ``cypress run``.

   If everything is setup correctly you should get 1 passing test.

   Note that you could also run ``cypress open`` to load the Cypress testing GUI.

### Bonus: Create a performance test *

We can create a simple performance test that checks if our app loads in less than a second.

1. Since you're probably not familiar with the Cypress syntax you can just copy the following test into your ``misc.spec.ts``:

    <details>
    <summary>Show Code</summary>
    <p>
    
    ```typescript
    it('should load page below 1 second', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start-loading');
        },
        onLoad: (win) => {
          win.performance.mark('end-loading');
        }
      })
        .its('performance')
        .then((p) => {
          p.measure('pageLoad', 'start-loading', 'end-loading');
          const measure = p.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.most(1000); 
      });
    });
    ```
    
    </p>
    </details>

2. Make sure this second test succeeds. If however you're machine is too slow you can raise the time cap.

## Create some tests for your app

### Write some basic assertions

1. Create and open the file `page.spec.ts`.

2. Now again add a ``describe`` block: 

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    describe('page e2e tests', () => {
      it('should do a sanity check', () => {
        cy.visit('');
      });

      // next tests go here
    });
    ```

    </p>
    </details>

   Now add some tests for your app. You can create your own tests or do the following examples:

3. Create an **implicit subject assertion** where you test the H1 of your app. If you haven't changed it that H1 should still contain the text ``Hello World!``

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    it('should do an implicit subject assertion', () => {
      cy.visit('');
      cy.get('h1').should('have.text', 'Hello World!');
    });
    ```

    </p>
    </details>

4. Now create an **implicit subject assertion** where you check if your flight search form submit button is enabled after entering a valid content. Make sure your using the correct URL in the first line!

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    it('should do an explicit subject assertion', () => {
      cy.visit('/flight-booking/flight-search');
      cy.get('form .btn').should(($button) => {
        expect($button).to.have.attr('disabled', 'disabled');
      });
      cy.get('form input[name="from"]').type('Graz');
      cy.get('form input[name="to"]').type('Hamburg');
      cy.get('form .btn').should(($button) => {
        expect($button).to.not.have.attr('disabled', 'disabled');
      });
    });
    ```

    </p>
    </details>

5. Before you start playing around let's do another last example. This test of course make no sense in real world, but it's clearly just a simple demo here. Check how many flights you get from the API for flying from Hamburg to Graz and put this in a test:

    <details>
    <summary>Show Code</summary>
    <p>

   ```typescript
    it('should do an explicit subject assertion', () => {
      cy.visit('/flight-booking/flight-search');
      cy.get('form input[name="from"]').type('Graz');
      cy.get('form input[name="to"]').type('Hamburg');
      cy.get('form .btn').click();

      cy.get('flight-card').should('have.length', 7);
    });
   ```

    </p>
    </details>

### Bonus: Implementing your own tests **

1. [Here](https://docs.cypress.io/guides/getting-started/writing-your-first-test) you find some information about writing tests. Have a look at it.

2. Create your own tests and see if they succeed.

3. If you write an interesting test make sure to present it to your team mates.
