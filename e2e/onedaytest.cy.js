beforeEach(() => {
  cy.visit(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  );
  cy.wait(5000);
});

it("Login with valid credential", () => {
  cy.get('input[name="username"]').type("Admin");
  cy.get('input[name="password"]').type("admin123");
  cy.intercept(
    "GET",
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary"
  ).as("actionSummary");
  cy.get('button[type="submit"]').click();
  cy.wait("@actionSummary");
});

it("Login without username", () => {
  cy.get('input[name="password"]').type("admin123");
  cy.intercept(
    "POST",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"
  ).as("loginRequest");
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});

it("Login without password ", () => {
  cy.get('input[name="username"]').type("Admin");
  cy.intercept(
    "POST",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"
  ).as("loginRequest");
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});

it("Login with wrong password", () => {
  cy.get('input[name="username"]').type("Admin");
  cy.get('input[name="password"]').type("wrongpassword");
  cy.intercept(
    "POST",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate",
    {
      statusCode: 302,
      body: {},
    }
  ).as("loginRequest");
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});

it("Login with wrong username", () => {
  cy.get('input[name="username"]').type("wrongusername");
  cy.get('input[name="password"]').type("admin123");
  cy.intercept(
    "POST",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate",
    {
      statusCode: 302,
      body: {},
    }
  ).as("loginRequest");
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});

it("Login with incorrect credentials", () => {
  cy.get('input[name="username"]').type("InvalidUser");
  cy.get('input[name="password"]').type("wrongpassword");
  cy.intercept(
    "POST",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"
  ).as("loginRequest");
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});

it("Logout after login succes", () => {
  cy.get('input[name="username"]').type("Admin");
  cy.get('input[name="password"]').type("admin123");
  cy.intercept(
    "GET",
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary"
  ).as("actionSummary");
  cy.get('button[type="submit"]').click();
  cy.wait("@actionSummary");
  cy.url().should("include", "/dashboard");
  cy.intercept(
    "GET",
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout"
  ).as("logoutRequest");
  cy.get(".oxd-userdropdown-tab").click();
  cy.contains("Logout").click();
  cy.wait("@logoutRequest");
});

Cypress.Commands.add("login", (username, password) => {
  cy.visit("https://opensource-demo.orangehrmlive.com/");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});
