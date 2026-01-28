/// <reference types="cypress" />

const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  MODAL_CONTENT: '[data-cy="modal-content"]',
  INGREDIENT_DETAILS: '[data-cy="ingredient-details"]',
  ORDER_NUMBER: '[data-cy="order-number"]',
  BURGER_CONSTRUCTOR: '[data-cy="burger-constructor"]',
  API_INGREDIENTS: 'api/ingredients',
  API_ORDERS: 'api/orders',
  FIXTURE_USER: 'user.json',
  API_AUTH_USER: 'api/auth/user',
  FIXTURE_INGREDIENTS: 'ingredients.json',
  SELECT_BUNS_TEXT: 'Выберите булки',
  SELECT_FILLINGS_TEXT: 'Выберите начинку',
  FIXTURE_ORDER: 'order.json',
  ACCESS_TOKEN_COOKIE: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  FIXTURE_REFRESH_TOKEN: 'refresh-token.json'
};

const BUTTON_ADD = 'Добавить';
const BUTTON_CREATE_ORDER = 'Оформить заказ';

const INGREDIENTS = {
  KRATORNAYA_BUN: 'Краторная булка N-200i',
  BIOKOTLET: 'Биокотлета из марсианской Магнолии',
  SPICY_SAUCE: 'Соус Spicy-X'
};
const ORDER = { NUMBER: '55555' };

const addIngredient = (ingredientName: string) => {
  cy.contains(ingredientName)
    .parents('li')
    .find(`button:contains("${BUTTON_ADD}")`)
    .click();
};

describe('End-to-end test', () => {
  beforeEach(() => {
    cy.intercept('GET', SELECTORS.API_INGREDIENTS, {
      fixture: SELECTORS.FIXTURE_INGREDIENTS
    }).as('fetchIngredients');

    cy.visit('http://localhost:4000/');
    cy.wait('@fetchIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());
  });

  it('Добавляет булку в конструктор', () => {
    cy.contains(INGREDIENTS.KRATORNAYA_BUN)
      .parents('li')
      .find(`button:contains("${BUTTON_ADD}")`)
      .click();

    cy.get('body').should('contain', INGREDIENTS.KRATORNAYA_BUN);
  });

  it('Добавляет начинку в конструктор', () => {
    cy.contains(INGREDIENTS.KRATORNAYA_BUN)
      .parents('li')
      .find(`button:contains("${BUTTON_ADD}")`)
      .click();

    cy.contains(INGREDIENTS.BIOKOTLET)
      .parents('li')
      .find(`button:contains("${BUTTON_ADD}")`)
      .click();

    cy.get('body').should('contain', INGREDIENTS.BIOKOTLET);
  });

  it('Открывает и закрывает модальное окно ингредиента (крестик)', () => {
    cy.contains(INGREDIENTS.KRATORNAYA_BUN).click();
    cy.get(SELECTORS.MODAL).should('be.visible');

    cy.get(SELECTORS.MODAL_CONTENT)
      .should('contain.text', INGREDIENTS.KRATORNAYA_BUN)
      .and('be.visible');

    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Открывает и закрывает модальное окно ингредиента (оверлей)', () => {
    cy.contains(INGREDIENTS.KRATORNAYA_BUN).click();
    cy.get(SELECTORS.MODAL).should('be.visible');

    cy.get(SELECTORS.MODAL_CONTENT)
      .should('contain.text', INGREDIENTS.KRATORNAYA_BUN)
      .and('be.visible');

    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Открывает и закрывает модальное окно ингредиента (Esc)', () => {
    cy.contains(INGREDIENTS.KRATORNAYA_BUN).click();
    cy.get(SELECTORS.MODAL).should('be.visible');

    cy.get(SELECTORS.MODAL_CONTENT)
      .should('contain.text', INGREDIENTS.KRATORNAYA_BUN)
      .and('be.visible');

    cy.get('body').type('{esc}');
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', SELECTORS.API_AUTH_USER, {
        fixture: SELECTORS.FIXTURE_USER
      }).as('getUser');
      cy.intercept('POST', SELECTORS.API_ORDERS, {
        fixture: SELECTORS.FIXTURE_ORDER
      }).as('createOrder');

      cy.fixture(SELECTORS.FIXTURE_REFRESH_TOKEN).then((tokenData) => {
        cy.setCookie(SELECTORS.ACCESS_TOKEN_COOKIE, tokenData.accessToken);
        cy.window().then((w) => {
          w.localStorage.setItem(
            SELECTORS.REFRESH_TOKEN_KEY,
            tokenData.refreshToken
          );
        });
      });

      cy.reload();
      cy.wait(['@fetchIngredients', '@getUser']);
    });

    it('Тест создания заказа', () => {
      addIngredient(INGREDIENTS.KRATORNAYA_BUN);
      addIngredient(INGREDIENTS.BIOKOTLET);
      addIngredient(INGREDIENTS.SPICY_SAUCE);

      cy.get('body').should('include.text', INGREDIENTS.KRATORNAYA_BUN);
      cy.get('body').should('include.text', INGREDIENTS.BIOKOTLET);
      cy.get('body').should('include.text', INGREDIENTS.SPICY_SAUCE);

      cy.contains(BUTTON_CREATE_ORDER).click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', ORDER.NUMBER);

      cy.get(SELECTORS.MODAL_CLOSE).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.contains(SELECTORS.SELECT_BUNS_TEXT).should('be.visible');
        cy.contains(SELECTORS.SELECT_FILLINGS_TEXT).should('be.visible');
      });
    });
  });
});
