import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/authentication");
  await page.waitForURL("http://localhost:3000/authentication");
});

test("should navigate to the authentication page", async ({ page }) => {
  await expect(page).toHaveURL("http://localhost:3000/authentication");
});

test("should have 'Trainix' as h1", async ({ page }) => {
  const h1 = page.getByRole("heading", {
    name: "Trainix",
    level: 1,
  });

  await expect(h1).toBeVisible();
});

test("should have 'Login with your account' as h2", async ({ page }) => {
  const h2 = page.getByRole("heading", {
    name: "Login with your account",
    level: 2,
  });

  await expect(h2).toBeVisible();
});

test("should have 'Enter your credentials below to login into' as p", async ({
  page,
}) => {
  const p = page.getByRole("paragraph");

  await expect(p).toBeVisible();
  await expect(p).toHaveText("Enter your credentials below to login into");
});

test("should have a form to input email and password", async ({ page }) => {
  const form = page.getByRole("form");

  expect(form).toBeDefined();

  const emailLabel = page.getByText("Email", { exact: true });
  const passwordLabel = page.getByText("Password", { exact: true });

  expect(emailLabel).toBeDefined();
  expect(passwordLabel).toBeDefined();

  const emailInput = page.getByPlaceholder("jhon.doe@email.com");
  const passwordInput = page.getByPlaceholder("Your password");

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  const submitButton = page.getByRole("button", { name: "Login" });

  await expect(submitButton).toBeVisible();
});

test("should display errors when the submitted form is empty", async ({
  page,
}) => {
  const submitButton = page.getByRole("button", { name: "Login" });
  await submitButton.click();

  const emailLabel = page.getByText("Email", { exact: true });
  const passwordLabel = page.getByText("Password", { exact: true });

  await expect(emailLabel).toHaveClass(/text-destructive/);
  await expect(passwordLabel).toHaveClass(/text-destructive/);

  const emailError = page.getByText("Invalid email format", {
    exact: true,
  });

  const passwordError = page.getByText(
    "Password must be at least 8 characters long",
    {
      exact: true,
    }
  );

  expect(emailError).toBeDefined();
  await expect(emailError).toHaveClass(/text-destructive/);

  expect(passwordError).toBeDefined();
  await expect(passwordError).toHaveClass(/text-destructive/);
});

test("should hide errors when the inputs are filled", async ({ page }) => {
  const submitButton = page.getByRole("button", { name: "Login" });
  await submitButton.click();

  const emailLabel = page.getByText("Email", { exact: true });
  const passwordLabel = page.getByText("Password", { exact: true });

  await expect(emailLabel).toHaveClass(/text-destructive/);
  await expect(passwordLabel).toHaveClass(/text-destructive/);

  const emailInput = page.getByPlaceholder("jhon.doe@email.com");
  const passwordInput = page.getByPlaceholder("Your password");

  await emailInput.fill("cris@gmail.com");
  await passwordInput.fill("123456789");

  await expect(emailLabel).not.toHaveClass(/text-destructive/);
  await expect(passwordLabel).not.toHaveClass(/text-destructive/);
});

test("should display an error toast with invalid credentials", async ({
  page,
}) => {
  const emailInput = page.getByPlaceholder("jhon.doe@email.com");
  const passwordInput = page.getByPlaceholder("Your password");

  await emailInput.fill("invalidEmail@gmail.com");
  await passwordInput.fill("invalidPassword");

  const submitButton = page.getByRole("button", { name: "Login" });
  await submitButton.click();

  const toastTitle = page.getByText("Uh oh! Something went wrong.", {
    exact: true,
  });
  const toastDescription = page.getByText(
    "Your credentials seems to be invalid, try it again with valid credentials.",
    { exact: true }
  );

  await expect(toastTitle).toBeVisible();
  await expect(toastDescription).toBeVisible();
});

test("should navigate to dashboard with correct credentials", async ({
  page,
}) => {
  const emailInput = page.getByPlaceholder("jhon.doe@email.com");
  const passwordInput = page.getByPlaceholder("Your password");

  await emailInput.fill("test@email.com");
  await passwordInput.fill("123456789");

  const submitButton = page.getByRole("button", { name: "Login" });
  await submitButton.click();

  await page.waitForURL("http://localhost:3000/dashboard");
  await expect(page).toHaveURL("http://localhost:3000/dashboard");
});
